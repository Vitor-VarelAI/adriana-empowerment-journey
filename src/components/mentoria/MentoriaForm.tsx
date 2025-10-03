import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
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

interface FormErrors {
  [key: string]: string;
}

const Step1 = ({ formData, setFormData, errors }: { formData: FormData; setFormData: (data: FormData) => void; errors: FormErrors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-2">Dados Pessoais</h3>
      <p className="text-muted-foreground mb-6">Vamos começar com informações básicas</p>
    </div>

    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nome completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Seu nome completo"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="seu@email.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Telefone/WhatsApp</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+351 912 345 678"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>
    </div>
  </motion.div>
);

const Step2 = ({ formData, setFormData, errors }: { formData: FormData; setFormData: (data: FormData) => void; errors: FormErrors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-2">Sua Realidade Atual</h3>
      <p className="text-muted-foreground mb-6">Onde você está agora e seus desafios</p>
    </div>

    <div className="space-y-4">
      <div>
        <Label htmlFor="currentProfession">Profissão atual *</Label>
        <Input
          id="currentProfession"
          value={formData.currentProfession}
          onChange={(e) => setFormData({ ...formData, currentProfession: e.target.value })}
          placeholder="Sua profissão ou área de atuação"
          className={errors.currentProfession ? 'border-red-500' : ''}
        />
        {errors.currentProfession && <p className="text-sm text-red-500 mt-1">{errors.currentProfession}</p>}
      </div>

      <div>
        <Label htmlFor="currentChallenge">Seu maior desafio atual *</Label>
        <Textarea
          id="currentChallenge"
          value={formData.currentChallenge}
          onChange={(e) => setFormData({ ...formData, currentChallenge: e.target.value })}
          placeholder="Descreva o principal desafio que enfrenta hoje na vida profissional ou pessoal..."
          rows={4}
          className={errors.currentChallenge ? 'border-red-500' : ''}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.currentChallenge.length}/1000 caracteres
        </p>
        {errors.currentChallenge && <p className="text-sm text-red-500 mt-1">{errors.currentChallenge}</p>}
      </div>
    </div>
  </motion.div>
);

const Step3 = ({ formData, setFormData, errors }: { formData: FormData; setFormData: (data: FormData) => void; errors: FormErrors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-2">Seus Objetivos</h3>
      <p className="text-muted-foreground mb-6">O que busca alcançar com a mentoria</p>
    </div>

    <div className="space-y-6">
      <div>
        <Label htmlFor="mentorshipGoal">Objetivo na mentoria *</Label>
        <Textarea
          id="mentorshipGoal"
          value={formData.mentorshipGoal}
          onChange={(e) => setFormData({ ...formData, mentorshipGoal: e.target.value })}
          placeholder="O que especificamente você espera alcançar ao final dos 6 meses de mentoria?"
          rows={4}
          className={errors.mentorshipGoal ? 'border-red-500' : ''}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.mentorshipGoal.length}/1000 caracteres
        </p>
        {errors.mentorshipGoal && <p className="text-sm text-red-500 mt-1">{errors.mentorshipGoal}</p>}
      </div>

      <div>
        <Label>Compromisso de tempo semanal *</Label>
        <RadioGroup
          value={formData.timeCommitment}
          onValueChange={(value) => setFormData({ ...formData, timeCommitment: value })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2-4h/semana" id="time1" />
            <Label htmlFor="time1">2-4h/semana (leve)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-6h/semana" id="time2" />
            <Label htmlFor="time2">4-6h/semana (moderado)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6-8h/semana" id="time3" />
            <Label htmlFor="time3">6-8h/semana (intenso)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="+8h/semana" id="time4" />
            <Label htmlFor="time4">+8h/semana (máximo)</Label>
          </div>
        </RadioGroup>
        {errors.timeCommitment && <p className="text-sm text-red-500 mt-1">{errors.timeCommitment}</p>}
      </div>

      <div>
        <Label>Nível de suporte desejado *</Label>
        <RadioGroup
          value={formData.supportLevel}
          onValueChange={(value) => setFormData({ ...formData, supportLevel: value })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="orientação básica" id="support1" />
            <Label htmlFor="support1">Orientação básica (check-ins quinzenais)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="suporte regular" id="support2" />
            <Label htmlFor="support2">Suporte regular (sessões semanais)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="acompanhamento intensivo" id="support3" />
            <Label htmlFor="support3">Acompanhamento intensivo (contato diário)</Label>
          </div>
        </RadioGroup>
        {errors.supportLevel && <p className="text-sm text-red-500 mt-1">{errors.supportLevel}</p>}
      </div>

      <div>
        <Label htmlFor="availability">Sua disponibilidade *</Label>
        <Input
          id="availability"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          placeholder="Ex: Segundas e quartas à noite, fins de semana flexíveis"
          className={errors.availability ? 'border-red-500' : ''}
        />
        {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability}</p>}
      </div>
    </div>
  </motion.div>
);

const Step4 = ({ formData, setFormData, errors }: { formData: FormData; setFormData: (data: FormData) => void; errors: FormErrors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-2">Finalização</h3>
      <p className="text-muted-foreground mb-6">Últimos detalhes e consentimento</p>
    </div>

    <div className="space-y-4">
      <div>
        <Label htmlFor="expectations">Suas expectativas *</Label>
        <Textarea
          id="expectations"
          value={formData.expectations}
          onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
          placeholder="Quais são suas expectativas em relação à mentoria e resultados esperados?"
          rows={4}
          className={errors.expectations ? 'border-red-500' : ''}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.expectations.length}/1000 caracteres
        </p>
        {errors.expectations && <p className="text-sm text-red-500 mt-1">{errors.expectations}</p>}
      </div>

      <div>
        <Label htmlFor="howHeard">Como conheceu a mentoria?</Label>
        <Input
          id="howHeard"
          value={formData.howHeard}
          onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
          placeholder="Redes sociais, indicação, google, etc."
        />
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
            className={errors.consent ? 'border-red-500' : ''}
          />
          <Label htmlFor="consent" className="text-sm leading-relaxed">
            Concordo com os termos da mentoria e autorizo o tratamento de meus dados
            conforme política de privacidade. *
          </Label>
        </div>
        {errors.consent && <p className="text-sm text-red-500 mt-1">{errors.consent}</p>}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter"
            checked={formData.newsletter}
            onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })}
          />
          <Label htmlFor="newsletter" className="text-sm leading-relaxed">
            Desejo receber conteúdos exclusivos e informações sobre vagas futuras
          </Label>
        </div>
      </div>
    </div>
  </motion.div>
);

const MentoriaForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
        if (formData.phone && formData.phone.length < 9) newErrors.phone = 'Telefone inválido';
        break;
      case 2:
        if (!formData.currentProfession.trim()) newErrors.currentProfession = 'Profissão é obrigatória';
        if (!formData.currentChallenge.trim() || formData.currentChallenge.length < 10) {
          newErrors.currentChallenge = 'Descreva seu desafio com pelo menos 10 caracteres';
        }
        break;
      case 3:
        if (!formData.mentorshipGoal.trim() || formData.mentorshipGoal.length < 10) {
          newErrors.mentorshipGoal = 'Descreva seu objetivo com pelo menos 10 caracteres';
        }
        if (!formData.timeCommitment) newErrors.timeCommitment = 'Selecione seu compromisso de tempo';
        if (!formData.supportLevel) newErrors.supportLevel = 'Selecione o nível de suporte';
        if (!formData.availability.trim()) newErrors.availability = 'Descreva sua disponibilidade';
        break;
      case 4:
        if (!formData.expectations.trim() || formData.expectations.length < 10) {
          newErrors.expectations = 'Descreva suas expectativas com pelo menos 10 caracteres';
        }
        if (!formData.consent) newErrors.consent = 'Consentimento obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
        setErrors({});
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrors({ submit: result.error || 'Erro ao enviar candidatura' });
      }
    } catch (error) {
      setErrors({ submit: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Candidatura Recebida!</h2>
          <p className="text-muted-foreground">
            Sua candidatura foi enviada com sucesso. Entraremos em contato em até 48h úteis.
          </p>
        </div>

        <Card className="max-w-md mx-auto mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Próximos Passos:</h3>
            <ol className="text-left space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brown font-medium">1.</span>
                <span>Análise inicial da sua candidatura</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brown font-medium">2.</span>
                <span>Contato via email para entrevista breve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brown font-medium">3.</span>
                <span>Definição do início da mentoria</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brown font-medium">4.</span>
                <span>Início da transformação em Novembro 2025</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Verifique seu email (incluindo spam) para confirmação.
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 md:p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Passo {step} de {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Content */}
        <div className="min-h-[400px] mb-8">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1 key="step1" formData={formData} setFormData={setFormData} errors={errors} />}
            {step === 2 && <Step2 key="step2" formData={formData} setFormData={setFormData} errors={errors} />}
            {step === 3 && <Step3 key="step3" formData={formData} setFormData={setFormData} errors={errors} />}
            {step === 4 && <Step4 key="step4" formData={formData} setFormData={setFormData} errors={errors} />}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 ml-auto"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Candidatura
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MentoriaForm;