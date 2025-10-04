# Lista de Verificação – Deploy sem Supabase

- ✅ Formulário principal usa `/api/bookings` com store em memória.
- ✅ Emails são enviados via Formspree (ID configurado em ambiente local).
- ✅ Código legado de Supabase removido (`src/db`, helpers, migrações).
- ✅ Rotas cron/analytics devolvem `501` indicando feature pausada.
- ✅ Documentação atualizada para refletir ausência de base de dados.

## Variáveis Necessárias (Preview + Production)
```
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_FORMSPREE_ID=<id do Formspree>
REMINDER_RUN_SECRET=<opcional>
ADMIN_ANALYTICS_SECRET=<opcional>
```

## Testes obrigatórios antes do deploy
1. `npm run build` — garantir que o bundle compila.
2. `npm run start` + submissão manual (verificar toast de sucesso).
3. Confirmar email recebido pelo endereço configurado no Formspree.
4. Repetir a mesma slot → API deve devolver 409 enquanto a instância estiver ativa.

## Observações
- Sem persistência externa; reinícios do servidor limpam a agenda.
- `/api/booking-request` continua disponível para campanhas manuais.
- Guardar emails recebidos numa pasta dedicada (ex.: “Reservas - Ações Pendentes”).
