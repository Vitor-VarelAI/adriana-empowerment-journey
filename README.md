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
3. Usa o formulário de booking para enviar um pedido. Confirma:
   - Recebes o email enviado via Formspree (ID configurado em `NEXT_PUBLIC_FORMSPREE_ID`).
   - A mensagem de sucesso aparece no site informando que a confirmação virá por email.

## Project structure overview

```
app/               # Next.js App Router (pages + API routes)
  api/             # Route handlers for booking management
  providers.tsx    # Global providers (React Query, Booking context, navigation)
  page.tsx         # Landing page (reuses shared components)
  mentoria-outubro-2025/  # Página dedicada ao evento Mentoria Outubro 2025
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

### Marketing & Conteúdo

- `src/components/mentoria/*`: componentes da landing Mentoria Outubro (hero, benefícios, urgência, etc.).
- `src/components/CTA.tsx`: bloco de campanha na homepage que liga ao evento.
- `src/components/RegularBooking.tsx`: secção isolada para o widget de agendamento regular.
- Detalhes completos em `docs/mentoria-outubro-landing.md`.
- Plano de migração do booking sem Supabase em `docs/booking-alternative-plan.md`.

## API quick reference

| Endpoint | Method | Descrição |
|----------|--------|-----------|
| `/api/bookings?date=YYYY-MM-DD` | `GET` | Lista horários ocupados e disponíveis para a data. |
| `/api/bookings` | `POST` | (Legacy) cria marcação com Supabase, usado apenas pelo fluxo antigo. |
| `/api/booking-request` | `POST` | Envia pedido de agendamento por email (Formspree). |

Payload exemplo (POST):

```json
{
  "name": "Cliente Teste",
  "email": "cliente@example.com",
  "phone": "912345678",
  "sessionType": "Online",
  "serviceId": 1,
  "serviceName": "Sessão Única",
  "date": "2025-10-01",
  "time": "10:00",
  "message": "Quero falar sobre carreira"
}
```

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
