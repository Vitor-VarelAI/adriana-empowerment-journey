# Plano de Migração: Vercel Postgres → Supabase + Edge Config

## Visão Geral
Migrar o sistema de booking do Vercel Postgres para Supabase (gratuito) + Vercel Edge Config para melhor performance e custo, substituindo o driver antigo pelo cliente oficial do Supabase.

## ✅ Estado Atual

Migração base concluída para substituir o driver Vercel Postgres por Supabase + Edge Config. Tabelas essenciais (`auth_tokens`, `bookings`) estão versionadas e alinhadas com o código. Funcionalidades extras (perfis de coach, pagamentos, transações) permanecem como planos futuros.

### 1. Criar Projeto Supabase e Habilitar Extensão ✅
- [x] Criar conta no Supabase (plano gratuito)
- [x] Criar novo projeto
- [x] No SQL Editor, executar: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
- [x] Obter connection string do projeto

### 2. Configurar Variáveis de Ambiente ✅
- [x] Copiar connection string do Supabase
- [x] No Vercel dashboard, adicionar variáveis:
  - `SUPABASE_URL` (URL do projeto Supabase)
  - `SUPABASE_ANON_KEY` (chave anônima do Supabase)
  - `SUPABASE_SERVICE_ROLE_KEY` (chave de serviço do Supabase)
- [x] Atualizar `.env.local` para desenvolvimento local

### 3. Atualizar Driver do Banco de Dados ✅
- [x] Alterar `src/db/client.ts` para usar `@supabase/supabase-js`
- [x] Configurar conexão com Supabase usando service role key
- [x] Remover definitivamente dependências do Drizzle

### 4. Criar Schema no Supabase ✅
- [x] Versionar tabelas usadas pelo app (`auth_tokens`, `bookings`)
- [x] Habilitar RLS com políticas para uso via service role
- [ ] Planejar/implementar tabelas opcionais (`coach_profiles`, `payments`, etc.)
- [ ] Adicionar migrações para dados seed (opcional)

### 5. Implementar Edge Config ✅
- [x] Criar Edge Config no dashboard Vercel
- [x] Instalar `@vercel/edge-config`
- [x] Implementar wrapper com singleton pattern e fallback
- [x] Integrar Edge Config com sistema de agendamento
- [x] Adicionar mecanismo de cache e error handling

### 6. Atualizar API Routes ✅
- [x] Modificar `/api/availability` para usar Edge Config
- [x] Implementar fallback para configurações locais
- [x] Atualizar `/api/events/create` para persistir usando Supabase
- [x] Manter compatibilidade com Google Calendar OAuth

### 7. Corrigir Problemas de Build ✅
- [x] Resolver conflitos de dependências ESLint
- [x] Downgrade ESLint para versão compatível (8.57.0)
- [x] Remover pacotes Drizzle desnecessários
- [x] Atualizar scripts do package.json

### 8. Testar e Validar ⚠️
- [ ] Executar `npm run dev` e testar `/api/availability`
- [ ] Executar `/api/events/create` e confirmar registro no Supabase
- [ ] Verificar logs de erro do Supabase (painel) após os testes

## 🎯 Arquitetura Final

### Database Layer
```
Supabase PostgreSQL
├── users (diretório básico, opcional)
├── auth_tokens (tokens OAuth persistidos pelo backend)
└── bookings (registros de agendamento)
```

### Configuration Layer
```
Vercel Edge Config
├── app-config (configurações principais)
├── timezone (Europe/London)
├── working hours (09:00-17:00)
├── booking settings (slot duration, etc.)
└── feature flags (notificações, integrações)
```

### API Layer
```
Next.js API Routes
├── /api/availability (com Edge Config)
├── /api/events/create (com Supabase)
├── /api/auth/login (OAuth Google)
└── /api/auth/callback (OAuth callback)
```

## 🔧 Configurações de Ambiente

### Variáveis Obrigatórias
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Edge Config
EDGE_CONFIG=https://edge-config.vercel.com/ecv_your-config-id

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_ID=your-calendar-id
ADMIN_EMAIL=your@email.com

# Outros
ENCRYPTION_KEY=min-32-chars-encryption-key
NEXT_PUBLIC_FORMSPREE_ID=your-formspree-id
```

## 📊 Benefícios da Migração

### Performance
- ✅ Edge Config fornece configurações de forma global com baixa latência
- ✅ Cache automático de configurações
- ✅ Fallback robusto para falhas

### Custo
- ✅ Supabase gratuito (até 500MB, 1M conexões/mês)
- ✅ Edge Config gratuito (até 100KB, 1M requisições/mês)
- ✅ Redução de custos em relação ao Vercel Postgres/Neon

### Manutenibilidade
- ✅ Schema essencial versionado no repositório
- ✅ Tipagem TypeScript alinhada com o schema real
- ✅ Documentação atualizada para o estado atual
- ⚠️ Dependências Drizzle ainda presentes (não utilizadas)

## 🚀 Próximos Passos (Opcionais)

1. **Monitoramento**: Adicionar logging e monitoramento de erros
2. **Backups**: Configurar backups automáticos do Supabase
3. **Performance**: Otimizar queries e adicionar índices
4. **Segurança**: Implementar rate limiting e validações adicionais
5. **Analytics**: Adicionar analytics de uso do sistema

## 🎉 Resumo

O backend já lê configurações do Edge Config e grava em Supabase (`auth_tokens`, `bookings`).
Próximos aprimoramentos: remover dependências antigas, adicionar testes automatizados
e decidir se funcionalidades como pagamentos e perfis de coach serão realmente implementadas.
