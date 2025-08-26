import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Mail, MessageSquare, Loader2, Phone, Package } from 'lucide-react';
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
import { motion } from 'framer-motion';

type Service = {
  id: number;
  name: string;
  duration: string;
  price: string;
  selected: boolean;
};

const BookingTable = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
const handleSessionBooking = () => {
  // Select the first service in the list
  handleServiceSelect(1);
  
  // Navigate to the booking form
  setCurrentStep(1);
};
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_ID);
  const { selectedPackage, clearSelectedPackage } = useBooking();

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Sessão Única', duration: '1 sessão', price: '70€', selected: false },
    { id: 2, name: 'Pacote de 4 Sessões', duration: '4 sessões', price: '280€', selected: false },
    { id: 3, name: 'Pacote de 10 Sessões', duration: '10 sessões', price: '700€', selected: false },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sessionType, setSessionType] = useState<'Online' | 'Presencial'>('Online');
  const [message, setMessage] = useState('');

  const [bookedTimes, setBookedTimes] = useState<{ [key: string]: string[] }>(() => {
    try {
      const savedBookings = typeof window !== 'undefined' ? localStorage.getItem('bookedTimes') : null;
      return savedBookings ? JSON.parse(savedBookings) : {};
    } catch (error) {
      console.error("Failed to parse bookedTimes from localStorage", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookedTimes', JSON.stringify(bookedTimes));
      }
    } catch (error) {
      console.error("Failed to save bookedTimes to localStorage", error);
    }
  }, [bookedTimes]);

  const getMockedAvailableTimes = (date: Date): string[] => {
    const day = date.getDay();
    const allTimes = (day === 0 || day === 6)
      ? ["10:00", "11:00"]
      : ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    const dateString = format(date, 'yyyy-MM-dd');
    const bookedForDate = bookedTimes[dateString] || [];

    return allTimes.filter(time => !bookedForDate.includes(time));
  };

  const resetForm = () => {
    setServices(services.map(s => ({ ...s, selected: false })));
    setSelectedDate(undefined);
    setAvailableTimes([]);
    setName('');
    setEmail('');
    setMessage('');
    setCurrentStep(1);
  };

  useEffect(() => {
    if (state.succeeded) {
      resetForm();
      navigate('/obrigado');
    }
    if (state.errors) {
        toast.error('Ocorreu um erro ao enviar o seu pedido.', {
            description: 'Por favor, tente novamente.',
        });
    }
  }, [state.succeeded, state.errors, navigate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newSelectedDate = new Date(date);
      newSelectedDate.setHours(0, 0, 0, 0);
      setSelectedDate(newSelectedDate);
      setAvailableTimes(getMockedAvailableTimes(newSelectedDate));
      
      toast.success(`Data selecionada: ${format(newSelectedDate, 'dd/MM/yyyy')}`, {
        description: 'Agora selecione um horário disponível',
        duration: 3000,
        icon: '📅'
      });
    } else {
      setSelectedDate(undefined);
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDateWithTime = new Date(selectedDate);
      newDateWithTime.setHours(hours, minutes);
      setSelectedDate(newDateWithTime);
      
      toast.success(`Horário confirmado: ${time}`, {
        description: 'A avançar para os detalhes finais...',
        duration: 2000,
        icon: '⏰'
      });
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
    }
  };

  const handleServiceSelect = (id: number) => {
    setServices(services.map(service => ({
      ...service,
      selected: service.id === id
    })));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !services.some(service => service.selected);
    }
    if (currentStep === 2) {
      if (!selectedDate) return true;
      if (availableTimes.length > 0 && selectedDate.getHours() === 0 && selectedDate.getMinutes() === 0) {
        return true;
      }
      return false;
    }
    if (currentStep === 3) {
      const isPhoneValid = /^9[1236]\d{7}$/.test(phone);
      return !name || !email || !isPhoneValid || state.submitting;
    }
    return false;
  };

  const selectedService = services.find(s => s.selected);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (currentStep !== 3 || !selectedDate) {
      event.preventDefault();
      return;
    }

    const selectedTime = format(selectedDate, 'HH:mm');
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    setBookedTimes(prev => {
      const updatedBookings = { ...prev };
      if (!updatedBookings[dateString]) {
        updatedBookings[dateString] = [];
      }
      updatedBookings[dateString].push(selectedTime);
      return updatedBookings;
    });

    console.log('Form submission started');
    try {
      handleSubmit(event);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocorreu um erro ao enviar o seu pedido.', {
        description: 'Por favor, tente novamente ou contacte-nos para assistência.',
      });
    }
    console.log('Form submission completed');
  }

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
            {/* Hidden inputs for Formspree */}
            <input type="hidden" name="service" value={selectedService?.name || 'N/A'} />
            <input type="hidden" name="date" value={selectedDate ? format(selectedDate, 'PPP HH:mm') : 'N/A'} />
            <input type="hidden" name="session_type" value={sessionType} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="_subject" value={`Novo Agendamento: ${selectedService?.name || ''} para ${name}`}/>
            <textarea
              name="_append"
              className="hidden"
              defaultValue="Nota final: ⚠️ Envie o IBAN ou instruções de pagamento diretamente para o cliente."
            />

            <Card className="border-brown/10 overflow-hidden">
              <CardHeader className="border-b border-brown/10 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <CardTitle className="text-xl text-brown">Selecione os Detalhes</CardTitle>
                  <div className="mt-2 sm:mt-0 flex space-x-1 sm:space-x-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${currentStep >= 1 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Serviço</span>
                    <span className={`px-2 py-1 rounded-full ${currentStep >= 2 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Data</span>
                    <span className={`px-2 py-1 rounded-full ${currentStep >= 3 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Detalhes</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-playfair">Selecione o Serviço</h3>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id)}
                            className={`p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                              service.selected ? 'bg-brown/10 border border-brown/30' : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Clock size={16} className="text-brown" />
                              <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-sm text-muted-foreground">{service.duration}</p>
                              </div>
                            </div>
                            <span className="font-medium">{service.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-playfair">Selecione a Data e Hora</h3>
                      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-full md:w-auto">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
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
                            <h4 className="font-medium mb-2 text-brown">Horários para {format(selectedDate, 'PPP')}</h4>
                            {availableTimes.length > 0 ? (
                              <div className="grid grid-cols-3 gap-2">
                                {availableTimes.map((time) => {
                                  const isSelected = selectedDate && selectedDate.getHours() === parseInt(time.split(":")[0]) && selectedDate.getMinutes() === parseInt(time.split(":")[1]);
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
                                      >
                                        {isSelected && '✓ '} {time}
                                      </Button>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum horário disponível.</p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-playfair">Confirme os Seus Detalhes</h3>
                      <div className="space-y-4">
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
                            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs" />
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
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                >
                  Anterior
                </Button>

                {currentStep < 3 ? (
                  <Button onClick={handleNext} disabled={isNextDisabled()}>
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" disabled={isNextDisabled()}>
                    {state.submitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> A Enviar...</>
                    ) : (
                      'Confirmar Agendamento'
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingTable;
