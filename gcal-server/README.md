# gcal-server

Minimal Node.js Express server to integrate Google Calendar for Espaço Adriana.

## Quick start

1. Choose environment file:
   - Development: copy `.env.development` to `.env.development` (already provided with sensible defaults) and fill your DEV Google OAuth credentials.
   - Production: copy `.env.example` to `.env` and fill your PROD Google OAuth credentials.
2. Install dependencies: `npm install`.
3. Start server:
   - Dev: `NODE_ENV=development npm start` (loads `.env.development` if present)
   - Prod: `npm start` (loads `.env`)
4. Visit `/auth/login` to authorize and obtain a refresh token (ensure the token matches the client configured in your env file).
5. Use POST `/events/create` to create calendar events.

## Environment variables

- GOOGLE_CLIENT_ID: OAuth2 Client ID from Google Cloud Console.
- GOOGLE_CLIENT_SECRET: OAuth2 Client Secret.
- GOOGLE_REDIRECT_URI: OAuth redirect URI (canonical name). Example dev: `http://localhost:8083/auth/callback`.
  - Legacy name `GOOGLE_OAUTH_REDIRECT_URI` is still read for backward compatibility, but `GOOGLE_REDIRECT_URI` is preferred.
- ADMIN_EMAIL: Calendar owner email (used for token association and API calls).
- PORT: Server port (default dev `3001`).
- NODE_ENV: `development` or `production` (controls which `.env.*` file is loaded).
- CLIENT_ORIGIN: Allowed CORS origin for the frontend.

Notes:
- The refresh token must belong to the same OAuth client configured via `GOOGLE_CLIENT_ID` and `GOOGLE_REDIRECT_URI`. If you switch clients, re-authorize with `prompt=consent&access_type=offline` to generate a new token.
