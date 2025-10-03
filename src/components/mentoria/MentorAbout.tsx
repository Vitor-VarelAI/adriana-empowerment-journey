import { motion } from 'framer-motion';

const MentorAbout = () => {
  return (
    <section className="bg-[#F5F5FA] py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mx-auto max-w-xl">
              <div className="absolute top-6 right-6 z-20 rounded-full border border-pink-200/60 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-400 backdrop-blur">
                Mentora
              </div>
              <div className="absolute -left-8 -top-8 hidden h-72 w-64 rounded-3xl border-2 border-pink-200/70 md:block" aria-hidden="true"></div>
              <img
                src="/mentoria-novembro/WhatsApp%20Image%202025-09-22%20at%2011.37.29.jpeg"
                alt="Adriana Iria a orientar participantes da mentoria"
                className="relative z-10 w-full rounded-3xl object-cover shadow-2xl"
              />
              <img
                src="/mentoria-novembro/WhatsApp%20Image%202025-09-22%20at%2011.37.29%20(1).jpeg"
                alt="Adriana Iria em conversa com participante"
                className="absolute -bottom-10 right-6 z-20 hidden w-48 rounded-2xl border-4 border-white object-cover shadow-xl md:block"
              />
              <div className="absolute -right-10 bottom-0 hidden h-28 w-28 rounded-full bg-[#6B1FBF]/10 blur-xl md:block" aria-hidden="true"></div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:hidden">
              <img
                src="/mentoria-novembro/WhatsApp%20Image%202025-09-22%20at%2011.37.29.jpeg"
                alt="Adriana Iria a orientar participantes da mentoria"
                className="h-36 w-full rounded-2xl object-cover shadow-lg"
              />
              <img
                src="/mentoria-novembro/WhatsApp%20Image%202025-09-22%20at%2011.37.29%20(1).jpeg"
                alt="Adriana Iria em conversa com participante"
                className="h-36 w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6B1FBF]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#6B1FBF]">
              Quem é Adriana Iria?
            </span>

            <h2 className="mt-6 text-3xl font-semibold text-gray-900 md:text-4xl">
              Estratégia, clareza e consistência para liderares a tua transformação.
            </h2>

            <p className="mt-6 text-lg text-gray-600">
              Mentora e estratega de desenvolvimento pessoal com 15 anos de experiência a guiar líderes femininas.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Certificada em PSC – Professional Self Coaching e especialista em liderança, inteligência emocional e comunicação.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Já acompanhou mais de 200 mulheres em Portugal e Brasil a criarem planos concretos e sustentáveis.
            </p>

            <ul className="mt-6 space-y-3 text-sm font-medium text-gray-500">
              <li>• Sessões quinzenais em pequenos grupos e mentoria individual.</li>
              <li>• Ferramentas práticas, templates e métricas para cada etapa.</li>
              <li>• Comunidade ativa para accountability e networking.</li>
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="rounded-full bg-[#6B1FBF] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#5814A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B1FBF]"
                onClick={() => {
                  const target = document.getElementById('inscricao');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Quero reservar a minha vaga
              </button>
              <span className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Outubro 2025 · Vagas limitadas
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MentorAbout;
