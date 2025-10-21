# Project Overview


## Latest Experience Updates

- Nova landing `mentoria-outubro-2025` (slug histórico) com header minimalista (logo + CTA), hero reformulado e formulário de captação simplificado (nome + email) ligado ao endpoint `/api/mentorship`.
- Paleta revista: CTA roxo (#6B1FBF), detalhes rosa apenas em elementos secundários e blocos alternados com fundo escuro (#0A0A0A) para ritmo visual.
- Secções adicionais: Prova de autoridade (+200 participantes, certificação PSC), benefícios em cartões, “Quem é Adriana Iria?” com duas fotos (desktop/mobile) e blocos de urgência com contador regressivo para a campanha da mentoria.
- Questionário de qualificação (3 perguntas) envia respostas por email e apresenta botão WhatsApp imediato para leads quentes.
- Rota antiga `/mentoria` agora redireciona automaticamente para a landing final `/mentoria-outubro-2025` para garantir consistência.
- Testemunhos atualizados com fotos e CTAs consistentes, urgência final com formulário duplicado e reminder “Últimas vagas”.
- Footer minimalista com contactos diretos e mensagem “Tem dúvidas? Fala connosco no WhatsApp”.

## Homepage – Fluxo Final de Conversão

- A secção “Dê o Primeiro Passo...” virou campanha “Mentoria Exclusiva” com CTA roxo full-width e nota de urgência.
- FAQs reposicionadas imediatamente após o CTA e acrescidas da pergunta “Qual a diferença entre a mentoria e as sessões normais?”.
- Novo bloco `RegularBooking` sem heading duplicado encapsula o widget de agendamento padrão sob o título interno do plugin.
- Outros conteúdos institucionais (Hero, Features, About, Services, Process, ServiceComparison, Testimonials) permanecem na mesma ordem.

## Base Técnica existente

- Formulários de leads (`/api/mentorship` e `/api/mentorship-interest`) enviam notificações via Formspree.
- Booking principal usa `/api/bookings` (store em memória + Formspree) e mantém o widget multi-step.
- `/api/booking-request` permanece como alternativa puramente manual para campanhas específicas.
- Supabase foi removido; reminders/analytics devolvem `501` até existir nova persistência.
- Runner de lembretes encontra-se pausado (ver `docs/reminder_workflow.md`).
