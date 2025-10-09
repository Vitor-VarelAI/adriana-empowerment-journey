# Adriana Empowerment Journey

Modern booking experience with fixed time slots (Mon-Fri, 10:00-17:00), built on Next.js, Tailwind CSS, shadcn/ui, and Formspree. Bookings are kept in-memory for runtime availability checks and confirmed via Formspree email notifications.

## Prerequisites

- Node.js ≥ 18 (project runs on Next 14). Check with `node -v`.
- npm (comes with the repo's `package-lock.json`).
- Optional: Vercel CLI for deployments.


## Getting started locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local` in project root** (start from `.env.example`)
   ```bash
   NEXT_PUBLIC_FORMSPREE_ID=
   ```
   - `NEXT_PUBLIC_FORMSPREE_ID` é o Form ID configurado no painel do Formspree (obrigatório para envios reais).

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build & start for production**
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

## Data storage

- Os horários reservados vivem numa store em memória (`app/api/_lib/memory-db.ts`).
- Cada execução do servidor parte de um estado vazio; agendamentos persistem apenas enquanto o processo estiver ativo.
- A confirmação oficial é enviada via Formspree, que mantém o histórico por email.

## Deployment (Vercel)

1. Ensure the repo is connected to a Vercel project.
2. Add env vars in Vercel → Project Settings → Environment Variables:
   - Pelo menos `NEXT_PUBLIC_FORMSPREE_ID` em cada ambiente (Preview/Production).
3. Push your branch ou funda no branch de deploy (ex.: `main`).
4. Vercel builds the Next.js app; API routes run serverless on Vercel.

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
  lib/config.ts    # Shared env helpers (Formspree ID)
```

## Common commands

| Command             | Description                             |
|--------------------|-----------------------------------------|
| `npm run dev`      | Next.js dev server (App Router + API)    |
| `npm run build`    | Production build for Next.js              |
| `npm run start`    | Run the production build locally          |
| `npm run db:push`  | Placeholder – Supabase removido |

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
| `/api/bookings` | `POST` | Valida e confirma agendamento (só retorna sucesso se Formspree responder 200). |
| `/api/booking-request` | `POST` | Envia pedido de agendamento por email (Formspree). |
| `/api/mentorship` | `POST` | Candidatura completa à mentoria com validação robusta. |
| `/api/mentorship-interest` | `POST` | Questionário de qualificação com validação de telefone. |

Payload exemplo (POST - Booking):

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

Payload exemplo (POST - Mentorship):

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+351912345678",
  "currentProfession": "Developer",
  "currentChallenge": "Looking for career guidance and work-life balance",
  "mentorshipGoal": "Develop leadership skills and clarity in professional path",
  "timeCommitment": "4-6h/semana",
  "supportLevel": "suporte regular",
  "availability": "Tuesdays and Thurs evenings after 19h",
  "expectations": "Gain practical tools for stress management and decision making",
  "consent": true,
  "newsletter": false
}
```

## Troubleshooting

- **Slots repetidos**: a store em memória rejeita horários já reservados enquanto o servidor estiver ativo.
- **Form validation errors**: check console logs para erros de validação; mentorship forms têm validação frontend/backend completa.
- **Email notifications**: verifique `NEXT_PUBLIC_FORMSPREE_ID` se notificações não chegarem.
- **Telefone validation**: mentorship forms exigem mínimo 9 dígitos; validação ocorre em tempo real.

## Security notes

- Never commit `.env.local` (already gitignored).
- Os dados sensíveis vivem apenas no email enviado via Formspree; nenhuma base externa é utilizada.
- All API routes validate input and sanitize user data.

---

Questions or improvements? Open an issue or reach out to the project maintainers.
