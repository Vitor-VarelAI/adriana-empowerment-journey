# Mentoria Exclusiva – Landing & Campanha

## Visão Geral
Landing dedicada disponível em `/mentoria-outubro-2025`, otimizada para mobile-first e escrita em PT-PT. O objetivo é captar nome + email para a mentoria de 6 meses e reforçar urgência sem dependência de uma data específica.

## Componentes Principais

| Secção | Componentes | Notas |
|--------|-------------|-------|
| Header fixo | `MentoriaHeader` | Logo + botão "Quero garantir a minha vaga". Sem navegação secundária. |
| Hero | `MentoriaHero`, `SimpleCaptureForm` | Fundo claro, badge "Últimas vagas", CTA roxo, formulário de 2 campos acima da dobra, nova hero image em `/public/mentoria-novembro/WhatsApp Image 2025-10-01 at 15.00.27.jpeg`. |
| Prova de autoridade | `AuthorityProof` | Citação real, métrica `+200`, selo PSC. |
| Benefícios | `SimpleBenefits` | 3 cartões com ícone `CheckCircle2`. |
| Sobre a mentora | `MentorAbout` | Duas fotografias, copy curta, CTA que faz scroll para o formulário. |
| Questionário | `QualificationQuiz` | 3 perguntas de qualificação, envia respostas via Formspree e exibe botão WhatsApp quando a lead está pronta a avançar. |
| Testemunhos | `Testimonials` | 3 cartões com imagem, citação curta e CTA final coerente. |
| Urgência final | `FinalUrgency` | Fundo escuro, contador regressivo (JS), formulário repetido, badge de alerta. |
| Footer | `MentoriaFooter` | Links legais, contactos diretos, mensagem de apoio. |

## Formulário Simplificado
- Campos: `name`, `email`.
- Endpoint: `POST /api/mentorship` com payload pré-preenchido (placeholders para campos adicionais).
- Mensagens de erro e sucesso localizadas.
- Estados: carregamento, erro, sucesso (`Candidatura recebida!`).
- Rota legacy `/mentoria` redireciona automaticamente para esta landing para evitar versões antigas.

## Ajustes na Página Principal (`/`)
1. **Secção CTA Mentoria** (`CTA`):
   - Headline em duas linhas.
   - Subheadline atualizada: "Programa intensivo... preparado para transformar a tua jornada.".
   - CTA roxo full-width em mobile, uppercase removido.
   - Nota de urgência “Últimas vagas disponíveis — confirma a tua presença antes de fechar.”.
2. **FAQs** (`FAQ`): Item adicional comparando evento x sessões normais.
3. **Booking regular** (`RegularBooking`): Nova secção dedicada sem heading duplicado; apenas o widget existente.
4. Ordem final: conteúdos → CTA Evento → FAQ → Booking → Footer.

## Próximo foco
- Migrar booking para o fluxo email-only descrito em `docs/booking-alternative-plan.md`.

## Paleta & Tipografia
- Primário CTA: `#6B1FBF`, hover `#5814A0`.
- Urgência: `#F97316` (badges). 
- Fundos alternados: claro `#F5F5FA` / escuro `#0A0A0A`.
- Tipografia: Inter/Poppins (já carregadas via Tailwind).

## Dependências & Scripts
- Countdown simples em `FinalUrgency` com `setInterval` (1 min).
- Novas imagens em `public/mentoria-novembro/` usadas em hero e seção da mentora.

## Próximos Passos Recomendados
- Validar lint/build após merges (há mensagens pendentes históricas).
- QA mobile para confirmar cortes das fotos e do contador.
- Configurar env `NEXT_PUBLIC_FORMSPREE_ID` para notificações imediatas das submissões.
