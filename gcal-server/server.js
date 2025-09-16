import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import CryptoJS from 'crypto-js';
import rateLimit from 'express-rate-limit';

// Load environment variables from the correct file per NODE_ENV
// Tries .env.<NODE_ENV> first (if present), otherwise falls back to .env
const __dirnameLocal = path.dirname(new URL(import.meta.url).pathname);
const envFileByNodeEnv = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : null;
const candidateEnvPath = envFileByNodeEnv ? path.join(__dirnameLocal, envFileByNodeEnv) : null;
const defaultEnvPath = path.join(__dirnameLocal, '.env');
try {
  if (candidateEnvPath && fs.existsSync(candidateEnvPath)) {
    config({ path: candidateEnvPath });
    console.log(`Loaded env file: ${candidateEnvPath}`);
  } else if (fs.existsSync(defaultEnvPath)) {
    config({ path: defaultEnvPath });
    console.log(`Loaded env file: ${defaultEnvPath}`);
  } else {
    config();
    console.log('Loaded env from process (no local .env file found)');
  }
} catch (e) {
  console.warn('dotenv config failed, continuing with process.env only:', e.message);
}

// Environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Prefer GOOGLE_REDIRECT_URI; fallback to GOOGLE_OAUTH_REDIRECT_URI for backward compatibility
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_OAUTH_REDIRECT_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const PORT = process.env.PORT || 3000;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || process.env.ADMIN_REFRESH_TOKEN || null;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const TRUST_PROXY_HOPS = process.env.TRUST_PROXY_HOPS || '1';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !ADMIN_EMAIL) {
  console.error('Missing required environment variables. See .env.example');
  process.exit(1);
}

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  console.error('ENCRYPTION_KEY is required and must be at least 32 characters long. See .env.example');
  process.exit(1);
}

// Startup diagnostics (one-time): confirm which credentials are in use
console.log('Environment:', process.env.NODE_ENV || 'undefined');
console.log('OIDC client in use:', CLIENT_ID);
console.log('Redirect URI in use:', REDIRECT_URI);
console.log('Has refresh token:', !!(process.env.GOOGLE_REFRESH_TOKEN || process.env.ADMIN_REFRESH_TOKEN));
console.log('Trust proxy hops:', TRUST_PROXY_HOPS);

const TOKEN_STORE_PATH = path.join(new URL('.', import.meta.url).pathname, 'token-store.json');

// Run migration on startup if needed
migrateTokenStoreIfNeeded();

// Token management functions with encryption
function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

function decryptData(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error('Failed to decrypt data:', e.message);
    return null;
  }
}

// Handle migration from old plaintext token store
function migrateTokenStoreIfNeeded() {
  try {
    const data = fs.readFileSync(TOKEN_STORE_PATH, 'utf8');
    if (!data.trim()) return;

    // Try to parse as JSON first (old format)
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        console.log('🔄 Migrating plaintext token store to encrypted format...');
        const encrypted = encryptData(parsed);
        fs.writeFileSync(TOKEN_STORE_PATH, encrypted, 'utf8');
        console.log('✅ Token store migration completed');
      }
    } catch (parseError) {
      // If it's not JSON, assume it's already encrypted
      console.log('🔒 Token store appears to be already encrypted');
    }
  } catch (readError) {
    // File doesn't exist, which is fine
  }
}

function readTokenStore() {
  try {
    const data = fs.readFileSync(TOKEN_STORE_PATH, 'utf8');
    if (!data.trim()) return {};
    const decrypted = decryptData(data);
    return decrypted || {};
  } catch (e) {
    return {};
  }
}

function saveTokenForUser(email, tokens) {
  const db = readTokenStore();
  db[email] = { ...db[email], ...tokens };
  const encrypted = encryptData(db);
  fs.writeFileSync(TOKEN_STORE_PATH, encrypted, 'utf8');
}

function getTokensForUser(email) {
  if (REFRESH_TOKEN) {
    return { refresh_token: REFRESH_TOKEN };
  }
  const db = readTokenStore();
  return db[email] || null;
}

// OAuth2 client factory
function createOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

const app = express();

// Configure trust proxy for rate limiting when behind reverse proxy
app.set('trust proxy', TRUST_PROXY_HOPS);

app.use(helmet());

// CORS configurável por ambiente (CLIENT_ORIGIN), com fallback para localhost:8080
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:8080';

// Validate and set CORS origin
const isValidOrigin = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

app.use(cors({
  origin: isValidOrigin(CLIENT_ORIGIN) ? CLIENT_ORIGIN : 'http://localhost:8080',
  credentials: true
}));
app.use(bodyParser.json());

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for event creation
const eventCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 event creations per windowMs
  message: {
    error: 'Too many booking attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Authentication endpoints
app.get('/auth/login', (req, res) => {
  const oAuth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes
  });
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');
  
  const oAuth2Client = createOAuth2Client();

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const userinfo = await oauth2.userinfo.get();
    const email = userinfo.data.email || ADMIN_EMAIL;

    const existing = getTokensForUser(email) || {};
    const toSave = {
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date || null,
      refresh_token: tokens.refresh_token || existing.refresh_token
    };
    
    if (!toSave.refresh_token) {
      console.warn('No refresh token received from Google.');
    }
    
    saveTokenForUser(email, toSave);
    res.send(`Authorization successful for ${email}. You can close this window.`);
  } catch (err) {
    console.error('Error exchanging code for token', err);
    res.status(500).send('Token exchange failed');
  }
});

// Utility function to get authorized calendar client
async function getAuthorizedCalendarClient(email) {
  const tokens = getTokensForUser(email);
  if (!tokens || !tokens.refresh_token) {
    throw new Error(`No refresh token stored for ${email}. Run /auth/login as that user first.`);
  }

  const oAuth2Client = createOAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token
  });

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  return { calendar, oAuth2Client };
}

// Event creation endpoint
app.post('/events/create', eventCreationLimiter, async (req, res) => {
  const booking = req.body;
  
  if (!booking || !booking.start || !booking.end || !booking.summary) {
    return res.status(400).json({ 
      error: 'Missing required booking fields: start, end, summary',
      receivedFields: Object.keys(booking || {})
    });
  }

  try {
    const { calendar, oAuth2Client } = await getAuthorizedCalendarClient(ADMIN_EMAIL);

    const event = {
      summary: booking.summary,
      description: booking.description || '',
      start: { dateTime: booking.start },
      end: { dateTime: booking.end },
      location: booking.location || undefined,
      attendees: booking.email ? [{ email: booking.email }] : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const inserted = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });

    // Update token store with latest credentials
    const updatedCredentials = oAuth2Client.credentials || {};
    if (updatedCredentials.access_token || updatedCredentials.expiry_date) {
      saveTokenForUser(ADMIN_EMAIL, {
        access_token: updatedCredentials.access_token,
        expiry_date: updatedCredentials.expiry_date
      });
    }

    return res.json({ 
      success: true, 
      eventId: inserted.data.id, 
      htmlLink: inserted.data.htmlLink
    });
  } catch (err) {
    console.error('Event creation failed:', err);
    
    let userMessage = 'Failed to create event';
    if (err.code === 401 || err.message?.includes('unauthorized')) {
      userMessage = 'Authentication failed. Please re-authorize the calendar access.';
    } else if (err.code === 403 || err.message?.includes('forbidden')) {
      userMessage = 'Permission denied. Check calendar access permissions.';
    } else if (err.code === 429 || err.message?.includes('rate limit')) {
      userMessage = 'Too many requests. Please try again later.';
    } else if (err.message?.includes('invalid')) {
      userMessage = 'Invalid request data. Please check the booking details.';
    }
    
    return res.status(500).json({
      error: userMessage,
      ...(process.env.NODE_ENV === 'development' ? { details: err.message } : {})
    });
  }
});

// Availability check endpoint
app.post('/availability', async (req, res) => {
  const { date, timeZone = 'Europe/Lisbon' } = req.body;

  // Validate date format and content
  if (!date || typeof date !== 'string') {
    return res.status(400).json({
      error: 'Date parameter is required and must be a string',
      receivedParams: Object.keys(req.body)
    });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Please use YYYY-MM-DD format',
      received: date
    });
  }

  // Validate date is not in the past and is reasonable (within next year)
  const requestDate = new Date(date);
  const now = new Date();
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  if (isNaN(requestDate.getTime())) {
    return res.status(400).json({
      error: 'Invalid date value',
      received: date
    });
  }

  if (requestDate < now.setHours(0, 0, 0, 0)) {
    return res.status(400).json({
      error: 'Date cannot be in the past',
      received: date
    });
  }

  if (requestDate > oneYearFromNow) {
    return res.status(400).json({
      error: 'Date cannot be more than one year in the future',
      received: date
    });
  }

  try {
    const { calendar } = await getAuthorizedCalendarClient(ADMIN_EMAIL);

    // Create time range for the entire day (requestDate is already validated above)
    const startDateTime = new Date(requestDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    const endDateTime = new Date(requestDate);
    endDateTime.setHours(23, 59, 59, 999);

    // Get busy times from Google Calendar
    const busyTimes = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime.toISOString(),
        timeMax: endDateTime.toISOString(),
        items: [{ id: 'primary' }]
      }
    });

    // Define working hours
    const dayOfWeek = requestDate.getDay();
    const workingHours = (dayOfWeek === 0 || dayOfWeek === 6) 
      ? [
          { start: '10:00', end: '11:00' },
          { start: '11:00', end: '12:00' }
        ]
      : [
          { start: '09:00', end: '10:00' },
          { start: '10:00', end: '11:00' },
          { start: '11:00', end: '12:00' },
          { start: '14:00', end: '15:00' },
          { start: '15:00', end: '16:00' },
          { start: '16:00', end: '17:00' },
          { start: '17:00', end: '18:00' }
        ];

    // Extract and convert busy slots
    const busySlots = busyTimes.data.calendars?.primary?.busy || [];
    const busyTimeStrings = busySlots.map(slot => {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      return {
        start: start.toTimeString().slice(0, 5),
        end: end.toTimeString().slice(0, 5)
      };
    });

    // Filter available times by removing busy times
    const availableTimes = workingHours.filter(slot => {
      return !busyTimeStrings.some(busy => {
        return (slot.start < busy.end && slot.end > busy.start);
      });
    });

    // Return final available times
    const finalAvailableTimes = availableTimes.map(slot => slot.start);

    res.json({
      success: true,
      date: date,
      timeZone,
      availableTimes: finalAvailableTimes
    });

  } catch (err) {
    console.error('Availability check failed:', err);
    
    // Fallback to mocked times if Google Calendar fails
    const dayOfWeek = requestDate.getDay();
    const fallbackTimes = (dayOfWeek === 0 || dayOfWeek === 6)
      ? ["10:00", "11:00"]
      : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    res.json({
      success: true,
      date: date,
      timeZone,
      availableTimes: fallbackTimes,
      fallback: true,
      ...(process.env.NODE_ENV === 'development' ? { error: err.message } : {})
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
app.listen(PORT, () => {
  console.log(`Google Calendar API server listening on http://localhost:${PORT}`);
  console.log(`Login endpoint: http://localhost:${PORT}/auth/login`);
});
