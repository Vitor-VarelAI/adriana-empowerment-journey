# Plano de Deploy – Booking com Slots Fixos (Supabase)

## Visão Geral
Esta versão elimina as integrações com Google Calendar/OAuth e passa a gerir o agendamento inteiramente com Supabase + Formspree. O backend expõe um único endpoint `/api/bookings` responsável por consultar e reservar horários fixos (segunda a sexta, 10h–17h). O frontend consome este endpoint, impede marcações duplicadas e mantém a experiência em 3 passos.

## ✅ Estado Atual
- **Branch**: `feature/static-booking-slots`
- **API nova**: `/api/bookings` implementada (GET + POST)
- **Frontend**: `BookingTable` consome a nova API e envia notificações pelo Formspree
- **Supabase**: tabela `bookings` com constraint `UNIQUE (start_time)` para evitar duplicados
- **Dependências limpas**: Google SDKs/rotas removidas, adicionado `luxon` para gestão de fusos horários

## 🔧 Passos para Deploy

1. **Variáveis de Ambiente**
   ```bash
   SUPABASE_URL=<url>
   SUPABASE_ANON_KEY=<anon>
   SUPABASE_SERVICE_ROLE_KEY=<service-role>
   NEXT_PUBLIC_API_BASE_URL=/api
   NEXT_PUBLIC_FORMSPREE_ID=<id Formspree>
   ENCRYPTION_KEY=<>=32 chars>
   ```
   - Remover variáveis antigas (`GOOGLE_*`, `EDGE_CONFIG` se não for usado).

2. **Base de Dados (Supabase)**
   - Aplicar migrações em `supabase/migrations` (inclui `bookings_start_time_unique`).
   - Confirmar que a tabela `bookings` está vazia/outliers removidos antes de aplicar o UNIQUE.

3. **Deploy**
   ```bash
   npm install
   npm run build
   npx vercel deploy --prebuilt
   ```
   - Verificar logs do build; garantir que `luxon` é reconhecido no bundle.

4. **Smoke Tests (Preview ou Produção)**
   - `GET /api/bookings?date=2025-10-01` → deve devolver `success: true` e arrays vazios.
   - Submeter formulário no site com data futura → resposta 200 + email do Formspree.
   - Tentar reservar a mesma slot novamente → resposta 409 `Selected time is already booked`.

5. **Monitorização pós-deploy**
   - Consultar logs do Supabase para inserts duplicados ou falhas de política.
   - Monitorizar status 4xx/5xx da rota `/api/bookings` no dashboard da Vercel.

## 🧱 Arquitetura Atualizada
```
Next.js (App Router)
├── app/api/bookings/route.ts  # GET/POST, Supabase service role
├── app/api/customer-profile   # reutilizado para auto-preenchimento
└── Frontend BookingTable      # consome /api/bookings + Formspree

Supabase
├── bookings (UNIQUE start_time)
├── customer_profiles
├── reminder_logs / booking_engagements (seedados via helper)
```

## 🔐 Segurança e Robustez
- Validação servidor via `zod`; apenas campos permitidos são aceites.
- Supabase service role (env var privada) → API route nunca expõe dados sensíveis no GET (apenas horários ocupados).
- Constraint `UNIQUE (start_time)` impede concorrência gerar duplicados.
- Formspree continua opcional; falha no email não bloqueia agendamento.

## 📋 Checklist antes do Merge
- [ ] Variáveis atualizadas no Vercel (sem chaves Google).
- [ ] Migrações Supabase aplicadas com sucesso (sem erros de UNIQUE).
- [ ] `npm run build` local concluído sem warnings relevantes.
- [ ] Teste manual do fluxo de booking + email de confirmação.

## 🔭 Próximos Passos (Opcional)
1. **Painel interno / n8n**: consumir Supabase para gerir confirmações.
2. **Cancelamentos/Remarcações**: criar endpoint protegido para alterar `status`.
3. **Rate limiting**: adicionar proteção a `/api/bookings` (p.ex. middleware com token). 
4. **Relatórios**: gerar exports CSV/Google Sheets a partir dos dados do Supabase.

Com estes passos, o sistema fica independente do Google e focado em slots fixos, mantendo a experiência robusta e segura.
