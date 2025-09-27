import { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import { Clock, User, Mail, MessageSquare, Loader2, Phone, Package, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { useBooking } from '@/contexts/BookingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, FORMSPREE_FORM_ID } from '@/lib/config';
import { useNavigation } from '@/contexts/NavigationContext';
type CustomerProfileResponse = {
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  session_type?: string;
  preferred_session_types?: string[];
  preferred_days?: string[];
  preferred_time_ranges?: Array<Record<string, unknown>>;
  reminder_opt_in?: boolean;
  locale?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
};


type ReminderPlanItem = {
  channel: string;
  offsetMinutes: number;
};

function buildReminderPlan(sessionType: 'Online' | 'Presencial'): ReminderPlanItem[] {
  return [
    { channel: 'email', offsetMinutes: 24 * 60 },
    { channel: 'email', offsetMinutes: sessionType === 'Online' ? 60 : 90 },
  ];
}

type Service = {
  id: number;
  name: string;
  duration: string;
  price: string;
  selected: boolean;
};

async function fetchCustomerProfile(email: string): Promise<CustomerProfileResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(`Failed to load profile: ${response.status}`);
    }
    const data = await response.json();
    if (!data || typeof data !== 'object' || 'error' in data) {
      return null;
    }
    return data as CustomerProfileResponse;
  } catch (error) {
    console.warn('fetchCustomerProfile failed', error);
    throw error;
  }
}

const BookingTable = () => {
  const isMobile = useIsMobile();
  const { navigate } = useNavigation();
  const { selectedPackage, clearSelectedPackage } = useBooking();

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Sessão Única', duration: '1 sessão', price: '70€', selected: false },
    { id: 2, name: 'Pacote de 4 Sessões', duration: '4 sessões', price: '280€', selected: false },
    { id: 3, name: 'Pacote de 10 Sessões', duration: '10 sessões', price: '700€', selected: false },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  // TODO: Prefill these fields with data fetched from customer_profiles once available.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sessionType, setSessionType] = useState<'Online' | 'Presencial'>('Online');
  const [message, setMessage] = useState('');

  // Availability cache and loading state
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);
  const [availabilityCache, setAvailabilityCache] = useState<{ [key: string]: { times: string[]; timestamp: number } }>({});
  const [customerProfile, setCustomerProfile] = useState<CustomerProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (!email || !/.+@.+/.test(email)) return;

    let active = true;
    setIsLoadingProfile(true);
    fetchCustomerProfile(email)
      .then((profile) => {
        if (!active) return;
        setCustomerProfile(profile);
        if (profile) {
          if (typeof profile.customer_name === 'string' && profile.customer_name.length > 0) {
            setName(prev => (prev && prev.length > 0 ? prev : profile.customer_name || ''));
          }
          if (typeof profile.customer_phone === 'string' && profile.customer_phone.length > 0) {
            setPhone(prev => (prev && prev.length > 0 ? prev : profile.customer_phone || ''));
          }
          const preferredSessions = Array.isArray(profile.preferred_session_types)
            ? profile.preferred_session_types.filter((value): value is string => typeof value === 'string')
            : [];
          const candidateSession =
            typeof profile.session_type === 'string'
              ? profile.session_type
              : preferredSessions[0];
          if (candidateSession) {
            const normalized = candidateSession.toLowerCase();
            setSessionType(normalized.includes('pres') ? 'Presencial' : 'Online');
          }
        }
      })
      .catch((error) => {
        console.warn('Failed to load customer profile', error);
      })
      .finally(() => {
        if (active) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      active = false;
    };
  }, [email]);

  // Function to fetch real availability from backend
  const fetchRealAvailability = async (date: Date): Promise<string[]> => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Check cache first (5 minute cache)
    const cached = availabilityCache[dateString];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      console.log(`🎯 Using cached availability for ${dateString}`);
      return cached.times;
    }

    console.log(`📡 Fetching real availability for ${dateString}`);
    setIsFetchingAvailability(true);

    try {
      const response = await fetch(`${API_BASE_URL}/bookings?date=${dateString}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`📅 Availability response for ${dateString}:`, data);

      if (!data.success || !Array.isArray(data.availableTimes)) {
        throw new Error(data.error || 'Failed to fetch availability');
      }

      setAvailabilityCache(prev => ({
        ...prev,
        [dateString]: {
          times: data.availableTimes,
          timestamp: Date.now()
        }
      }));

      return data.availableTimes as string[];
    } catch (error) {
      console.error(`❌ Failed to fetch availability for ${dateString}:`, error);
      toast.error('❌ Não foi possível obter horários disponíveis', {
        description: 'Tente novamente ou selecione outra data.',
        duration: 6000,
      });
      return [];
    } finally {
      setIsFetchingAvailability(false);
    }
  };

  const resetForm = useCallback(() => {
    setServices(services.map(s => ({ ...s, selected: false })));
    setSelectedDate(undefined);
    setSelectedTime(null);
    setAvailableTimes([]);
    setName('');
    setEmail('');
    setMessage('');
    setCurrentStep(1);
    setHasSubmitted(false);
  }, [services]);


  const handleDateSelect = async (date: Date | undefined) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      // Prevent selecting past dates
      if (normalizedDate < today) {
        return;
      }

      setSelectedDate(normalizedDate);
      setSelectedTime(null);
      setAvailableTimes([]);

      // Show immediate feedback
      toast.success(`📅 Data selecionada: ${format(normalizedDate, 'dd/MM/yyyy')}`, {
        description: 'A verificar horários disponíveis...',
        duration: 2000,
        icon: '📅'
      });

      // Fetch real availability from backend
      const times = await fetchRealAvailability(normalizedDate);
      setAvailableTimes(times);
    } else {
      setSelectedDate(undefined);
      setSelectedTime(null);
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      setSelectedTime(time);

      toast.success(`⏰ Horário confirmado: ${time}`, {
        description: `Data: ${format(selectedDate, 'dd/MM/yyyy')} - Clique em "Próximo" para avançar.`,
        duration: 3000,
        icon: '⏰'
      });
    }
  };

  const handleServiceSelect = (id: number) => {
    setServices(services.map(service => ({
      ...service,
      selected: service.id === id
    })));
  };

  const handleNext = () => {
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !services.some(service => service.selected);
    }
    if (currentStep === 2) {
      return !selectedDate || !selectedTime;
    }
    if (currentStep === 3) {
      const isPhoneValid = /^9[1236]\d{7}$/.test(phone);
      return !name || !email || !isPhoneValid || isLoadingProfile;
    }
    return false;
  };

  const selectedService = services.find(s => s.selected);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || hasSubmitted) {
      console.log('⚠️ Form already submitting or submitted - preventing double submission');
      return;
    }

    if (currentStep !== 3 || !selectedDate || !selectedTime) {
      return;
    }

    setHasSubmitted(true);
    setIsSubmitting(true);

    const dateString = format(selectedDate, 'yyyy-MM-dd');

    const preferredSessionTypes = Array.isArray(customerProfile?.preferred_session_types)
      ? customerProfile.preferred_session_types.filter((value): value is string => typeof value === 'string')
      : [];
    const preferredDays = Array.isArray(customerProfile?.preferred_days)
      ? customerProfile.preferred_days.filter((value): value is string => typeof value === 'string')
      : [];
    const preferredTimeRanges = Array.isArray(customerProfile?.preferred_time_ranges)
      ? customerProfile.preferred_time_ranges
      : [];
    const reminderPlan = buildReminderPlan(sessionType);

    const bookingPayload = {
      name,
      email,
      phone,
      sessionType,
      serviceId: selectedService?.id ?? null,
      serviceName: selectedService?.name || 'Sessão',
      date: dateString,
      time: selectedTime,
      message: message || null,
      reminderOptIn: customerProfile?.reminder_opt_in ?? true,
      preferredSessionTypes,
      preferredDays,
      preferredTimeRanges,
      reminderPlan,
      locale: customerProfile?.locale ?? null,
      metadata: {
        profileMetadata: customerProfile?.metadata ?? null,
        servicePrice: selectedService?.price ?? null,
        capturedBy: 'booking-form',
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (response.status === 409) {
        toast.error('Horário já reservado', {
          description: 'Escolha outro horário disponível para esta data.',
          duration: 6000,
        });
        const refreshed = await fetchRealAvailability(selectedDate);
        setAvailableTimes(refreshed);
        setHasSubmitted(false);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Falha ao criar agendamento');
      }

      if (Array.isArray(data.availableTimes)) {
        setAvailableTimes(data.availableTimes);
        setAvailabilityCache(prev => ({
          ...prev,
          [dateString]: {
            times: data.availableTimes,
            timestamp: Date.now(),
          },
        }));
      }

      try {
        const formspreeId = FORMSPREE_FORM_ID;
        if (formspreeId) {
          console.log('📧 Sending email notification via Formspree...');
          const emailPayload = {
            name,
            email,
            phone: phone || 'Não fornecido',
            sessionType,
            serviceName: selectedService?.name || 'Sessão',
            sessionDate: format(selectedDate, 'dd/MM/yyyy'),
            sessionTime: selectedTime,
            message: message || 'Sem mensagem adicional',
            bookingId: data.booking?.id ?? null,
            bookingReference: `${dateString} ${selectedTime}`,
            timestamp: new Date().toISOString(),
          };

          const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(emailPayload),
          });

          if (!formspreeResponse.ok) {
            console.warn('⚠️ Formspree notification failed:', formspreeResponse.status);
          }
        }
      } catch (emailError) {
        console.error('❌ Failed to send email notification:', emailError);
      }

      toast.success('✅ Agendamento confirmado com sucesso!', {
        description: 'Você receberá um email de confirmação com os detalhes da sessão.',
        duration: 6000,
      });

      setTimeout(() => {
        resetForm();
        navigate('/obrigado');
      }, 1500);
    } catch (error) {
      console.error('❌ Booking process failed:', error);
      setHasSubmitted(false);

      const description = error instanceof Error
        ? error.message
        : 'Por favor, tente novamente.';

      toast.error('Falha no agendamento', {
        description,
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedPackage && currentStep === 1) {
      const updatedServices = services.map(service => {
        if (service.name.toLowerCase() === selectedPackage.name.toLowerCase() ||
            (selectedPackage.name === 'Sessão Única' && service.name === 'Sessão Única')) {
          return { ...service, selected: true };
        }
        return { ...service, selected: false };
      });
      setServices(updatedServices);
    }
  }, [selectedPackage, currentStep, services]);

  return (
    <section id="booking-table" className="section-padding bg-offwhite">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="section-title">Agende a Sua Sessão</h2>
            <p className="text-muted-foreground mt-4">
              Selecione o serviço, a data e o horário que melhor se adequam à sua agenda.
            </p>
          </div>

          {selectedPackage && (
            <motion.div 
              className="bg-brown/5 border border-brown/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <Package className="text-brown mr-3" />
                <div>
                  <p className="font-medium">Está a reservar o <span className="text-brown">{selectedPackage.name} - {selectedPackage.price}</span></p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearSelectedPackage();
                  toast.info("Seleção de plano removida");
                }}
              >
                Alterar
              </Button>
            </motion.div>
          )}

          <form onSubmit={handleFormSubmit}>

            <Card className="border-brown/10 overflow-hidden">
              <CardHeader className="border-b border-brown/10 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-brown mb-1">Agende sua Sessão</CardTitle>
                    <p className="text-sm text-muted-foreground">Preencha os dados abaixo para confirmar seu agendamento</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex space-x-1 sm:space-x-2 text-xs">
                    <span className={`px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${currentStep >= 1 ? 'bg-brown text-white shadow-sm' : 'bg-gray-200 text-gray-600'}`}>
                      {currentStep === 1 ? '1️⃣' : '✓'} Serviço
                    </span>
                    <span className={`px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${currentStep >= 2 ? 'bg-brown text-white shadow-sm' : 'bg-gray-200 text-gray-600'}`}>
                      {currentStep === 2 ? '2️⃣' : currentStep > 2 ? '✓' : '2'} Data & Hora
                    </span>
                    <span className={`px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${currentStep >= 3 ? 'bg-brown text-white shadow-sm' : 'bg-gray-200 text-gray-600'}`}>
                      {currentStep === 3 ? '3️⃣' : '3'} Seus Dados
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-playfair text-brown mb-2">Escolha seu plano de sessões</h3>
                        <p className="text-sm text-muted-foreground">Selecione o tipo de coaching que melhor se adapta às suas necessidades</p>
                      </div>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id)}
                            className={`p-4 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 ${
                              service.selected
                                ? 'bg-brown/10 border-2 border-brown/30 shadow-md transform scale-[1.02]'
                                : 'bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md'
                            }`}
                            role="button"
                            tabIndex={0}
                            aria-pressed={service.selected}
                            aria-label={`Selecionar ${service.name} - ${service.duration} - ${service.price}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleServiceSelect(service.id);
                              }
                            }}
                            onFocus={(e) => {
                              e.currentTarget.classList.add('ring-2', 'ring-brown/50');
                            }}
                            onBlur={(e) => {
                              e.currentTarget.classList.remove('ring-2', 'ring-brown/50');
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${service.selected ? 'bg-brown text-white' : 'bg-gray-100 text-gray-600'}`}>
                                <Clock size={16} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{service.name}</p>
                                <p className="text-sm text-muted-foreground">{service.duration}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-brown">{service.price}</span>
                              {service.selected && (
                                <div className="text-xs text-green-600 mt-1">✓ Selecionado</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-playfair text-brown mb-2">Escolha data e horário</h3>
                        <p className="text-sm text-muted-foreground">Selecione uma data disponível e escolha o melhor horário para sua sessão</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-full md:w-auto">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                              return date < today || isWeekend;
                            }}
                            className="rounded-md border bg-white"
                            weekStartsOn={1}
                            showOutsideDays={true}
                            fixedWeeks={true}
                            numberOfMonths={1}
                          />
                          {selectedDate && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
                            >
                              <p className="text-sm font-medium text-green-800">
                                ✓ Data selecionada: {format(selectedDate, 'dd/MM/yyyy')}
                              </p>
                            </motion.div>
                          )}
                        </div>
                        {selectedDate && (
                          <motion.div 
                            className="w-full md:flex-1 p-4 border rounded-lg bg-brown/5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="font-medium mb-2 text-brown flex items-center">
                              Horários para {format(selectedDate, 'PPP')}
                              {isFetchingAvailability && (
                                <Loader2 className="ml-2 h-4 w-4 animate-spin text-blue-600" />
                              )}
                            </h4>
                            
                            {isFetchingAvailability ? (
                              <div className="space-y-3">
                                <div className="text-center py-8">
                                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-3" />
                                  <p className="text-sm text-muted-foreground">A verificar disponibilidade na agenda...</p>
                                  <p className="text-xs text-muted-foreground mt-1">Isto pode levar alguns segundos</p>
                                </div>
                              </div>
                            ) : availableTimes.length > 0 ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                  {availableTimes.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                      <motion.div
                                        key={time}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Button
                                          variant={isSelected ? "sessionButton" : "outline"}
                                          className={`text-sm w-full transition-all duration-200 ${
                                            isSelected
                                              ? '!bg-green-600 !text-white shadow-lg ring-2 ring-green-300'
                                              : 'hover:bg-brown/10 hover:text-brown'
                                          }`}
                                          onClick={() => handleTimeSelect(time)}
                                          aria-pressed={isSelected}
                                          aria-label={`Selecionar horário ${time}`}
                                        >
                                          {isSelected && '✓ '} {time}
                                        </Button>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                                <div className="text-xs text-green-600 bg-green-50 p-2 rounded text-center">
                                  ✓ Horários atualizados em tempo real
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <p className="text-sm text-muted-foreground mb-2">Nenhum horário disponível para esta data.</p>
                                <p className="text-xs text-muted-foreground">Por favor, selecione outra data.</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-playfair text-brown mb-2">Seus dados para confirmação</h3>
                        <p className="text-sm text-muted-foreground">Preencha suas informações para finalizar o agendamento</p>
                      </div>
                      <div className="space-y-4">
                        {isLoadingProfile && (
                          <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                            Carregando preferências anteriores...
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center">
                              <User className="mr-2 h-4 w-4" /> Nome Completo
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Seu nome completo"
                              value={name}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                              required
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" /> Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="seu@email.com"
                              value={email}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                              required
                              className="bg-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="mr-2 h-4 w-4" /> 
                            Telefone <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            placeholder="912345678" 
                            value={phone} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                            required 
                            className="bg-white"
                            maxLength={9}
                          />
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Formato: 9XXXXXXXX (número português)</p>
                            <p className="text-amber-600 font-medium">
                              ⚠️ Este número será usado para enviar o pedido de pagamento via MB WAY
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sessionType">Tipo de Sessão</Label>
                          <select id="sessionType" name="sessionType" value={sessionType} onChange={(e) => setSessionType(e.target.value as 'Online' | 'Presencial')} className="w-full p-2 border rounded-md bg-white">
                            <option value="Online">Online</option>
                            <option value="Presencial">Presencial</option>
                          </select>
                          {Array.isArray(customerProfile?.preferred_session_types) && customerProfile.preferred_session_types.length > 0 && (
                            <p className="text-xs text-muted-foreground">Preferência detectada: {customerProfile.preferred_session_types[0]}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4" /> Mensagem (Opcional)
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Deixe uma nota ou questão..."
                            value={message}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-4 sm:px-6 bg-gray-50/50 border-t border-brown/10 flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="text-muted-foreground hover:text-brown hover:bg-brown/5 transition-all duration-200"
                  aria-label="Voltar para passo anterior"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    className="bg-brown hover:bg-brown/90 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Avançar para próximo passo"
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isNextDisabled() || isSubmitting || hasSubmitted}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Confirmar agendamento"
                  >
                    {(isSubmitting) ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A Processar...</>
                    ) : hasSubmitted ? (
                      <><Loader2 className="mr-2 h-4 w-4" /> Enviado...</>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Confirmar Agendamento
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </form>
        </motion.div>
      </div>

      {/* Accessibility: Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {selectedDate && `Data selecionada: ${format(selectedDate, 'dd/MM/yyyy')}`}
        {selectedTime && `Horário selecionado: ${selectedTime}`}
        {selectedService && `Serviço selecionado: ${selectedService.name}`}
      </div>
    </section>
  );
};

export default BookingTable;
