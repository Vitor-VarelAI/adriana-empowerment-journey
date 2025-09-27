# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview
- Professional coaching website with fixed time slots (Mon-Fri, 10:00-17:00).
- Next.js (App Router) hosts the marketing UI and API routes.
- Shared React components live under `src/` and are consumed by the Next app.
- Booking system uses Supabase for data persistence without external calendar dependencies.

## Essential Commands
### Development
- `npm install` – Install dependencies (lockfile is `package-lock.json`).
- `npm run dev` – Start the Next.js dev server (pages + API routes).
- `npm run build` – Production build for the Next.js app.
- `npm run start` – Run the production build locally.
- `npm run lint` – ESLint.
- `npm run test` – Placeholder (currently no automated tests).

### Backend (Supabase Only)
- Route handlers located in `app/api/**`.
- Usa Supabase (`src/db/client.ts`) para persistir agendamentos na tabela `bookings`.
- Migrações versionadas em `supabase/migrations/`.
- Variáveis: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_FORMSPREE_ID` (opcional).

## Architecture
- React 19 + TypeScript components in `src/` reused throughout the Next app.
- Styling via Tailwind + shadcn/ui (Radix primitives).
- State via React Context + TanStack Query.

### Backend Integration
- `app/api/bookings` – GET /api/bookings?date=YYYY-MM-DD → slots ocupados na data
- `app/api/bookings` – POST → valida e grava novo agendamento
- Validação de unicidade via constraint unique (date + time)
- RLS habilitado na tabela bookings para acesso público controlado

## Development Notes
- Favor strict TypeScript; avoid `any`.
- Keep `useEffect` dependencies complete and memoize callbacks.
- UI maintains 3-step booking wizard (date selection → time selection → form).
- Horários fixos: segunda a sexta, 10:00-17:00 (slots de 60 minutos).
- LocalStorage cache leve para slots reservados (sem dados sensíveis).

## Testing Snippets
```bash
# Get booked slots for a date
curl "http://localhost:3000/api/bookings?date=2025-09-10"

# Create new booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Client", "email": "test@example.com", "phone": "+351912345678", "date": "2025-09-10", "time": "10:00", "notes": "Test session"}'
```

## Common Issues
- **Database**: Garanta que `SUPABASE_URL`/keys estejam corretos e que as migrações foram aplicadas.
- **Formspree**: Configure `NEXT_PUBLIC_FORMSPREE_ID` para notificações por email.
- **Builds**: Run `npm run build` antes de fazer deploy para validar pipeline.
- **Duplicated bookings**: Constraint única na tabela previne reservas no mesmo horário.

## 🔄 RESTRUCTURING PLAN (Fixed Slots Mon-Fri, 10h-17h)

### Architecture Decision
- Eliminar integrações Google (OAuth, Calendar) para simplificar e remover dependências frágeis.
- Backend próprio com Supabase para assegurar unicidade de slots e histórico.
- Interface de booking mantida (Wizard 3 passos), apenas ajustando origem dos horários.

### What to Remove
- Remover chamadas a `/api/availability` e `/api/events/create` no front-end.
- Deprecar ficheiros Google: `app/api/_lib/google.ts`, rotas `app/api/auth/*`, `app/auth/google/*`.
- Limpar variáveis de ambiente Google da Vercel e `.env.local`.
- Remover dependências específicas (ex.: googleapis) do `package.json`.

### What to Add/Replace
- Criar rota `/api/bookings`:
  - GET `?date=YYYY-MM-DD` → slots ocupados na data
  - POST → valida payload, verifica disponibilidade, grava na tabela
- Ajustar `BookingTable.tsx`:
  - Gerar horários localmente (segunda a sexta, 10:00–17:00)
  - Chamar `/api/bookings` para bloquear slots já usados
  - No submit, enviar para `/api/bookings`
- Mensagens de erro: "Horário já reservado", "Falha na gravação"

### UI/UX Validation
- Manter wizard actual com indicação clara de dias úteis.
- Mostrar estados "slot ocupado" / "slot disponível".
- Mensagens pós-submit apenas referem registo interno.

### Security & Robustness
- Supabase: constraint única (date+time) para impedir duplicados.
- Validação backend: sanitizar campos, proteger contra submissions automáticas.
- Logging: manter logs mínimos, guardar metadata (IP, timestamp) sem expor via API.
