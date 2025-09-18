import { google } from 'googleapis';

export default async function handler(req, res) {
  // Environment variables
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || process.env.ADMIN_REFRESH_TOKEN || null;

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
    hasRedirectUri: !!REDIRECT_URI,
    hasAdminEmail: !!ADMIN_EMAIL,
    hasRefreshToken: !!REFRESH_TOKEN,
    refreshTokenLength: REFRESH_TOKEN ? REFRESH_TOKEN.length : 0,
    clientIdPrefix: CLIENT_ID ? CLIENT_ID.substring(0, 20) + '...' : null,
    adminEmail: ADMIN_EMAIL
  };

  console.log('Environment test:', envStatus);

  // Test OAuth2 client creation
  let oauthTest = { success: false, error: null };
  try {
    if (CLIENT_ID && CLIENT_SECRET && REDIRECT_URI) {
      const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
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
    if (REFRESH_TOKEN) {
      // Basic validation - check if it looks like a JWT
      const parts = REFRESH_TOKEN.split('.');
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
}