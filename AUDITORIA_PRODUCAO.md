# Auditoria final para ir a produção — adrianairia.pt + Landing do Evento

## Objetivo
Verificar se **site principal** e **lead page do evento** estão prontos para produção. Identificar tudo o que falta, priorizar e devolver um plano de correção claro.

## Entregáveis
1) **Relatório de Auditoria** (Google Doc/Notion): tabela com (Página/Componente; Problema; Severidade [bloqueador/alto/médio/baixo]; Evidência [screenshot + link]; Recomendação objetiva; Dono; Prazo).
2) **Checklist preenchido** (abaixo) com ✅/❌/N/A por item.
3) **Anexos**: 10–20 screenshots dos pontos críticos; export dos testes (Lighthouse, axe, etc.).
4) **Go/No-Go** final, com pré-requisitos para deploy.

---

## Escopo
- Site principal: **todas as páginas públicas** + secções finais (CTA do Evento → FAQs → Booking → Footer).
- Lead page do evento: **herói, formulário, prova social, contador híbrido, CTAs, questionário/WhatsApp**.
- Integrações: booking, analytics, pixel, formulários, WhatsApp.

---

## Prioridade de verificação (ordem)
1) **Fluxo de conversão** (CTAs, formulários, booking, redirecionamentos).
2) **Mobile-first** (iOS Safari, Chrome Android).
3) **Performance**; 4) **Acessibilidade**; 5) **SEO básico**; 6) **Conteúdo/UX**; 7) **Legal & Segurança**.

---

## Checklist (marcar ✅/❌/N/A e comentar se ❌)
### A. Fluxo & Conteúdo
- CTAs consistentes: “Reservar Vaga Agora” (evento) leva sempre à **landing**; “Agendar Sessão Regular” leva ao **booking**; sem variações de copy;
- Ordem no fim da **página principal**: CTA Evento → FAQs → Booking Regular → Footer;
- Removido qualquer “pé” redundante antes do booking; títulos sem duplicação (“Agende a Sua Sessão Regular” extra oculto);
- Lead page: formulário visível above the fold; CTA único repetido; questionário + regra do WhatsApp (só mostra se marcar “quero avançar já”);
- Contador híbrido: data global até 31/10/2025 23:59; texto de urgência “pode encerrar antes se lotar”; não fica a “00 00 00”; fallback pós-prazo;
- Prova social com fotos/nomes; sem lorem ipsum; sem links quebrados;
- Ortografia/PT-PT consistente; números e moeda corretos.

### B. Mobile & Navegadores
- Mobile: spacing; headings 2 linhas máx; botões 100% largura; áreas clicáveis ≥44px;
- Testes em: iPhone Safari; Android Chrome; Desktop Chrome/Edge/Firefox/Safari;
- Header sticky não cobre conteúdo; menus não sobrepõem; sem zoom forçado.

### C. Formulários & Booking
- Formulário lead: validação, mensagens de sucesso/erro claras; antispam; envio para CRM/Sheets; e-mail de confirmação (se aplicável);
- Booking: passos Serviço → Data & Hora → Dados; preço/slots corretos; timezone; e-mails/SMS;
- Links UTM nos botões principais (utm_source=siteprincipal / utm_campaign=evento_outubro).

### D. Performance (páginas-chave)
- Lighthouse (Mobile): **Perf ≥ 75; A11y ≥ 90; Best Practices ≥ 90; SEO ≥ 90**;
- Imagens otimizadas (WebP/AVIF onde possível; lazy-loading; dimensões fixas);
- CSS/JS minificados; sem bundles gigantes não utilizados;
- CDN ativo; Gzip/Brotli; cache headers (estáticos ≥ 7 dias).

### E. Acessibilidade
- Teste **axe**/WAVE: sem erros críticos (contraste; labels; alt text; ordem do foco; skip-link);
- Teclado: navegação completa; foco visível;
- ARIA apenas quando necessário.

### F. SEO & Social
- Títulos & meta descriptions únicas;
- Canonical correto; robots.txt e sitemap.xml acessíveis;
- Open Graph/Twitter Cards: imagem, título, descrição;
- Schema.org (Organization; WebSite; Breadcrumb; Event na landing se aplicável).

### G. Analytics & Pixeis
- GA4 a disparar em todas as páginas; eventos: view_page, form_submit, booking_start, booking_complete, cta_evento_click;
- Meta Pixel/others conforme; consent banner respeitado.

### H. Legal & Segurança
- Política de privacidade/termos no footer; consentimento cookies;
- HTTPS/SSL; HSTS; sem mixed content;
- CSP básica se possível; páginas de erro 404/500 estilizadas;
- Backups/rollback definidos; monitor uptime.

---

## Testes que deves correr (anexa resultados)
- **Lighthouse** (Chrome DevTools) — mobile e desktop;
- **axe DevTools** (a11y); **WAVE**;
- **Rich Results Test** (Schema/OG); **Open Graph Debugger**;
- **PageSpeed Insights** para a landing e homepage;
- **Broken link checker**;
- **Console**: zero erros JS em páginas-chave.

---

## Critérios de Go/No-Go
- Sem **bloqueadores** (erros 4xx/5xx, formulários/booking a falhar, links errados, contador quebrado);
- **Perf mobile ≥ 75** nas páginas-chave; **A11y sem erros críticos**;
- CTAs e redirecionamentos corretos; copy final sem erros;
- Analytics/pixels a recolher eventos essenciais.

---

## Formato do Relatório (modelo)
| Página/Componente | Problema | Severidade | Evidência (link/screenshot) | Recomendação | Dono | Prazo |
|---|---|---|---|---|---|---|

> No topo do relatório: **Resumo Executivo** com 5–10 linhas, lista de bloqueadores e data sugerida de go-live.
