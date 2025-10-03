# Mentoria Novembro – Landing Page & CTA Rollout

## Objetivo
Adicionar uma landing page de captação de leads para a Mentoria Novembro, integrando CTAs estratégicos no site existente sem reestruturar todo o design. O foco é captar leads quentes através de um questionário multi-step progressivo.

## Escopo
- Criar uma landing page minimalista, mobile-first, com scroll progressivo para a Mentoria Novembro.
- Integrar CTAs em pontos estratégicos do site atual direcionando para a nova landing page.
- Garantir copy alinhada ao posicionamento de exclusividade e compromisso individual.

## Fora do Escopo / Não Necessário
- Redesenhar o site completo ou alterar a identidade visual base existente.
- Criar um novo sistema de CMS ou migrar conteúdo atual.
- Produzir animações complexas, vídeos ou sessões de fotos adicionais.
- Implementar integrações de pagamento ou fechar inscrições automaticamente.
- Desenvolver fluxos de automação de email além da notificação inicial acordada.
- Alterar a arquitetura de informação atual fora das secções listadas para CTAs.

## Regras de Execução
- Reutilizar componentes, tokens e estilos existentes sempre que possível; introduzir novos apenas quando indispensável.
- Manter desempenho leve (carregamento rápido, sem assets pesados) e priorizar acessibilidade.
- Validar cada microentrega (landing, formulário, CTAs) antes de avançar para a próxima etapa.
- Documentar dependências técnicas adicionais antes de implementá-las.
- Evitar ajustes cosméticos não solicitados fora das áreas afetadas.

## Conteúdo da Landing Page

### Hero
- **Headline:** "Mentoria Novembro: Confiança, Clareza e Ação"
- **Subheadline:** "Um espaço exclusivo para mulheres que querem transformar padrões e viver com mais propósito."
- **CTA primário:** Botão "Quero candidatar-me" que inicia o questionário multi-step.

### Benefícios rápidos
- Ganhar mais confiança pessoal e profissional.
- Ter clareza de objetivos e um plano prático.
- Equilibrar vida pessoal e carreira.

### Exclusividade
"As vagas são limitadas e cada inscrição é avaliada. Só entram mulheres realmente comprometidas, para garantir proximidade e resultados reais."

### Questionário Multi-step
Mostrar uma pergunta por vez, com indicador de progresso opcional.
1. Qual é o teu maior desafio hoje? (Confiança pessoal / Carreira / Relacionamentos / Equilíbrio de vida / Outro)
2. O que procuras ganhar com a mentoria? (Clareza de objetivos / Disciplina / Liderança & comunicação / Autoestima / Outro)
3. Quão pronta te sentes para investir em ti agora? (Muito pronta / Pronta mas com dúvidas / Curiosa)
4. Preferência de acompanhamento (Grupo / Individual / Ambos)
5. Opcional: "Queres partilhar algo mais sobre ti?" → caixa de texto + nota "*Será lido apenas pela Adriana, em total confidencialidade.*"
- **Botão final:** "Enviar candidatura"

### Mensagem pós-envio
"Obrigada pela tua candidatura. Vais receber um email em breve com os próximos passos. Cada inscrição é avaliada para garantir proximidade e acompanhamento personalizado."

## Requisitos de UX & Conteúdo
- Priorizar design minimalista, mobile-first e scroll progressivo.
- Adotar texto curto, direto e consistente com a marca.
- Garantir estados de foco, erro e sucesso acessíveis no formulário.
- Manter a sensação de exclusividade e acompanhamento personalizado em toda a copy.

## Integração de CTA no Site Atual
- **Header/Menu fixo:** Botão destacado "Mentoria Novembro".
- **Homepage Hero:** Botão secundário "🚀 Nova Mentoria: Vagas Abertas" apontando para a landing.
- **Secção Coaching:** Banner/box com texto "✨ Nova edição especial em Novembro — vagas limitadas. [Candidatar-me]".
- **Footer:** Link discreto "Mentoria Novembro (novidade)".
- **Slide-in discreto (desktop & mobile):** Texto "🚀 Mentoria Novembro. Vagas limitadas." + botão "Quero candidatar-me" com opção de fechar.

## Estilo dos CTAs
- Utilizar cor de contraste que se destaque do esquema atual do site.
- Manter textos curtos e exclusivos: "Quero candidatar-me", "Reservar a minha vaga", "Entrar na Mentoria".
- Botões médios/grandes com padding generoso e cantos arredondados.
- Repetir CTAs nos pontos chave: header fixo, secções principais, rodapé, slide-in.

## Etapas de Execução

### Etapa 0 – Descoberta & Alinhamento
- Validar tom de voz com guia de marca existente.
- Definir fluxo de tratamento dos leads (armazenamento, notificações, follow-up).

### Etapa 1 – UX Outline
- Mapear sequência mobile-first: hero → benefícios → exclusividade → formulário → confirmação.
- Definir lógica do formulário multi-step, estados de navegação, validações e indicador de progresso.

### Etapa 2 – UI & Implementação
- Criar layout minimalista reutilizando tokens existentes e introduzindo cor de CTA contrastante.
- Implementar componente multi-step com estados (pergunta atual, progresso, texto opcional e confirmação).
- Configurar backend/API/Formspree (conforme stack atual) para persistir respostas e enviar notificações.

### Etapa 3 – Integração de CTAs
- Adicionar botão "Mentoria Novembro" no header/menu fixo.
- Atualizar hero da homepage e secção de coaching com links para a landing.
- Inserir link no footer e componente slide-in com possibilidade de fechar.

### Etapa 4 – QA & Lançamento
- Testar responsividade (mobile, tablet, desktop) e acessibilidade (tab order, estados de foco, leitores de ecrã).
- Validar fluxo completo do formulário, mensagens de erro e confirmação.
- Preparar anúncio, agendar deploy e monitorizar métricas de conversão e possíveis falhas de submissão.

## Próximos Passos
- Aprovar este plano com stakeholders.
- Priorizar desenvolvimento com base nas etapas acima.
- Definir métricas de sucesso (ex.: taxa de conclusão do formulário, nº de candidaturas qualificadas).
