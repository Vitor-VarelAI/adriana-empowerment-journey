const { google } = require('googleapis');
require('dotenv').config();

// Environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || process.env.ADMIN_REFRESH_TOKEN || null;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !ADMIN_EMAIL) {
  console.error('Missing required environment variables');
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Server configuration error' }),
    headers: { 'Content-Type': 'application/json' }
  };
}

// Token management for serverless environment
// In production, prefer using a long-lived refresh token from env.
// tokenStore only provides an in-memory fallback during a single runtime.
const tokenStore = new Map();

function getTokensForUser(email) {
  if (REFRESH_TOKEN) {
    return { refresh_token: REFRESH_TOKEN };
  }
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
    const { date, timeZone = 'Europe/Lisbon' } = req.body;
    
    if (!date) {
      return res.status(400).json({
        error: 'Date parameter is required',
        receivedParams: Object.keys(req.body)
      });
    }

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

  } catch (error) {
    console.error('Availability check failed:', error);
    
    // Fallback to mocked times if Google Calendar fails
    const { date } = req.body;
    const dayOfWeek = new Date(date).getDay();
    const fallbackTimes = (dayOfWeek === 0 || dayOfWeek === 6)
      ? ["10:00", "11:00"]
      : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    res.json({
      success: true,
      date: date,
      timeZone: 'Europe/Lisbon',
      availableTimes: fallbackTimes,
      fallback: true,
      error: error.message
    });
  }
}
