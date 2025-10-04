'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock, Flame } from 'lucide-react';
import SimpleCaptureForm from './SimpleCaptureForm';

const FinalUrgency = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const GLOBAL_DEADLINE = useMemo(() => new Date('2025-10-31T23:59:59+01:00'), []);

  const MICRO_DEADLINES = useMemo(
    () => [
      {
        id: 'promo_1',
        deadline: '2025-10-05T23:59:59+01:00',
        headline: 'Só até domingo 5 de outubro',
        detail: '2 vagas com valor promocional e onboarding prioritário.',
      },
      {
        id: 'promo_2',
        deadline: '2025-10-12T23:59:59+01:00',
        headline: 'Check-in de meio do mês',
        detail: 'Última janela para garantir material de preparação bônus.',
      },
      {
        id: 'waitlist',
        deadline: '2025-10-20T23:59:59+01:00',
        headline: 'Fase final de confirmações',
        detail: 'Depois deste ponto, vagas remanescentes seguem para lista de espera.',
      },
    ],
    [],
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = GLOBAL_DEADLINE.getTime() - now.getTime();

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
  }, [GLOBAL_DEADLINE]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return MICRO_DEADLINES
      .map(deadline => ({ ...deadline, date: new Date(deadline.deadline) }))
      .filter(deadline => deadline.date.getTime() >= now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [MICRO_DEADLINES]);

  const formatDeadline = (date: Date) =>
    new Intl.DateTimeFormat('pt-PT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(date);

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
            As vagas fecham a qualquer momento. Garante já antes que esgotem.
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

          {upcomingDeadlines.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {upcomingDeadlines.map(deadline => (
                <div
                  key={deadline.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5 text-left"
                >
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#6B1FBF]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9B8FF]">
                    <Flame className="h-3.5 w-3.5" /> Micro deadline
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {deadline.headline}
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    {deadline.detail}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/40">
                    Fecha {formatDeadline(deadline.date)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <SimpleCaptureForm
              className="mt-6"
              submitText="Quero garantir antes de fechar"
            />
            <p className="mt-4 text-xs text-center text-white/60">
              Mantemos o cronómetro global até 31 de outubro. Os micro prazos acima ajudam a criar picos de decisão rápidos ao longo do mês.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalUrgency;
