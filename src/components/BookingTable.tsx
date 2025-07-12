import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  const [state, handleSubmit] = useForm("xrbknnjr");

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Sessão de Diagnóstico Inicial', duration: '30 min', price: 'Gratuito', selected: false },
    { id: 2, name: 'Coaching Executivo', duration: '60 min', price: '€120', selected: false },
    { id: 3, name: 'Mentoria Pessoal', duration: '60 min', price: '€90', selected: false },
    { id: 4, name: 'Sessão de Carreira', duration: '60 min', price: '€100', selected: false },
    { id: 5, name: 'Pacote de 5 Sessões', duration: '5 x 60 min', price: '€400', selected: false },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Mock function to get available times based on date
  const getMockedAvailableTimes = (date: Date): string[] => {
    const day = date.getDay(); // Sunday = 0, Saturday = 6
    if (day === 0 || day === 6) return ["10:00", "11:00"];
    return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
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
    // Submission is handled by the form's onSubmit
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
      return !name || !email || state.submitting;
    }
    return false;
  };

  const selectedService = services.find(s => s.selected);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevenção extra para garantir que o submit só acontece no último passo
    if (currentStep !== 3) {
      event.preventDefault();
      console.warn('Tentativa de submissão prematura bloqueada.');
      return;
    }
    handleSubmit(event);
  }

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

          <form onSubmit={handleFormSubmit}>
            {/* Hidden inputs for Formspree */}
            <input type="hidden" name="service" value={selectedService?.name || 'N/A'} />
            <input type="hidden" name="date" value={selectedDate ? format(selectedDate, 'PPP HH:mm') : 'N/A'} />
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
                {!isMobile ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Serviço</TableHead>
                        <TableHead className="w-1/3">Data</TableHead>
                        <TableHead className="w-1/3">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentStep === 1 && (
                        <TableRow>
                          <TableCell colSpan={3} className="py-6">
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
                          </TableCell>
                        </TableRow>
                      )}

                      {currentStep === 2 && (
                        <TableRow>
                          <TableCell colSpan={3} className="py-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-playfair">Selecione a Data e Hora</h3>
                              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                                <div className="w-full md:w-1/2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left"
                                      >
                                        {selectedDate ? format(selectedDate, 'PPP') : <span>Escolha uma data</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                        className="p-3 pointer-events-auto"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                {selectedDate && (
                                  <div className="w-full md:w-1/2 p-4 border rounded-lg bg-brown/5">
                                    <h4 className="font-medium mb-2">Horários para {format(selectedDate, 'PPP')}</h4>
                                    {availableTimes.length > 0 ? (
                                      <div className="grid grid-cols-3 gap-2">
                                        {availableTimes.map((time) => (
                                          <Button
                                            key={time}
                                            variant={
                                              selectedDate && selectedDate.getHours() === parseInt(time.split(":")[0]) && selectedDate.getMinutes() === parseInt(time.split(":")[1])
                                                ? "sessionButton"
                                                : "outline"
                                            }
                                            className="text-sm"
                                            onClick={() => handleTimeSelect(time)}
                                          >
                                            {time}
                                          </Button>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">Nenhum horário disponível.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}

                      {currentStep === 3 && (
                        <TableRow>
                          <TableCell colSpan={3} className="py-6">
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
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  /* Mobile View: Simplified to a single column layout */
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              {selectedDate ? format(selectedDate, 'PPP') : <span>Escolha uma data</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              initialFocus
                              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>

                        {selectedDate && (
                          <div className="p-4 border rounded-lg bg-brown/5">
                            <h4 className="font-medium mb-2">Horários para {format(selectedDate, 'PPP')}</h4>
                            {availableTimes.length > 0 ? (
                              <div className="grid grid-cols-3 gap-2">
                                {availableTimes.map((time) => (
                                  <Button
                                    key={time}
                                    variant={
                                      selectedDate && selectedDate.getHours() === parseInt(time.split(":")[0]) && selectedDate.getMinutes() === parseInt(time.split(":")[1])
                                        ? "sessionButton"
                                        : "outline"
                                    }
                                    className="text-sm"
                                    onClick={() => handleTimeSelect(time)}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum horário disponível.</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-playfair">Confirme os Seus Detalhes</h3>
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="name-mobile" className="flex items-center">
                                <User className="mr-2 h-4 w-4" /> Nome Completo
                              </Label>
                              <Input
                                id="name-mobile"
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
                              <Label htmlFor="email-mobile" className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" /> Email
                              </Label>
                              <Input
                                id="email-mobile"
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
                            <div className="space-y-2">
                              <Label htmlFor="message-mobile" className="flex items-center">
                                <MessageSquare className="mr-2 h-4 w-4" /> Mensagem (Opcional)
                              </Label>
                              <Textarea
                                id="message-mobile"
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
                )}
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
