const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// --- CONFIGURE these via environment variables ---
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI; // e.g. https://espacoadriana.pt/auth/callback
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Adriana's email (used as key for token storage)
const PORT = process.env.PORT || 3000;
// -------------------------------------------------

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !ADMIN_EMAIL) {
  console.error('Missing required environment variables. See .env.example');
  process.exit(1);
}

const TOKEN_STORE_PATH = path.join(__dirname, 'token-store.json');
// Simple token store for demo. Replace with DB or secret store in production.
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
  const db = readTokenStore();
  return db[email] || null;
}

// create OAuth2 client factory
function createOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

const app = express();
app.use(helmet());
app.use(bodyParser.json());

// ------------- Endpoint: /auth/login -------------
// Redirect Adriana to the Google consent screen to obtain offline access (refresh token)
app.get('/auth/login', (req, res) => {
  const oAuth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events', // minimal scope to create events
    'https://www.googleapis.com/auth/userinfo.email' // to fetch email if needed
  ];
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',    // important to get a refresh token
    prompt: 'consent',        // force showing consent to ensure refresh_token is returned
    scope: scopes
  });
  res.redirect(authUrl);
});

// ------------- Endpoint: /auth/callback -------------
// Exchange code for tokens and persist refresh_token securely.
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');
  const oAuth2Client = createOAuth2Client();

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Get the authorized user's email (useful if multiple accounts)
    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const userinfo = await oauth2.userinfo.get();
    const email = userinfo.data.email || ADMIN_EMAIL;

    // Save refresh token for future use. Must store refresh_token securely.
    // tokens.refresh_token may be undefined if the user already authorized and Google didn't return it.
    const existing = getTokensForUser(email) || {};
    const toSave = {
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date || null,
      refresh_token: tokens.refresh_token || existing.refresh_token // preserve existing if not returned now
    };
    if (!toSave.refresh_token) {
      // No refresh token present. Inform admin to re-consent with prompt=consent and ensure first-time flow.
      console.warn('No refresh token received from Google. You may need to ask for re-consent with prompt=consent.');
      // Still save access token temporarily
    }
    saveTokenForUser(email, toSave);

    res.send(`Authorization successful for ${email}. You can close this window.`);
  } catch (err) {
    console.error('Error exchanging code for token', err);
    res.status(500).send('Token exchange failed');
  }
});

// ------------- Utility: get authorized calendar client for email -------------
async function getAuthorizedCalendarClient(email) {
  const tokens = getTokensForUser(email);
  if (!tokens || !tokens.refresh_token) {
    throw new Error(`No refresh token stored for ${email}. Run /auth/login as that user first.`);
  }

  const oAuth2Client = createOAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token
  });

  // googleapis will automatically refresh access tokens when needed
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  return { calendar, oAuth2Client };
}

// ------------- Endpoint: /events/create -------------
// Called by your booking logic to create an event on Adriana's calendar
// Example POST body:
// {
//   "email": "client@example.com",
//   "name": "Client Name",
//   "summary": "Sessão com Adriana - Terapia",
//   "description": "Detalhes da reserva...",
//   "start": "2025-09-08T10:00:00+01:00",
//   "end": "2025-09-08T11:00:00+01:00",
//   "location": "Online / Rua X 123"
// }
app.post('/events/create', async (req, res) => {
  // In production, validate webhook/source, authenticate caller (only your server should call)
  const booking = req.body;
  if (!booking || !booking.start || !booking.end || !booking.summary) {
    return res.status(400).json({ error: 'Missing required booking fields: start, end, summary' });
  }

  try {
    const { calendar, oAuth2Client } = await getAuthorizedCalendarClient(ADMIN_EMAIL);

    const event = {
      summary: booking.summary,
      description: booking.description || '',
      start: { dateTime: booking.start }, // ISO 8601 string with timezone offset
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
      sendUpdates: 'all' // or 'none' depending on whether you want to notify attendees
    });

    // Optionally update token store with latest access_token/expiry_date
    const credentials = oAuth2Client.credentials || {};
    if (credentials.access_token || credentials.expiry_date) {
      saveTokenForUser(ADMIN_EMAIL, {
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date
      });
    }

    return res.json({ success: true, eventId: inserted.data.id, htmlLink: inserted.data.htmlLink });
  } catch (err) {
    console.error('Failed to create calendar event', err);
    return res.status(500).json({ error: 'Failed to create event', details: err.message });
  }
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Login endpoint: http://localhost:${PORT}/auth/login`);
  console.log(`Callback endpoint: ${REDIRECT_URI}`);
});
