import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Catarina Mendes',
    role: 'Fundadora, Lisbon',
    result: 'Estruturei o meu plano de expansão e bati as metas do trimestre em 6 semanas.',
    avatar: '/lovable-uploads/6868c7c7-899b-48af-86d9-4729accdc0d7.png',
  },
  {
    name: 'Andreia Costa',
    role: 'Gestora de Projeto',
    result: 'Ganhei clareza para liderar a equipa e fui promovida antes do final da mentoria.',
    avatar: '/lovable-uploads/46de618f-0c18-436a-a9ab-c7744784a9b7.png',
  },
  {
    name: 'Mariana Lopes',
    role: 'Consultora Estratégica',
    result: 'Passei a comunicar com confiança, reajustei o pricing e tripliquei o volume de propostas.',
    avatar: '/lovable-uploads/86fb6b84-589d-4a46-894f-093f11a2e9ca.png',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6B1FBF]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#6B1FBF]">
            Testemunhos reais
          </span>
          <h2 className="mt-6 text-3xl font-semibold text-gray-900 md:text-4xl">
            Resultados práticos e mensuráveis
          </h2>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Histórias recentes de quem já viveu a mentoria e acelerou decisões, ações e resultados.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              className="flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-[#F9FAFB] p-8 shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Quote className="h-8 w-8 text-[#6B1FBF]" />
              <p className="mt-6 text-lg text-gray-700">{testimonial.result}</p>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={`Foto de ${testimonial.name}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm uppercase tracking-wide text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-14 flex flex-col items-center gap-6 rounded-3xl bg-[#0A0A0A] px-8 py-10 text-center text-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Mentoria exclusiva</p>
          <h3 className="text-2xl font-semibold">
            Vagas limitadas para a próxima turma — garante o teu lugar hoje.
          </h3>
          <button
            type="button"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#0A0A0A] transition-colors duration-200 hover:bg-white/90"
            onClick={() => {
              const target = document.getElementById('inscricao');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Quero garantir a minha vaga
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
