import { google } from 'googleapis';

export default async function handler(req, res) {
  // Environment variables (direct from process.env)
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  // Token management for serverless environment
  // Note: Serverless runtimes are ephemeral. For production, set a long-lived
  // refresh token in env var `GOOGLE_REFRESH_TOKEN` (or `ADMIN_REFRESH_TOKEN`).
  // This handler will display the received refresh token once, so you can copy it
  // and configure it in Vercel Project Settings.
  const tokenStore = new Map();

  function saveTokenForUser(email, tokens) {
    const existing = tokenStore.get(email) || {};
    const toSave = {
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date || null,
      refresh_token: tokens.refresh_token || existing.refresh_token
    };

    tokenStore.set(email, toSave);
    console.log(`Token saved for user: ${email}`);
  }

  function getTokensForUser(email) {
    return tokenStore.get(email) || null;
  }

  // OAuth2 client factory
  function createOAuth2Client() {
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const oAuth2Client = createOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const userinfo = await oauth2.userinfo.get();
    const email = userinfo.data.email || ADMIN_EMAIL;

    // Save tokens
    const existing = getTokensForUser(email) || {};
    const toSave = {
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date || null,
      refresh_token: tokens.refresh_token || existing.refresh_token
    };

    if (!toSave.refresh_token) {
      console.warn('No refresh token received from Google');
    }

    saveTokenForUser(email, toSave);

    // Send success response (show refresh token so it can be copied to env)
    const displayRefresh = toSave.refresh_token ? `
      <p><strong>Refresh Token (copy to Vercel env as GOOGLE_REFRESH_TOKEN):</strong></p>
      <pre style="white-space: pre-wrap; word-break: break-all; border: 1px solid #ccc; padding: 12px; background: #f9f9f9;">${toSave.refresh_token}</pre>
      <p><em>Keep this secret. Do not share publicly.</em></p>
    ` : `
      <p><strong>No refresh token received.</strong> If you have previously authorized this client, Google may not return a refresh token. Try revoking existing access and re-authorizing with prompt=consent.</p>
    `;

    res.send(`
      <html>
        <head><title>Authorization Successful</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>✅ Authorization Successful</h1>
          <p>Authorization completed for <strong>${email}</strong></p>
          <div style="max-width: 700px; margin: 20px auto; text-align: left;">${displayRefresh}</div>
          <p>After setting the token in Vercel, you can close this window.</p>
          <script>
            // Try to close the window after a short delay
            setTimeout(function() {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send(`
      <html>
        <head><title>Authorization Failed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>❌ Authorization Failed</h1>
          <p>There was an error completing the authorization process.</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p>Please try again or contact support.</p>
        </body>
      </html>
    `);
  }
}