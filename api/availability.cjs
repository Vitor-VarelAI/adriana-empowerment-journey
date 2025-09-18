const { google } = require('googleapis');

module.exports = async (req, res) => {
  const { GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_REDIRECT_URI: REDIRECT_URI, GOOGLE_OAUTH_REDIRECT_URI, ADMIN_EMAIL, GOOGLE_REFRESH_TOKEN, ADMIN_REFRESH_TOKEN } = process.env;
  const redirectUri = REDIRECT_URI || GOOGLE_OAUTH_REDIRECT_URI;
  const refreshToken = GOOGLE_REFRESH_TOKEN || ADMIN_REFRESH_TOKEN;

  // Token management for serverless environment
  // In production, prefer using a long-lived refresh token from env.
  // tokenStore only provides an in-memory fallback during a single runtime.
  const tokenStore = new Map();

  function getTokensForUser(email) {
    if (refreshToken) {
      return { refresh_token: refreshToken };
    }
    return tokenStore.get(email) || null;
  }

  // OAuth2 client factory
  function createOAuth2Client() {
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
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

  // Validate environment variables
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'ADMIN_EMAIL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error('Missing env vars:', missing);
    return res.status(500).json({ error: 'Server configuration error' });
  }

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