
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionWrapper from './SectionWrapper';

const CTA = () => {
  return (
    <SectionWrapper
      id="book"
      background="custom"
      className="section-padding bg-[#F8F8F8]"
    >
      <div className="container mx-auto">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-semibold leading-snug text-[#111111] md:text-4xl">
            <span className="block">Mentoria Exclusiva em Outubro</span>
            <span className="block">Vagas Muito Limitadas</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#666666] md:text-lg md:text-[#555555]">
            Programa intensivo de 6 meses para acelerar resultados e clareza. Evento único com acompanhamento próximo, preparado para transformar a tua jornada.
          </p>
          <Link
            href="/mentoria-outubro-2025"
            className="mt-6 inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#6B1FBF] px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#5814A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B1FBF] md:w-auto md:px-8 md:text-sm"
          >
            Reservar Vaga Agora
          </Link>
          <p className="mt-6 text-xs text-[#999999] md:text-sm">
            Últimas vagas disponíveis para outubro 2025
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default CTA;
