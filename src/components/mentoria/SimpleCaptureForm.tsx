import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleFormData {
  name: string;
  email: string;
  phone: string;
  currentProfession: string;
  currentChallenge: string;
  mentorshipGoal: string;
  timeCommitment: string;
  supportLevel: string;
  availability: string;
  expectations: string;
  howHeard: string;
  consent: boolean;
  newsletter: boolean;
}

interface SimpleCaptureFormProps {
  submitText?: string;
  className?: string;
}

const timeCommitmentOptions = [
  { value: '2-4h/semana', label: '2-4h/semana (leve)' },
  { value: '4-6h/semana', label: '4-6h/semana (moderado)' },
  { value: '6-8h/semana', label: '6-8h/semana (intenso)' },
  { value: '+8h/semana', label: '+8h/semana (máximo)' },
];

const supportLevelOptions = [
  { value: 'orientação básica', label: 'Orientação básica (check-ins quinzenais)' },
  { value: 'suporte regular', label: 'Suporte regular (sessões semanais)' },
  { value: 'acompanhamento intensivo', label: 'Acompanhamento intensivo (contacto diário)' },
];

const MIN_LONG_TEXT = 10;

const buildDefaultForm = (): SimpleFormData => ({
  name: '',
  email: '',
  phone: '',
  currentProfession: '',
  currentChallenge: '',
  mentorshipGoal: '',
  timeCommitment: '',
  supportLevel: '',
  availability: '',
  expectations: '',
  howHeard: '',
  consent: false,
  newsletter: false,
});

const SimpleCaptureForm = ({ submitText = 'Quero garantir a minha vaga', className = '' }: SimpleCaptureFormProps) => {
  const [formData, setFormData] = useState<SimpleFormData>(buildDefaultForm());
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SimpleFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData(buildDefaultForm());
    setFieldErrors({});
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof SimpleFormData, string>> = {};

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedProfession = formData.currentProfession.trim();
    const trimmedChallenge = formData.currentChallenge.trim();
    const trimmedGoal = formData.mentorshipGoal.trim();
    const trimmedAvailability = formData.availability.trim();
    const trimmedExpectations = formData.expectations.trim();
    const trimmedHowHeard = formData.howHeard.trim();

    if (!trimmedName) newErrors.name = 'Nome é obrigatório.';

    if (!trimmedEmail) newErrors.email = 'Email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) newErrors.email = 'Email inválido.';

    if (!trimmedPhone) newErrors.phone = 'Telefone é obrigatório.';
    else if (trimmedPhone.replace(/\D/g, '').length < 9) newErrors.phone = 'Informe um telefone com pelo menos 9 dígitos.';

    if (!trimmedProfession) newErrors.currentProfession = 'Profissão atual é obrigatória.';

    if (!trimmedChallenge || trimmedChallenge.length < MIN_LONG_TEXT) {
      newErrors.currentChallenge = `Descreva seu desafio com pelo menos ${MIN_LONG_TEXT} caracteres.`;
    }

    if (!trimmedGoal || trimmedGoal.length < MIN_LONG_TEXT) {
      newErrors.mentorshipGoal = `Descreva seu objetivo com pelo menos ${MIN_LONG_TEXT} caracteres.`;
    }

    if (!formData.timeCommitment) newErrors.timeCommitment = 'Selecione o compromisso de tempo.';

    if (!formData.supportLevel) newErrors.supportLevel = 'Selecione o nível de suporte desejado.';

    if (!trimmedAvailability) newErrors.availability = 'Disponibilidade é obrigatória.';

    if (!trimmedExpectations || trimmedExpectations.length < MIN_LONG_TEXT) {
      newErrors.expectations = `Descreva suas expectativas com pelo menos ${MIN_LONG_TEXT} caracteres.`;
    }

    if (trimmedHowHeard.length > 200) newErrors.howHeard = 'Campo deve ter no máximo 200 caracteres.';

    if (!formData.consent) newErrors.consent = 'É necessário aceitar os termos da mentoria.';

    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setError('Por favor, corrija os campos destacados antes de enviar.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isValid = validate();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          currentProfession: formData.currentProfession.trim(),
          currentChallenge: formData.currentChallenge.trim(),
          mentorshipGoal: formData.mentorshipGoal.trim(),
          timeCommitment: formData.timeCommitment,
          supportLevel: formData.supportLevel,
          availability: formData.availability.trim(),
          expectations: formData.expectations.trim(),
          howHeard: formData.howHeard.trim() || undefined,
          consent: formData.consent,
          newsletter: formData.newsletter,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        resetForm();
      } else {
        setError(result.error || 'Erro ao enviar. Tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
        <h3 className="mb-2 text-lg font-semibold text-emerald-700">Candidatura recebida!</h3>
        <p className="text-sm text-emerald-600">
          Obrigado por enviar todos os dados. Entraremos em contacto em até 24 horas úteis com os próximos passos.
        </p>
      </div>
    );
  }

  const renderError = (field: keyof SimpleFormData) =>
    fieldErrors[field] ? <p className="text-xs text-red-500">{fieldErrors[field]}</p> : null;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <Input
            type="text"
            autoComplete="name"
            placeholder="Nome completo *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 border-gray-200 bg-white focus-visible:border-[#6B1FBF] focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          />
          {renderError('name')}
        </div>
        <div>
          <Input
            type="email"
            autoComplete="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-12 border-gray-200 bg-white focus-visible:border-[#6B1FBF] focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          />
          {renderError('email')}
        </div>
        <div>
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="Telefone/WhatsApp *"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="h-12 border-gray-200 bg-white focus-visible:border-[#6B1FBF] focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          />
          {renderError('phone')}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Profissão atual *"
            value={formData.currentProfession}
            onChange={(e) => setFormData({ ...formData, currentProfession: e.target.value })}
            className="h-12 border-gray-200 bg-white focus-visible:border-[#6B1FBF] focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          />
          {renderError('currentProfession')}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Textarea
            placeholder="Descreva seu desafio atual *"
            rows={3}
            value={formData.currentChallenge}
            onChange={(e) => setFormData({ ...formData, currentChallenge: e.target.value })}
            className="border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          />
          {renderError('currentChallenge')}
        </div>
        <div>
          <Textarea
            placeholder="Qual o seu objetivo com a mentoria? *"
            rows={3}
            value={formData.mentorshipGoal}
            onChange={(e) => setFormData({ ...formData, mentorshipGoal: e.target.value })}
            className="border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          />
          {renderError('mentorshipGoal')}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <select
            value={formData.timeCommitment}
            onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
            className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          >
            <option value="">Compromisso de tempo semanal *</option>
            {timeCommitmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {renderError('timeCommitment')}
        </div>
        <div>
          <select
            value={formData.supportLevel}
            onChange={(e) => setFormData({ ...formData, supportLevel: e.target.value })}
            className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
          >
            <option value="">Nível de suporte desejado *</option>
            {supportLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {renderError('supportLevel')}
        </div>
      </div>

      <div>
        <Input
          type="text"
          placeholder="Disponibilidade (dias/horários) *"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="h-12 border-gray-200 bg-white focus-visible:border-[#6B1FBF] focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
        />
        {renderError('availability')}
      </div>

      <div>
        <Textarea
          placeholder="Quais são suas expectativas com a mentoria? *"
          rows={3}
          value={formData.expectations}
          onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
          className="border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
        />
        {renderError('expectations')}
      </div>

      <div>
        <Input
          type="text"
          placeholder="Como conheceu a mentoria? (opcional)"
          value={formData.howHeard}
          onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
          className="h-12 border-gray-200 bg-white focus-visible:border-[#6B1FBF] focus-visible:ring-2 focus-visible:ring-[#6B1FBF]"
        />
        {renderError('howHeard')}
      </div>

      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={(checked) => setFormData({ ...formData, consent: checked === true })}
          />
          <Label htmlFor="consent" className="text-sm leading-relaxed text-gray-700">
            Confirmo que os dados fornecidos são verdadeiros e autorizo o contacto da mentoria para sequência do processo. *
          </Label>
        </div>
        {renderError('consent')}

        <div className="flex items-start gap-3">
          <Checkbox
            id="newsletter"
            checked={formData.newsletter}
            onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked === true })}
          />
          <Label htmlFor="newsletter" className="text-sm leading-relaxed text-gray-700">
            Quero receber conteúdos e novidades da Adriana (opcional)
          </Label>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-sm text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#6B1FBF] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#5814A0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1FBF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80 md:w-auto"
      >
        {isSubmitting ? 'A enviar...' : submitText}
      </button>

      <p className="text-center text-xs text-gray-500">
        As vagas fecham a qualquer momento. O preenchimento completo garante prioridade na análise.
      </p>
    </form>
  );
};

export default SimpleCaptureForm;
