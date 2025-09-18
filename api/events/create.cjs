const { google } = require('googleapis');

module.exports = async (req, res) => {
  const { GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_REDIRECT_URI: REDIRECT_URI, GOOGLE_OAUTH_REDIRECT_URI, ADMIN_EMAIL, GOOGLE_REFRESH_TOKEN, ADMIN_REFRESH_TOKEN } = process.env;
  const redirectUri = REDIRECT_URI || GOOGLE_OAUTH_REDIRECT_URI;
  const refreshToken = GOOGLE_REFRESH_TOKEN || ADMIN_REFRESH_TOKEN;

  // Token management for serverless environment
  // In production, prefer using a long-lived refresh token from env.
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

  // Debug: Log environment variables (remove in production)
  console.log('Environment check:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRedirectUri: !!REDIRECT_URI,
    hasAdminEmail: !!ADMIN_EMAIL,
    hasRefreshToken: !!REFRESH_TOKEN,
    refreshTokenLength: REFRESH_TOKEN ? REFRESH_TOKEN.length : 0
  });

  try {
    const booking = req.body;

    // Validate booking data
    if (!booking || !booking.start || !booking.end || !booking.summary) {
      return res.status(400).json({
        error: 'Missing required booking fields: start, end, summary',
        receivedFields: Object.keys(booking || {})
      });
    }

    console.log('Getting authorized calendar client for:', ADMIN_EMAIL);
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

    console.log('Creating event with data:', {
      summary: event.summary,
      start: event.start,
      end: event.end,
      attendees: event.attendees ? 'present' : 'none'
    });

    // Create event in Google Calendar
    const inserted = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });

    console.log('Event created successfully:', inserted.data.id);

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
    console.error('Event creation failed:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });

    let userMessage = 'Failed to create event';
    let statusCode = 500;

    // Handle specific Google API errors
    if (error.code === 401 || error.message?.includes('unauthorized') || error.message?.includes('Invalid Credentials')) {
      userMessage = 'Authentication failed. The access token may be expired. Please re-authorize the calendar access.';
      statusCode = 401;
      console.error('Authentication error - token may be expired');
    } else if (error.code === 403 || error.message?.includes('forbidden') || error.message?.includes('access_denied')) {
      userMessage = 'Permission denied. Check calendar access permissions in Google Cloud Console.';
      statusCode = 403;
      console.error('Permission error - check Google Calendar API permissions');
    } else if (error.code === 429 || error.message?.includes('rate limit')) {
      userMessage = 'Too many requests. Please try again later.';
      statusCode = 429;
    } else if (error.code === 400 || error.message?.includes('invalid')) {
      userMessage = 'Invalid request data. Please check the booking details.';
      statusCode = 400;
    } else if (error.message?.includes('refresh') && error.message?.includes('token')) {
      userMessage = 'Refresh token is invalid or expired. Please re-authorize the application.';
      statusCode = 401;
      console.error('Refresh token error - needs re-authorization');
    } else if (error.message?.includes('No refresh token')) {
      userMessage = 'No refresh token configured. Please complete the OAuth setup first.';
      statusCode = 401;
      console.error('Missing refresh token - OAuth setup incomplete');
    }

    return res.status(statusCode).json({
      error: userMessage,
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
}