# Project Overview


## Latest Experience Updates (Outubro 2025)

- Nova landing `mentoria-outubro-2025` com header minimalista (logo + CTA), hero reformulado e formulário de captação simplificado (nome + email) ligado ao endpoint `/api/mentorship`.
- Paleta revista: CTA roxo (#6B1FBF), detalhes rosa apenas em elementos secundários e blocos alternados com fundo escuro (#0A0A0A) para ritmo visual.
- Secções adicionais: Prova de autoridade (+200 participantes, certificação PSC), benefícios em cartões, “Quem é Adriana Iria?” com duas fotos (desktop/mobile) e blocos de urgência com contador regressivo para o evento de Outubro.
- Testemunhos atualizados com fotos e CTAs consistentes, urgência final com formulário duplicado e reminder “Últimas vagas”.
- Footer minimalista com contactos diretos e mensagem “Tem dúvidas? Fala connosco no WhatsApp”.

## Homepage – Fluxo Final de Conversão

- A secção “Dê o Primeiro Passo...” virou campanha “Mentoria Exclusiva em Outubro — Vagas Muito Limitadas”, mobile-first, CTA roxo full-width e nota de urgência.
- FAQs reposicionadas imediatamente após o CTA e acrescidas da pergunta “Qual a diferença entre o evento de outubro e as sessões normais?”.
- Novo bloco `RegularBooking` sem heading duplicado encapsula o widget de agendamento padrão sob o título interno do plugin.
- Outros conteúdos institucionais (Hero, Features, About, Services, Process, ServiceComparison, Testimonials) permanecem na mesma ordem.

## Base Técnica existente

- Supabase mantém perfis de clientes, registos de lembretes e engagements.
- API de bookings continua a fazer upsert de perfis e enfileirar lembretes; notificações por email via Formspree.
- Runner de lembretes envia emails e atualiza tabelas.
- Endpoints de analytics internos continuam disponíveis para dashboards futuros.
