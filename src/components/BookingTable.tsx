import { useState, ChangeEvent } from 'react';
import { Clock, User, Mail, Phone as PhoneIcon, Loader2 } from 'lucide-react'; // Added Loader2
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner'; // Added toast
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
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
  const [phone, setPhone] = useState('');
  const [mbwayPhoneNumber, setMbwayPhoneNumber] = useState('');
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // To keep button disabled after success

  // Mock function to get available times based on date
  const getMockedAvailableTimes = (date: Date): string[] => {
    const day = date.getDay(); // Sunday = 0, Saturday = 6
    const dayOfMonth = date.getDate();

    if (day === 0 || day === 6) { // Weekend
      return ["10:00", "11:00"]; // Fewer slots on weekends
    }
    if (dayOfMonth === 25) { // Special day (e.g., 25th of the month)
      return ["09:30", "10:30", "14:30", "15:30"];
    }
    // Default slots for weekdays
    return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
  };

  const resetForm = () => {
    setServices(services.map(s => ({ ...s, selected: false })));
    setSelectedDate(undefined);
    setAvailableTimes([]);
    setName('');
    setEmail('');
    setPhone('');
    setMbwayPhoneNumber('');
    setIsInitiatingPayment(false);
    setIsPaymentSuccessful(false); 
    setCurrentStep(1);
  };

  const handleSimulatePaymentApproved = () => {
    toast.success('Pagamento confirmado!', { 
      description: 'A sua reserva está completa e foi registada.' 
    });
    resetForm(); // This will set isPaymentSuccessful to false and currentStep to 1
  };

  const handleSimulatePaymentRejected = () => {
    toast.error('Pagamento Rejeitado', { 
      description: 'O pagamento não foi aprovado. Pode tentar novamente.' 
    });
    setIsPaymentSuccessful(false); // Re-enable MB Way input and "Pagar" button
    // currentStep remains 4, mbwayPhoneNumber remains as entered
  };

  // Mock async function for Ifthenpay payment initiation
  const initiateIfthenpayPayment = async (payload: {
    amount: string;
    orderId: string;
    phoneNumber: string;
  }): Promise<{ IdPedido: string; Status: string; Msg: string } | { Error: string; Msg: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate success or error based on phone number (e.g., if ends with '0')
        if (payload.phoneNumber.endsWith('0')) {
          resolve({ Error: 'true', Msg: 'Simulated error: Invalid phone number or daily limit exceeded' });
        } else {
          resolve({ IdPedido: payload.orderId, Status: '0', Msg: 'Success' });
        }
      }, 2000);
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newSelectedDate = new Date(date); // Create a new Date object to avoid issues with direct state mutation
      // Reset time to midnight to ensure consistent date comparison and time slot application
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
      setSelectedDate(newDateWithTime); // Update selectedDate with time
    }
  };

  const handleServiceSelect = (id: number) => {
    setServices(services.map(service => ({
      ...service,
      selected: service.id === id
    })));
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) { // User details confirmed, moving to payment
      setCurrentStep(4);
    } else if (currentStep === 4) { // MB Way Payment Step
      setIsInitiatingPayment(true);
      const selectedService = services.find(s => s.selected);
      const amount = selectedService?.price.replace('€', '') || '0'; // Extract amount
      const orderId = `ORDER-${Date.now()}`; // Generate a unique order ID

      try {
        const result = await initiateIfthenpayPayment({
          amount,
          orderId,
          phoneNumber: mbwayPhoneNumber,
        });

        if ('IdPedido' in result && result.Status === '0') {
          // Successful initiation
          toast.info('Pedido de pagamento enviado!', {
            description: 'Aprove na sua app MB WAY para concluir a reserva.',
          });
          setIsPaymentSuccessful(true); // Keep button and input disabled
          // Do NOT resetForm() here. Wait for simulated callback.
        } else {
          // Error from Ifthenpay
          toast.error('Falha ao iniciar pagamento MB WAY', {
            description: (result as { Error: string; Msg: string }).Msg || 'Erro desconhecido.',
          });
          setIsPaymentSuccessful(false); // Allow retry
        }
      } catch (error) {
        // Network or other unexpected error
        console.error("Error initiating MB Way payment:", error);
        toast.error('Falha ao iniciar pagamento MB WAY', {
          description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
        setIsPaymentSuccessful(false); // Allow retry
      } finally {
        setIsInitiatingPayment(false);
      }
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !services.some(service => service.selected);
    }
    if (currentStep === 2) {
      // Ensure a time is also selected if date is present and times are available
      if (!selectedDate) return true;
      if (availableTimes.length > 0 && selectedDate.getHours() === 0 && selectedDate.getMinutes() === 0) {
        // Check if time part of selectedDate is still default (00:00), meaning time not picked
        const defaultDate = new Date(selectedDate);
        defaultDate.setHours(0,0,0,0);
        if (selectedDate.getTime() === defaultDate.getTime()) return true;
      }
      // Ensure a time is also selected if date is present and times are available
      // This part was a bit complex, simplifying: if date is selected, and times are available, a time must be picked.
      // A simpler check: if selectedDate has time 00:00:00 and availableTimes.length > 0, then disable.
      if (selectedDate && selectedDate.getHours() === 0 && selectedDate.getMinutes() === 0 && availableTimes.length > 0) {
        return true;
      }
      return false; 
    }
    if (currentStep === 3) {
      return !name || !email; // Name and Email are required for user details
    }
    if (currentStep === 4) {
      if (isInitiatingPayment || isPaymentSuccessful) return true; // Disable if loading or already successful
      return !mbwayPhoneNumber || !/^9\d{8}$/.test(mbwayPhoneNumber);
    }
    return false;
  };

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

          <Card className="border-brown/10 overflow-hidden">
            <CardHeader className="border-b border-brown/10 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <CardTitle className="text-xl text-brown">Selecione os Detalhes</CardTitle>
                <div className="mt-2 sm:mt-0 flex space-x-1 sm:space-x-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${currentStep >= 1 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Serviço</span>
                  <span className={`px-2 py-1 rounded-full ${currentStep >= 2 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Data</span>
                  <span className={`px-2 py-1 rounded-full ${currentStep >= 3 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Detalhes</span>
                  <span className={`px-2 py-1 rounded-full ${currentStep >= 4 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Pagamento</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {!isMobile ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[25%]">Serviço</TableHead>
                      <TableHead className="w-[25%]">Data</TableHead>
                      <TableHead className="w-[25%]">Detalhes</TableHead>
                      <TableHead className="w-[25%] text-right">Pagamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStep === 1 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-6">
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
                        <TableCell colSpan={4} className="py-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-playfair">Selecione a Data</h3>
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
                                      onSelect={handleDateSelect} // Use new handler
                                      initialFocus
                                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                                      className="p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              
                              {selectedDate && (
                                <div className="w-full md:w-1/2 p-4 border rounded-lg bg-brown/5">
                                  <h4 className="font-medium mb-2">Horários Disponíveis para {format(selectedDate, 'PPP')}</h4>
                                  {availableTimes.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                      {availableTimes.map((time) => (
                                        <Button
                                          key={time}
                                          variant={
                                            selectedDate && selectedDate.getHours() === parseInt(time.split(":")[0]) && selectedDate.getMinutes() === parseInt(time.split(":")[1])
                                            ? "sessionButton" // Highlight selected time
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
                                    <p className="text-sm text-muted-foreground">Nenhum horário disponível para esta data.</p>
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
                        <TableCell colSpan={4} className="py-6">
                          <div className="space-y-6"> {/* Increased space-y for better separation */}
                            <h3 className="text-lg font-playfair">Confirme a sua Reserva</h3>
                            
                            {/* User Details Input Fields */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" /> Nome Completo
                                  </Label>
                                  <Input 
                                    id="name" 
                                    type="text" 
                                    placeholder="Seu nome completo" 
                                    value={name} 
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                                    className="bg-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email" className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4" /> Email
                                  </Label>
                                  <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="seu@email.com" 
                                    value={email} 
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                                    className="bg-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center">
                                  <PhoneIcon className="mr-2 h-4 w-4" /> Telefone (Opcional)
                                </Label>
                                <Input 
                                  id="phone" 
                                  type="tel" 
                                  placeholder="Seu número de telefone" 
                                  value={phone} 
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                                  className="bg-white"
                                />
                              </div>
                            </div>

                            {/* Booking Summary */}
                            <div className="bg-brown/5 p-4 rounded-lg space-y-3 border border-brown/10">
                              <h4 className="font-medium text-md mb-2 text-brown">Resumo da Reserva</h4>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Serviço:</span>
                                <span className="font-medium">{services.find(s => s.selected)?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duração:</span>
                                <span>{services.find(s => s.selected)?.duration}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Data:</span>
                                <span>{selectedDate ? format(selectedDate, 'PPP') : 'Não selecionada'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Horário:</span>
                                <span>{selectedDate ? format(selectedDate, 'HH:mm') : 'Não selecionado'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Preço:</span>
                                <span className="font-medium">{services.find(s => s.selected)?.price}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {currentStep === 4 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-6">
                          <div className="space-y-6">
                            <h3 className="text-lg font-playfair">Pagamento com MB WAY</h3>
                            <div className="max-w-sm mx-auto space-y-4 p-4 border border-brown/10 rounded-lg bg-white">
                              <div className="space-y-2">
                                <Label htmlFor="mbway-phone" className="flex items-center">
                                  <PhoneIcon className="mr-2 h-4 w-4 text-brown" /> Número de telemóvel associado ao MB WAY
                                </Label>
                                <Input
                                  id="mbway-phone"
                                  type="tel"
                                  placeholder="9XXXXXXXX"
                                  value={mbwayPhoneNumber}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMbwayPhoneNumber(e.target.value)}
                                  className="bg-white text-center text-lg"
                                  maxLength={9}
                                  disabled={isInitiatingPayment || isPaymentSuccessful}
                                />
                                {mbwayPhoneNumber && !/^9\d{8}$/.test(mbwayPhoneNumber) && (
                                   <p className="text-xs text-red-500">Número inválido. Deve começar por 9 e ter 9 dígitos.</p>
                                )}
                              </div>
                              <img src="/lovable-assets/mbway_logo.svg" alt="MB WAY Logo" className="h-10 mx-auto"/>
                            </div>
                            <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
                              Após clicar em "Pagar com MB WAY", receberá uma notificação na sua app MB WAY para aprovar o pagamento.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                // Mobile-specific view without the table
                <div className="px-4 py-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-playfair">Selecione o Serviço</h3>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div 
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id)}
                            className={`p-4 rounded-lg cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between transition-colors ${
                              service.selected ? 'bg-brown/10 border border-brown/30' : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
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
                      <h3 className="text-lg font-playfair">Selecione a Data</h3>
                      <div className="flex flex-col space-y-4">
                        <div className="w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                {selectedDate ? format(selectedDate, 'PPP') : <span>Escolha uma data</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="center">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                      onSelect={handleDateSelect} // Use new handler
                                initialFocus
                                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        {selectedDate && (
                          <div className="w-full p-4 border rounded-lg bg-brown/5">
                            <h4 className="font-medium mb-2">Horários Disponíveis</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                                <Button
                                  key={time}
                                  variant="outline"
                                  className="text-sm"
                                  onClick={() => setSelectedDate(
                                    selectedDate ? new Date(
                                      selectedDate.setHours(
                                        parseInt(time.split(":")[0]),
                                        parseInt(time.split(":")[1])
                                      )
                                    ) : undefined
                                  )}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6"> {/* Increased space-y */}
                      <h3 className="text-lg font-playfair">Confirme a sua Reserva</h3>

                      {/* User Details Input Fields - Mobile */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name-mobile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" /> Nome Completo
                          </Label>
                          <Input 
                            id="name-mobile" 
                            type="text" 
                            placeholder="Seu nome completo" 
                            value={name} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-mobile" className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </Label>
                          <Input 
                            id="email-mobile" 
                            type="email" 
                            placeholder="seu@email.com" 
                            value={email} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone-mobile" className="flex items-center">
                            <PhoneIcon className="mr-2 h-4 w-4" /> Telefone (Opcional)
                          </Label>
                          <Input 
                            id="phone-mobile" 
                            type="tel" 
                            placeholder="Seu número de telefone" 
                            value={phone} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                      </div>
                      
                      {/* Booking Summary - Mobile */}
                      <div className="bg-brown/5 p-4 rounded-lg space-y-3 border border-brown/10">
                        <h4 className="font-medium text-md mb-2 text-brown">Resumo da Reserva</h4>
                        <div className="flex flex-col sm:flex-row justify-between">
                          <span className="text-muted-foreground">Serviço:</span>
                          <span className="font-medium text-right">{services.find(s => s.selected)?.name}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                          <span className="text-muted-foreground">Duração:</span>
                          <span className="text-right">{services.find(s => s.selected)?.duration}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span className="text-right">{selectedDate ? format(selectedDate, 'PPP') : 'Não selecionada'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                          <span className="text-muted-foreground">Horário:</span>
                          <span className="text-right">{selectedDate ? format(selectedDate, 'HH:mm') : 'Não selecionado'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                          <span className="text-muted-foreground">Preço:</span>
                          <span className="font-medium text-right">{services.find(s => s.selected)?.price}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                     <div className="space-y-6">
                        <h3 className="text-lg font-playfair">Pagamento com MB WAY</h3>
                        <div className="space-y-4 p-4 border border-brown/10 rounded-lg bg-white">
                          <div className="space-y-2">
                            <Label htmlFor="mbway-phone-mobile" className="flex items-center">
                              <PhoneIcon className="mr-2 h-4 w-4 text-brown" /> Número de telemóvel MB WAY
                            </Label>
                            <Input
                              id="mbway-phone-mobile"
                              type="tel"
                              placeholder="9XXXXXXXX"
                              value={mbwayPhoneNumber}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setMbwayPhoneNumber(e.target.value)}
                              className="bg-white text-center text-lg"
                              maxLength={9}
                              disabled={isInitiatingPayment || isPaymentSuccessful}
                            />
                            {mbwayPhoneNumber && !/^9\d{8}$/.test(mbwayPhoneNumber) && (
                               <p className="text-xs text-red-500">Número inválido. Deve começar por 9 e ter 9 dígitos.</p>
                            )}
                          </div>
                          <img src="/lovable-assets/mbway_logo.svg" alt="MB WAY Logo" className="h-10 mx-auto"/>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Após clicar em "Pagar com MB WAY", receberá uma notificação na sua app MB WAY para aprovar o pagamento.
                        </p>
                      </div>
                  )}
                </div>
              )}

              <div className="p-4 sm:p-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className="bg-brown hover:bg-brown/90 text-white w-full sm:w-auto"
                >
                  {currentStep === 4 ? (
                    isInitiatingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Aguarde...
                      </>
                    ) : isPaymentSuccessful ? (
                       'Pagamento Iniciado' // This text will be briefly shown then replaced by sim buttons
                    ) : (
                      'Pagar com MB WAY'
                    )
                  ) : currentStep === 3 ? (
                    'Continuar para Pagamento'
                  ) : (
                    'Continuar'
                  )}
                </Button>
              </div>

              {/* Simulation Buttons for Step 4 after successful initiation */}
              {currentStep === 4 && isPaymentSuccessful && !isInitiatingPayment && (
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <p className="text-sm text-muted-foreground text-center sm:w-full mb-2 sm:mb-0 col-span-full">Simular resultado do pagamento:</p>
                  <Button
                    variant="default" // Primary style for success
                    onClick={handleSimulatePaymentApproved}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Simular Pagamento Aprovado
                  </Button>
                  <Button
                    variant="outline" // Outline or secondary for rejection
                    onClick={handleSimulatePaymentRejected}
                    className="w-full sm:w-auto"
                  >
                    Simular Pagamento Rejeitado
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingTable;
