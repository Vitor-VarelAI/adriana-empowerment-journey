# gcal-server

Minimal Node.js Express server to integrate Google Calendar for Espaço Adriana.

## Quick start

1. Copy `.env.example` to `.env` and fill your Google OAuth credentials and `ADMIN_EMAIL`.
2. Install dependencies: `npm install`.
3. Start server: `npm start`.
4. Visit `/auth/login` to authorize Adriana and obtain refresh token.
5. Use POST `/events/create` to create calendar events.
