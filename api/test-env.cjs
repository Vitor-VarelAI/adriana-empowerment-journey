const { google } = require('googleapis');

module.exports = async (req, res) => {
  const { GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_REDIRECT_URI: REDIRECT_URI, GOOGLE_OAUTH_REDIRECT_URI, ADMIN_EMAIL, GOOGLE_REFRESH_TOKEN, ADMIN_REFRESH_TOKEN } = process.env;
  const redirectUri = REDIRECT_URI || GOOGLE_OAUTH_REDIRECT_URI;
  const refreshToken = GOOGLE_REFRESH_TOKEN || ADMIN_REFRESH_TOKEN;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const envStatus = {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRedirectUri: !!redirectUri,
    hasAdminEmail: !!ADMIN_EMAIL,
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken ? refreshToken.length : 0,
    clientIdPrefix: CLIENT_ID ? CLIENT_ID.substring(0, 20) + '...' : null,
    adminEmail: ADMIN_EMAIL
  };

  console.log('Environment test:', envStatus);

  // Test OAuth2 client creation
  let oauthTest = { success: false, error: null };
  try {
    if (CLIENT_ID && CLIENT_SECRET && redirectUri) {
      const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
      oauthTest.success = true;
      oauthTest.message = 'OAuth2 client created successfully';
    } else {
      oauthTest.error = 'Missing OAuth2 credentials';
    }
  } catch (error) {
    oauthTest.error = error.message;
  }

  // Test token validation
  let tokenTest = { success: false, error: null };
  try {
    if (refreshToken) {
      // Basic validation - check if it looks like a JWT
      const parts = refreshToken.split('.');
      if (parts.length === 3) {
        tokenTest.success = true;
        tokenTest.message = 'Refresh token format appears valid';
      } else {
        tokenTest.error = 'Refresh token does not appear to be a valid JWT';
      }
    } else {
      tokenTest.error = 'No refresh token configured';
    }
  } catch (error) {
    tokenTest.error = error.message;
  }

  res.json({
    timestamp: new Date().toISOString(),
    environment: envStatus,
    oauth2Client: oauthTest,
    refreshToken: tokenTest,
    overallStatus: (envStatus.hasClientId && envStatus.hasClientSecret && envStatus.hasRedirectUri && envStatus.hasAdminEmail && envStatus.hasRefreshToken) ? 'CONFIGURED' : 'MISSING_VARIABLES'
  });
};