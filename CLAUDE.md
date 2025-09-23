# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview
- Professional coaching website with real-time Google Calendar integration.
- Next.js (App Router) hosts the marketing UI and API routes.
- Shared React components live under `src/` and are consumed by the Next app.
- Google Calendar OAuth, availability, and booking creation now live in Next.js route handlers with Drizzle ORM + Postgres storage.

## Essential Commands
### Development
- `npm install` – Install dependencies (lockfile is `package-lock.json`).
- `npm run dev` – Start the Next.js dev server (pages + API routes).
- `npm run build` – Production build for the Next.js app.
- `npm run start` – Run the production build locally.
- `npm run lint` – ESLint.
- `npm run test` – Placeholder (currently no automated tests).

### Backend (Google Calendar API)
- Route handlers located in `app/api/**`.
- Uses Drizzle ORM (`src/db/*`) against Postgres for OAuth tokens and booking records.
- Environment: configure `GOOGLE_*`, `POSTGRES_URL`, `NEXT_PUBLIC_API_BASE_URL`, and optionally `NEXT_PUBLIC_FORMSPREE_ID`.

## Architecture
- React 19 + TypeScript components in `src/` reused throughout the Next app.
- Styling via Tailwind + shadcn/ui (Radix primitives).
- State via React Context + TanStack Query.

### Backend Integration
- `app/api/availability` – free/busy checks against Google Calendar.
- `app/api/events/create` – event creation + database persistence.
- `app/api/auth/login|callback` – OAuth login flow, token storage handled server-side.
- Tokens + bookings stored in Postgres with Drizzle.

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
- **Database**: Ensure `POSTGRES_URL` points to a reachable Neon/Vercel Postgres instance (set `sslmode=require`).
- **Formspree**: Configure `NEXT_PUBLIC_FORMSPREE_ID` if email notifications are desired.
- **Builds**: Run `npm run build` before shipping to confirm the pipeline.

Agora vamos testar se o MCP do Supabase está funcionando. Por favor,
  reinicie sua sessão do Claude Code e depois execute o comando /mcp para
   verificar se o servidor "supabase" aparece na lista.

  Após reiniciar, você pode testar com comandos como:
  - Listar tabelas: SELECT * FROM information_schema.tables WHERE 
  table_schema = 'public'
  - Verificar estrutura de tabelas específicas

  Quando o MCP estiver funcionando, podemos continuar com a migração do
  banco de dados!