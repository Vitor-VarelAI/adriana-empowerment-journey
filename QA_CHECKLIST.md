# ✅ QA Checklist – Site Adriana (`main` para produção)

Objetivo: garantir que a versão online está funcional, segura e pronta para uso público.

---

## 🔧 Funcionalidade geral

- [ ] Página principal (`/`) abre sem erros
- [ ] Navegação fluida entre páginas (SPA routing funcional)
- [ ] Renders sem layout shift (conteúdo estável ao carregar)

---

## 📅 Calendário de marcações

- [ ] Navegação entre semanas está funcional (sem posicionamento absoluto)
- [ ] Semana começa na segunda-feira
- [ ] Horários disponíveis são lógicos e clicáveis
- [ ] Estado da seleção avança corretamente:  
  Serviço → Data → Hora → Detalhes

---

## 💸 Preços

- [ ] Serviço 1: **40 €**
- [ ] Serviço 2: **160 €**
- [ ] Serviço 3: **320 €**

---

## 📨 Submissão

- [ ] Formulário envia corretamente via **Formspree**
- [ ] Redireciona para página de confirmação: `/obrigado`
- [ ] Feedback claro em caso de erro ou sucesso

---

## 🔗 Rotas e SPA

- [ ] Acesso direto às seguintes rotas funciona:
  - `/`
  - `/obrigado`
  - qualquer rota inválida → redireciona ou apresenta fallback
- [ ] Vercel SPA fallback ativo (ver `vercel.json`)

---

## 🔐 Segurança e deploy

- [ ] Token sensível removido do histórico (`.cursorrules`)
- [ ] Nenhum erro ou aviso no build da Vercel
- [ ] Último deploy está ligado à branch `main`

---

## 🔁 Instruções para colaboradores (Git)

Se já tinham `main` antes do rewrite, devem correr:

```bash
git fetch origin
git reset --hard origin/main
```

---

## ℹ️ Notas técnicas (referência)

- SPA fallback em produção: ver `vercel.json` com rewrites para servir `index.html`
- Calendário:
  - Navegação sem CSS absoluto nos botões
  - Semana inicia na segunda-feira
  - Lógica de horários com bloqueio de datas passadas e slots por dia
- Fluxo de marcação:
  - Seleção de serviço → calendário e horários → detalhes → envio via Formspree → `/obrigado`
- Preços atualizados: 40€ / 160€ / 320€