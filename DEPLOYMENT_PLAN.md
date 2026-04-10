# Plano de Deploy – Booking sem Base de Dados

## Visão Geral
Esta versão elimina a dependência de Supabase. Os horários são mantidos em memória durante a execução do servidor e cada nova reserva só é confirmada quando o Formspree responde `200`. O objetivo é reduzir custos e simplificar o fluxo, mantendo o mesmo formulário e experiência de agendamento.

## ✅ Estado Atual
- **Branch**: `main`
- **API**: `/api/bookings` (GET/POST) sem Supabase; utiliza store em memória.
- **Notificações**: Formspree recebe todos os pedidos (ID configurado via `NEXT_PUBLIC_FORMSPREE_ID`).
- **CMS**: Conteúdos dinâmicos via Google Sheets (Service Account).
- **Rotas auxiliares**: `/api/reminders/run` e `/api/admin/analytics/overview` devolvem `501` até existir nova base de dados.

## 🔧 Passos para Deploy

1. **Variáveis de Ambiente**
   ```bash
   NEXT_PUBLIC_API_BASE_URL=/api
   NEXT_PUBLIC_FORMSPREE_ID=<id Formspree>
   REMINDER_RUN_SECRET=<opcional, mantém rota protegida>
   ADMIN_ANALYTICS_SECRET=<opcional>
   GOOGLE_SHEETS_ID=<ID da folha>
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<email do service account>
   GOOGLE_PRIVATE_KEY=<private key>
   ```
   - Remover chaves antigas (`SUPABASE_*`, `POSTGRES_URL`, etc.).

2. **Preparar Formspree**
   - Confirmar que o formulário `f/<id>` está ativo e que o destinatário está verificado.
   - Adicionar `_replyto` como campo reconhecido ou ajustar template conforme necessidade.

3. **Deploy**
   ```bash
   npm install
   npm run build
   npx vercel deploy --prebuilt
   ```

4. **Smoke Tests (Preview ou Produção)**
   - `GET /api/bookings?date=2025-10-01` → deve devolver `success: true`, `availableTimes` com slots.
   - Submeter formulário com data futura → resposta 200 + email do Formspree.
   - Repetir mesma slot → resposta 409 enquanto o processo estiver ativo.

5. **Monitorização pós-deploy**
   - Acompanhar logs da Vercel para verificar status 4xx/5xx em `/api/bookings`.
   - Verificar caixa de entrada do destinatário do Formspree.

## 🧱 Arquitetura Atualizada
```
Next.js (App Router)
├── app/api/bookings/route.ts   # Validação + memória + chamada Formspree
├── app/api/customer-profile    # Lê snapshot em memória (ou devolve null)
└── Frontend BookingTable       # Consome a API e aplica UX multi-step

Formspree
└── Recebe payload JSON e envia email à Adriana
```

## 🔐 Segurança e Robustez
- Validação servidor via `zod`; apenas campos permitidos são aceites.
- A store em memória impede duplicação enquanto a instância estiver ativa.
- O email oficial serve como trilho auditável (`reply-to` configurado para responder ao cliente).
- Rotas cron/analytics devolvem `501` para deixar claro que a infraestrutura está desligada.

## 📋 Checklist antes do Merge
- [ ] `NEXT_PUBLIC_FORMSPREE_ID` configurado nos ambientes Preview/Prod.
- [ ] Credenciais Google Sheets configuradas.
- [ ] `npm run build` local sem erros.
- [ ] Teste manual do fluxo de booking + email recebido.
- [ ] Documentação atualizada nas páginas públicas / mensagens do site.

## 🔭 Próximos Passos (Opcional)
1. Introduzir armazenamento persistente (Planetscale, Supabase, Postgres gerido) caso seja necessário histórico.
2. Reativar lembretes automáticos quando existir fonte de dados persistente.
3. Adicionar exportação CSV/Sheet das reservas via CLI ou endpoint protegido.
4. Implementar autenticação básica para consultas internas caso um painel seja reintroduzido.

Com estes passos, o sistema mantém o fluxo de agendamento funcional apenas com Formspree e memória local, reduzindo dependências externas.
