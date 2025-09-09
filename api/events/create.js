const { google } = require('googleapis');
require('dotenv').config();

// Environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !ADMIN_EMAIL) {
  console.error('Missing required environment variables');
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Server configuration error' }),
    headers: { 'Content-Type': 'application/json' }
  };
}

// Token management for serverless environment
const tokenStore = new Map();

function getTokensForUser(email) {
  return tokenStore.get(email) || null;
}

// OAuth2 client factory
function createOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

// Utility function to get authorized calendar client
async function getAuthorizedCalendarClient(email) {
  const tokens = getTokensForUser(email);
  if (!tokens || !tokens.refresh_token) {
    throw new Error(`No refresh token stored for ${email}. Run /api/auth/login first.`);
  }

  const oAuth2Client = createOAuth2Client();
  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token
  });

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  return { calendar, oAuth2Client };
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const booking = req.body;
    
    // Validate booking data
    if (!booking || !booking.start || !booking.end || !booking.summary) {
      return res.status(400).json({ 
        error: 'Missing required booking fields: start, end, summary',
        receivedFields: Object.keys(booking || {})
      });
    }

    const { calendar, oAuth2Client } = await getAuthorizedCalendarClient(ADMIN_EMAIL);

    // Create event object
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

    // Create event in Google Calendar
    const inserted = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });

    // Update token store with latest credentials
    const updatedCredentials = oAuth2Client.credentials || {};
    if (updatedCredentials.access_token || updatedCredentials.expiry_date) {
      const existingTokens = getTokensForUser(ADMIN_EMAIL) || {};
      const updatedTokens = {
        ...existingTokens,
        access_token: updatedCredentials.access_token,
        expiry_date: updatedCredentials.expiry_date
      };
      tokenStore.set(ADMIN_EMAIL, updatedTokens);
    }

    return res.json({ 
      success: true, 
      eventId: inserted.data.id, 
      htmlLink: inserted.data.htmlLink
    });
  } catch (error) {
    console.error('Event creation failed:', error);
    
    let userMessage = 'Failed to create event';
    let statusCode = 500;
    
    if (error.code === 401 || error.message?.includes('unauthorized')) {
      userMessage = 'Authentication failed. Please re-authorize the calendar access.';
      statusCode = 401;
    } else if (error.code === 403 || error.message?.includes('forbidden')) {
      userMessage = 'Permission denied. Check calendar access permissions.';
      statusCode = 403;
    } else if (error.code === 429 || error.message?.includes('rate limit')) {
      userMessage = 'Too many requests. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('invalid')) {
      userMessage = 'Invalid request data. Please check the booking details.';
      statusCode = 400;
    }
    
    return res.status(statusCode).json({ 
      error: userMessage, 
      details: error.message 
    });
  }
}
