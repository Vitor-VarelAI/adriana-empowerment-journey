# Project Overview


## Latest Experience Updates (Outubro 2025)

- Nova landing `mentoria-outubro-2025` com header minimalista (logo + CTA), hero reformulado e formulário de captação simplificado (nome + email) ligado ao endpoint `/api/mentorship`.
- Paleta revista: CTA roxo (#6B1FBF), detalhes rosa apenas em elementos secundários e blocos alternados com fundo escuro (#0A0A0A) para ritmo visual.
- Secções adicionais: Prova de autoridade (+200 participantes, certificação PSC), benefícios em cartões, “Quem é Adriana Iria?” com duas fotos (desktop/mobile) e blocos de urgência com contador regressivo para o evento de Outubro.
- Questionário de qualificação (3 perguntas) envia respostas por email e apresenta botão WhatsApp imediato para leads quentes.
- Rota antiga `/mentoria` agora redireciona automaticamente para a landing final `/mentoria-outubro-2025` para garantir consistência.
- Testemunhos atualizados com fotos e CTAs consistentes, urgência final com formulário duplicado e reminder “Últimas vagas”.
- Footer minimalista com contactos diretos e mensagem “Tem dúvidas? Fala connosco no WhatsApp”.

## Homepage – Fluxo Final de Conversão

- A secção “Dê o Primeiro Passo...” virou campanha “Mentoria Exclusiva em Outubro — Vagas Muito Limitadas”, mobile-first, CTA roxo full-width e nota de urgência.
- FAQs reposicionadas imediatamente após o CTA e acrescidas da pergunta “Qual a diferença entre o evento de outubro e as sessões normais?”.
- Novo bloco `RegularBooking` sem heading duplicado encapsula o widget de agendamento padrão sob o título interno do plugin.
- Outros conteúdos institucionais (Hero, Features, About, Services, Process, ServiceComparison, Testimonials) permanecem na mesma ordem.

## Base Técnica existente

- Formulários de leads (`/api/mentorship` e `/api/mentorship-interest`) enviam notificações via Formspree; não existe mais persistência em Supabase para estes fluxos.
- Pedidos de booking usam `/api/booking-request`, que envia email com plano escolhido e horários preferidos para confirmação manual.
- Supabase permanece apenas para o motor de bookings legado (até migração), reminders e analytics existentes.
- Plano de migração do booking para modelo “email only” detalhado em `docs/booking-alternative-plan.md`.
- Runner de lembretes continua ativo para as rotinas de booking.
