import { motion } from 'framer-motion';
import { Quote, Sparkles, ShieldCheck } from 'lucide-react';

const AuthorityProof = () => {
  return (
    <section className="bg-[#0A0A0A] py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center md:justify-between">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <Sparkles className="h-4 w-4 text-[#6B1FBF]" /> Prova de autoridade
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white/5 p-8">
              <Quote className="absolute -top-6 -left-6 h-16 w-16 text-pink-200/40" aria-hidden="true" />
              <p className="text-2xl font-light leading-relaxed text-white">
                "Mudou a minha forma de pensar e agir. Em poucas semanas recuperei o foco, alinhei prioridades e passei a liderar com mais confiança."
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                Participante do ciclo 2024
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Impacto real</span>
            <span className="text-5xl font-semibold text-[#6B1FBF]">+200</span>
            <p className="text-sm text-white/70">
              participantes já transformaram suas vidas com a metodologia Empowerment Journey.
            </p>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" aria-hidden="true" />
            <div className="flex flex-col items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                <ShieldCheck className="h-4 w-4 text-[#6B1FBF]" /> Certificação PSC
              </span>
              <p className="text-sm text-white/60">
                PSC – Professional Self Coaching reconhecida internacionalmente.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthorityProof;
