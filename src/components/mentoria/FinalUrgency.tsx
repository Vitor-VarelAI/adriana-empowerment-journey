'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock } from 'lucide-react';
import SimpleCaptureForm from './SimpleCaptureForm';

const FinalUrgency = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const target = new Date('2025-10-01T09:00:00');

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft({ days, hours, minutes });
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#0A0A0A] py-20 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <CalendarClock className="h-4 w-4 text-[#6B1FBF]" /> Evento de Outubro
          </div>
          <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
            Evento em Outubro — Últimas Vagas
          </h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">
            Não deixe para depois, garanta já a sua participação.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center"
              >
                <p className="text-3xl font-semibold text-white">{value.toString().padStart(2, '0')}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
              </div>
            ))}
          </div>

          <div className="my-8 h-px w-full bg-white/10" aria-hidden="true" />

          <div className="flex flex-col gap-3 text-center text-sm text-white/70 md:flex-row md:items-center md:justify-between md:text-left">
            <div>
              <p className="uppercase tracking-[0.3em] text-white/50">Reserva final</p>
              <p className="text-base font-medium text-white">
                Inscrições encerram ao atingir o limite da turma.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
              <AlertTriangle className="h-4 w-4 text-[#FF9F43]" /> Vagas limitadas
            </div>
          </div>

          <div className="mt-8">
            <SimpleCaptureForm className="mt-6" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalUrgency;
