const { google } = require('googleapis');

module.exports = async (req, res) => {
  const { GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_REDIRECT_URI: REDIRECT_URI, GOOGLE_OAUTH_REDIRECT_URI } = process.env;
  const redirectUri = REDIRECT_URI || GOOGLE_OAUTH_REDIRECT_URI;

  // OAuth2 client factory
  function createOAuth2Client() {
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
  }

  // Validate environment variables
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error('Missing env vars:', missing);
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Redirect to Google OAuth
    res.setHeader('Location', authUrl);
    res.status(302).end();
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({
      error: 'Failed to initiate OAuth flow',
      details: error.message
    });
  }
}