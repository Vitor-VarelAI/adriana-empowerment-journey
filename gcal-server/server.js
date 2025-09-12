const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const PORT = process.env.PORT || 3000;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || process.env.ADMIN_REFRESH_TOKEN || null;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !ADMIN_EMAIL) {
  console.error('Missing required environment variables. See .env.example');
  process.exit(1);
}

const TOKEN_STORE_PATH = path.join(__dirname, 'token-store.json');

// Token management functions
function readTokenStore() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_STORE_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveTokenForUser(email, tokens) {
  const db = readTokenStore();
  db[email] = { ...db[email], ...tokens };
  fs.writeFileSync(TOKEN_STORE_PATH, JSON.stringify(db, null, 2));
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
app.use(helmet());

// CORS configurável por ambiente (CLIENT_ORIGIN), com fallback para localhost:8080
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:8080';
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
app.use(bodyParser.json());

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
app.post('/events/create', async (req, res) => {
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
      details: err.message
    });
  }
});

// Availability check endpoint
app.post('/availability', async (req, res) => {
  const { date, timeZone = 'Europe/Lisbon' } = req.body;
  
  if (!date) {
    return res.status(400).json({
      error: 'Date parameter is required',
      receivedParams: Object.keys(req.body)
    });
  }

  try {
    const { calendar } = await getAuthorizedCalendarClient(ADMIN_EMAIL);

    // Parse the date and create time range for the entire day
    const requestDate = new Date(date);
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
    const dayOfWeek = new Date(date).getDay();
    const fallbackTimes = (dayOfWeek === 0 || dayOfWeek === 6)
      ? ["10:00", "11:00"]
      : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    res.json({
      success: true,
      date: date,
      timeZone,
      availableTimes: fallbackTimes,
      fallback: true,
      error: err.message
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
