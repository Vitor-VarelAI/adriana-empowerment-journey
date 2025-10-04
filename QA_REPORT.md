# QA Report – Fluxo de Booking sem Supabase

## Cenários Testados
1. Consulta de disponibilidade para data futura (`GET /api/bookings?date=2025-10-01`).
2. Submissão bem-sucedida com dados válidos.
3. Tentativa de reservar a mesma slot imediatamente após confirmação.
4. Submissão com payload inválido (email mal formatado).
5. Falha simulada do Formspree (ID ausente).

## Resultados
- ✅ API valida parâmetros e devolve `success: true` quando tudo ocorre como esperado.
- ✅ Email chega via Formspree (verificado em caixa de entrada).
- ✅ Segunda tentativa na mesma slot devolve `409 Selected time is already booked`.
- ✅ Payload inválido devolve `400` com detalhes do `zod`.
- ✅ ID ausente devolve `502` com mensagem “Formspree ID não configurado”.

## Regressões Observadas
- Nenhuma relativa a Supabase (código removido).
- Funções de lembrete/analytics permanecem inativas (`501`).

## Recomendações
- Configurar filtro/etiqueta no email para organizar as novas reservas.
- Avaliar armazenamento persistente se surgirem requisitos de histórico.
