# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview
- Professional coaching website with real-time Google Calendar integration.
- Next.js (App Router) hosts the marketing UI and API routes.
- Shared React components live under `src/` and are consumed by the Next app.
- Google Calendar OAuth, availability, and booking creation rodam em handlers Next.js com Supabase como persistência.

## Essential Commands
### Development
- `npm install` – Install dependencies (lockfile is `package-lock.json`).
- `npm run dev` – Start the Next.js dev server (pages + API routes).
- `npm run build` – Production build for the Next.js app.
- `npm run start` – Run the production build locally.
- `npm run lint` – ESLint.
- `npm run test` – Placeholder (currently no automated tests).

### Backend (Google Calendar API + Supabase)
- Route handlers located in `app/api/**`.
- Usa Supabase (`src/db/client.ts`) para persistir tokens OAuth (`auth_tokens`) e bookings.
- Migrações versionadas em `supabase/migrations/`.
- Variáveis: `GOOGLE_*`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `EDGE_CONFIG`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_FORMSPREE_ID` (opcional).

## Architecture
- React 19 + TypeScript components in `src/` reused throughout the Next app.
- Styling via Tailwind + shadcn/ui (Radix primitives).
- State via React Context + TanStack Query.

### Backend Integration
- `app/api/availability` – free/busy checks against Google Calendar e configuração vinda do Edge Config.
- `app/api/events/create` – event creation + database persistence with Supabase.
- `app/api/auth/login|callback` – OAuth login flow, token storage handled server-side.
- Persistimos apenas tokens + bookings (perfis/pagamentos planejados, não implementados).
- RLS habilitado nas tabelas criadas para uso com service role.

## Development Notes
- Favor strict TypeScript; avoid `any`.
- Keep `useEffect` dependencies complete and memoize callbacks.
- UI already enforces booking flow steps; maintain accessibility considerations.
- LocalStorage is only used as a lightweight client cache for booked time slots (no secrets).

## Testing Snippets
```bash
# Availability (POST /api/availability)
curl -X POST http://localhost:3000/api/availability \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-09-10", "timeZone": "Europe/Lisbon"}'

# Event creation (POST /api/events/create)
curl -X POST http://localhost:3000/api/events/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test Client", "summary": "Test Session", "description": "Test description", "start": "2025-09-10T10:00:00+01:00", "end": "2025-09-10T11:00:00+01:00", "location": "Online"}'
```

## Common Issues
- **Google OAuth**: Refresh token required; re-authorize if `/api/events/create` returns 401.
- **Database**: Garanta que `SUPABASE_URL`/keys estejam corretos e que as migrações foram aplicadas.
- **Formspree**: Configure `NEXT_PUBLIC_FORMSPREE_ID` if email notifications are desired.
- **Builds**: Run `npm run build` before shipping to confirm the pipeline.

## 🚀 GOOGLE OAUTH TROUBLESHOOTING

### Current Status
The system has a working Google OAuth setup, but the refresh token in `.env.local` is invalid ("invalid_grant" error). The booking system gracefully falls back to predefined time slots when Google Calendar integration fails.

### Options to Get New Refresh Token

#### Option 1: Use the OAuth Script (Recommended)
```bash
# Ensure environment variables are set
source .env.local

# Run the refresh token script
node scripts/get-refresh-token.js
```

Follow the prompts:
1. Visit the OAuth URL
2. Authorize with your Google account
3. Copy the authorization code
4. Paste it back in the terminal
5. Copy the new refresh token from the output

#### Option 2: Use Google OAuth Playground
1. Go to: https://developers.google.com/oauthplayground/
2. Click ⚙️ and enable "Use your own OAuth credentials"
3. Enter:
   - Client ID: `603278479855-7456hob4l6a6pfv8u9cu8218s6tusjog.apps.googleusercontent.com`
   - Client Secret: `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`
4. Add scopes:
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   ```
5. Authorize APIs, exchange code, copy refresh token

#### Option 3: Use App's OAuth Flow
Visit: `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code&client_id=603278479855-7456hob4l6a6pfv8u9cu8218s6tusjog.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.adrianairia.pt%2Fauth%2Fcallback`

### After Getting New Token
1. Update `.env.local` with new refresh token
2. Update Vercel environment variables
3. Test the booking system
4. Verify Google Calendar integration works
