import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Flame } from 'lucide-react';
import SimpleCaptureForm from './SimpleCaptureForm';

const MentoriaHero = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentImageRef = imageRef.current;
    if (currentImageRef) {
      observer.observe(currentImageRef);
    }

    return () => {
      if (currentImageRef) {
        observer.unobserve(currentImageRef);
      }
    };
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden bg-[#F5F5FA] pt-28 pb-20">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="mx-auto h-full w-full max-w-6xl bg-gradient-to-br from-white via-transparent to-[#f1e9ff] opacity-80"></div>
        <div className="absolute -left-10 top-12 hidden h-40 w-40 rounded-full border-2 border-pink-200/80 md:block"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6B1FBF]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B1FBF]">
              <Calendar className="h-4 w-4" /> Evento de Outubro
            </span>

            <h1 className="mt-6 text-4xl font-semibold text-gray-900 md:text-5xl lg:text-6xl">
              Mentoria Exclusiva de 6 Meses
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600 md:text-xl">
              Evento em Outubro — Vagas Limitadas. Reserva antecipada para quem quer acelerar resultados com acompanhamento próximo.
            </p>

            <div
              id="inscricao"
              className="mt-10 rounded-3xl border border-gray-100 bg-white p-8 shadow-lg"
            >
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
                    Pré-reserva prioritária
                  </p>
                  <p className="text-sm text-gray-500">
                    Confirmação enviada em até 24 horas úteis.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#F97316]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                  <Flame className="h-4 w-4" /> Últimas vagas
                </div>
              </div>
              <SimpleCaptureForm />
            </div>

            <p className="mt-6 flex items-center gap-3 text-sm text-gray-500">
              <Users className="h-5 w-5 text-[#6B1FBF]" /> Inscrições abertas até esgotar vagas.
            </p>
          </motion.div>

          <motion.div
            className="relative w-full lg:w-1/2"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="relative mx-auto max-w-xl">
              <div className="absolute -left-6 -top-6 hidden h-80 w-64 rounded-3xl border-2 border-pink-200 md:block" aria-hidden="true"></div>
              <div className="absolute -right-10 bottom-10 hidden h-24 w-24 rounded-full bg-[#6B1FBF]/10 md:block" aria-hidden="true"></div>
              <img
                ref={imageRef}
                src="/mentoria-novembro/WhatsApp%20Image%202025-10-01%20at%2015.00.27.jpeg"
                alt="Adriana Iria no evento de mentoria"
                className="relative z-10 w-full rounded-3xl bg-white object-cover shadow-2xl transition-opacity duration-700 ease-out opacity-0 image-fade"
              />
              <motion.div
                className="absolute left-4 top-4 rounded-2xl bg-white px-5 py-4 shadow-lg"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Próxima turma</p>
                <p className="text-lg font-semibold text-[#6B1FBF]">Outubro 2025</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MentoriaHero;
