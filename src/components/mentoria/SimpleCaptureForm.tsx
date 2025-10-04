import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleFormData {
  name: string;
  email: string;
}

interface SimpleCaptureFormProps {
  submitText?: string;
  className?: string;
}

const SimpleCaptureForm = ({ submitText = "Quero garantir a minha vaga", className = "" }: SimpleCaptureFormProps) => {
  const [formData, setFormData] = useState<SimpleFormData>({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validação simples
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Por favor, preencha todos os campos');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          currentProfession: 'A preencher',
          currentChallenge: 'A preencher',
          mentorshipGoal: 'A preencher',
          timeCommitment: '4-6h/semana',
          supportLevel: 'suporte regular',
          availability: 'A preencher',
          expectations: 'A preencher',
          howHeard: 'Landing page',
          consent: true,
          newsletter: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Erro ao enviar. Tente novamente.');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-emerald-700 mb-2">
          Candidatura recebida!
        </h3>
        <p className="text-emerald-600 text-sm">
          Entraremos em contacto em até 24 horas úteis com os próximos passos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          type="text"
          autoComplete="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="h-12 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-[#6B1FBF] focus-visible:border-[#6B1FBF]"
          required
        />
        <Input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="h-12 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-[#6B1FBF] focus-visible:border-[#6B1FBF]"
          required
        />
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#6B1FBF] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#5814A0] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B1FBF] disabled:cursor-not-allowed disabled:opacity-80 md:w-auto"
      >
        {isSubmitting ? 'A enviar...' : submitText}
      </button>

      <p className="text-xs text-gray-500 text-center">
        As vagas fecham a qualquer momento. Garante já antes que esgotem.
      </p>
    </form>
  );
};

export default SimpleCaptureForm;
