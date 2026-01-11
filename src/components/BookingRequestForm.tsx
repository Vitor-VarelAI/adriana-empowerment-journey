"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const sessionTypes = [
  { value: 'online', label: 'Sessão Online' },
  { value: 'presencial', label: 'Sessão Presencial' },
];

const planOptions = [
  { value: 'single', label: 'Sessão Única', description: '1 sessão • 70€' },
  { value: 'pack4', label: 'Pacote 4 Sessões', description: '4 sessões • 280€' },
  { value: 'pack10', label: 'Pacote 10 Sessões', description: '10 sessões • 700€' },
];

interface BookingFormState {
  name: string;
  email: string;
  sessionType: 'online' | 'presencial';
  plan: 'single' | 'pack4' | 'pack10';
  date: string;
  time: string;
  note: string;
}

const initialState: BookingFormState = {
  name: '',
  email: '',
  sessionType: 'online',
  plan: 'single',
  date: '',
  time: '',
  note: '',
};

const availableSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const BookingRequestForm = () => {
  const [form, setForm] = useState<BookingFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for success query param
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setSubmitted(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleChange = (key: keyof BookingFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [key]: event.target.value }));
    };

  const handleSessionChange = (value: 'online' | 'presencial') => {
    setForm(prev => ({ ...prev, sessionType: value }));
  };

  const handlePlanChange = (value: 'single' | 'pack4' | 'pack10') => {
    setForm(prev => ({ ...prev, plan: value }));
  };

  const isWeekend = (dateString: string) => {
    const parsed = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return false;
    const day = parsed.getUTCDay();
    return day === 0 || day === 6;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError('Preencha nome e email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Email inválido.');
      return;
    }

    if (form.date && isWeekend(form.date)) {
      setError('Os pedidos são confirmados apenas em dias úteis (segunda a sexta). Escolhe outra data ou deixa em branco.');
      return;
    }

    if (form.time && !availableSlots.includes(form.time)) {
      setError('Escolhe um horário válido entre as 10:00 e as 17:00.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          sessionType: form.sessionType,
          plan: form.plan,
          date: form.date,
          time: form.time,
          note: form.note,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Não foi possível iniciar o pagamento.');
      }

      // Redirect to Stripe
      window.location.href = result.url;

    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Erro inesperado. Tente novamente.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="rounded-3xl bg-[#F5F5FA] p-8 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Pagamento Confirmado!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Obrigado pelo teu agendamento. Receberás um email com todos os detalhes em breve.
          Se precisares de alterar alguma coisa, responde diretamente a esse email.
        </p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>
          Fazer outro pedido
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="booking-name">Nome completo *</Label>
          <Input
            id="booking-name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Ex.: Ana Martins"
            required
          />
        </div>
        <div>
          <Label htmlFor="booking-email">Email *</Label>
          <Input
            id="booking-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Plano desejado</Label>
        <div className="grid gap-3 md:grid-cols-3">
          {planOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handlePlanChange(option.value as 'single' | 'pack4' | 'pack10')}
              className={`rounded-2xl border p-4 text-left transition-colors ${form.plan === option.value
                  ? 'border-[#6B1FBF] bg-[#F3EDFF] text-[#6B1FBF]'
                  : 'border-gray-200 text-gray-700 hover:border-[#6B1FBF]/40'
                }`}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="mt-1 block text-xs text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label>Tipo de sessão</Label>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {sessionTypes.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSessionChange(option.value as 'online' | 'presencial')}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${form.sessionType === option.value
                    ? 'border-[#6B1FBF] bg-[#F3EDFF] text-[#6B1FBF]'
                    : 'border-gray-200 text-gray-700 hover:border-[#6B1FBF]/40'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="booking-date">Data preferida</Label>
            <Input
              id="booking-date"
              type="date"
              value={form.date}
              onChange={handleChange('date')}
              className="text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">Disponibilidade de segunda a sexta-feira.</p>
          </div>
          <div>
            <Label htmlFor="booking-time">Horário preferido</Label>
            <select
              id="booking-time"
              value={form.time}
              onChange={event => setForm(prev => ({ ...prev, time: event.target.value }))}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:border-[#6B1FBF] focus:outline-none focus:ring-2 focus:ring-[#6B1FBF]/40"
            >
              <option value="">Seleciona um horário</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="booking-note">Mensagem (opcional)</Label>
        <Textarea
          id="booking-note"
          rows={4}
          value={form.note}
          onChange={handleChange('note')}
          placeholder="Partilha detalhes relevantes (objetivo da sessão, disponibilidade extra, etc.)"
          className="text-sm"
        />
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-sm text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        <p>
          Atendimento disponível apenas em dias úteis, entre as 10h e as 18h (hora de Lisboa).
          <strong> O pagamento é necessário para confirmar o agendamento.</strong>
        </p>
        <p className="text-xs text-gray-500">Todas as informações são usadas apenas para organizar a sessão.</p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#6B1FBF] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#5814A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B1FBF] disabled:cursor-not-allowed disabled:opacity-80 md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            A processar...
          </>
        ) : (
          'Pagar e Agendar'
        )}
      </Button>
    </form>
  );
};

export default BookingRequestForm;
