# Adriana Empowerment Journey

Modern booking experience with fixed time slots (Mon-Fri, 10:00-17:00), built on Next.js, Tailwind CSS, shadcn/ui, and Supabase.

## Prerequisites

- Node.js ≥ 18 (project runs on Next 14). Check with `node -v`.
- npm (comes with the repo's `package-lock.json`).
- Optional: Vercel CLI for deployments.
- Required: Projeto Supabase (usar chave service role para o backend).

## Getting started locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local` in project root** (start from `.env.example`)
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_FORMSPREE_ID=
   ```
   - `SUPABASE_*` values vêm do dashboard do Supabase.
   - `NEXT_PUBLIC_FORMSPREE_ID` (optional) enables Formspree notifications after a booking is created.

3. **Aplicar migrações SQL no Supabase**
   - Use o SQL editor do Supabase ou a CLI para executar os arquivos em `supabase/migrations`.
   - Os arquivos criam a tabela `bookings` usada pelo backend.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build & start for production**
   ```bash
   npm run build
   npm run start
   ```

## Fixed Schedule Configuration

The system uses fixed time slots:
- **Dias úteis**: Segunda a Sexta
- **Horário**: 10:00 - 17:00
- **Duração**: 60 minutos por sessão
- **Slots disponíveis**: 10:00, 11:00, 12:00, 14:00, 15:00, 16:00, 17:00

## Database schema

- `bookings`: armazena todos os agendamentos com constraint única (date + time) para evitar duplicados.

As migrações SQL versionadas vivem em `supabase/migrations`. Execute-as manualmente (SQL editor ou CLI) sempre que o schema mudar.

## Deployment (Vercel)

1. Ensure the repo is connected to a Vercel project.
2. Add env vars in Vercel → Project Settings → Environment Variables:
   - Same keys as `.env.local` for each environment (Preview/Production).
3. Provisionar Supabase (plano gratuito). Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e adicionar em `Environment Variables`.
4. Push your branch or merge into the deploy target (e.g., `main`).
5. Vercel builds the Next.js app; API routes run serverless on Vercel.

## Testing the booking flow

1. Start the dev server (`npm run dev`).
2. Visit `http://localhost:3000`.
3. Use the booking form to create a reservation. Confirm:
   - Booking is saved in the `bookings` table.
   - Email notification is sent via Formspree (if configured).
   - Time slot becomes unavailable for new bookings.

## Project structure overview

```
app/               # Next.js App Router (pages + API routes)
  api/             # Route handlers for booking management
  providers.tsx    # Global providers (React Query, Booking context, navigation)
  page.tsx         # Landing page (reuses shared components)
src/               # Shared React components/contexts used by the Next app
  components/
  pages/
  contexts/
  db/              # Tipos/cliente Supabase
  lib/config.ts    # Shared env helpers (Formspree ID)
```

## Common commands

| Command             | Description                             |
|--------------------|-----------------------------------------|
| `npm run dev`      | Next.js dev server (App Router + API)    |
| `npm run build`    | Production build for Next.js              |
| `npm run start`    | Run the production build locally          |
| `npm run db:push`  | Lembra que migrações estão em `supabase/migrations` |

## Troubleshooting

- **Database connection errors**: confirme se `SUPABASE_URL` e as chaves estão certas e se a role usada possui acesso.
- **Double booking submissions**: constraint única na tabela previne reservas duplicadas.
- **Form validation errors**: check console logs para erros de validação.
- **Email notifications**: verifique `NEXT_PUBLIC_FORMSPREE_ID` se notificações não chegarem.

## Security notes

- Never commit `.env.local` (already gitignored).
- Supabase RLS policies ensure only authorized access to bookings data.
- All API routes validate input and sanitize user data.

---

Questions or improvements? Open an issue or reach out to the project maintainers.
