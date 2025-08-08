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

- [ ] Serviço 1: **70 €**
- [ ] Serviço 2: **280 €**
- [ ] Serviço 3: **700 €**
- [ ] Apenas estes pacotes estão visíveis/selecionáveis: Sessão Única, Pacote de 4 Sessões (Recomendado), Pacote de 10 Sessões
- [ ] Pacote de 4 Sessões aparece destacado como "Recomendado" (estilo e posição inalterados)
- [ ] Formulário de agendamento mostra 70€, 280€, 700€ e "Pacote de 10 Sessões" com duração "10 sessões"
- [ ] Nota de rodapé visível e discreta: “Opção adicional: 12 Sessões por 840 € (pagamento em 3x, IVA incluído)”
- [ ] A nota de 12 sessões NÃO aparece nos cards principais nem no formulário de marcação
- [ ] Sem referências antigas: 40€ / 160€ / 320€ / “Pacote de 8 Sessões” / “8x60min”
- [ ] Formatação de moeda consistente (“70€” ou “70 €” conforme contexto), sem símbolos mistos

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
- Preços atualizados: 70 € / 280 € / 700 €
- Nota no rodapé: “12 Sessões por 840 € (pagamento em 3x, IVA incluído)” — apenas informativa (não selecionável nos cards/formulário)