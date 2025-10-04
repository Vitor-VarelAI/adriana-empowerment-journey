# Booking sem Supabase – Plano de Migração

## Objetivo
Manter o agendamento funcional sem depender de base de dados paga, enviando todos os pedidos por email (Formspree) para confirmação manual da Adriana.

## Estrutura proposta
1. **Recolha de dados** (nome, email, plano escolhido, tipo de sessão, data preferida, horário preferido, mensagem opcional).
2. **Envio de email** através de um novo endpoint `/api/booking-request` (usa o mesmo `NEXT_PUBLIC_FORMSPREE_ID`).
3. **Confirmação manual** por email – Adriana responde confirmando ou sugerindo outro horário.

## Passo a passo
### 1. UI simplificada
- Reutilizar o layout de `BookingTable`, mas deixar claro que os horários são preferências.
- Novo componente `BookingRequestForm` com validação mínima e seleção de plano.
- Mensagem de sucesso: “Pedido recebido — confirmaremos por email em até 24h úteis”.

### 2. Endpoint `/api/booking-request`
- Payload esperado: `{ name, email, sessionType, plan, date, time, note }`.
- Validações básicas (nome/email obrigatórios).
- Constrói mensagem e faz `POST` ao Formspree.
- Responde `{ success: true }` (ou erro se o email falhar).

### 3. Fluxo operacional
- Email chega à Adriana com todas as respostas.
- Adriana confirma manualmente e, se quiser, bloqueia o horário no calendário pessoal.

## Melhorias futuras (gratuitas)
- Integrar Google Calendar API (conta pessoal) para verificar conflitos antes de enviar o email.
- Gerar ficheiro `.ics` (biblioteca `ics`) e anexar na resposta de confirmação.
- Alternativas ao Formspree se houver limite: Netlify Forms, Tally, Google Forms com Apps Script.

## Checklist de implementação
- [x] Criar `BookingRequestForm` (UI + validação).
- [x] Substituir o envio atual de `BookingTable` pelo novo formulário.
- [x] Implementar `/api/booking-request` com Formspree.
- [x] Atualizar textos para informar que a confirmação é manual.
- [ ] Testar mobile/desktop e confirmar envio real.
- [ ] Documentar horário de resposta e boas práticas de follow-up.
