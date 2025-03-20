
import { useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
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
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Sessão de Diagnóstico Inicial', duration: '30 min', price: 'Gratuito', selected: false },
    { id: 2, name: 'Coaching Executivo', duration: '60 min', price: '€120', selected: false },
    { id: 3, name: 'Mentoria Pessoal', duration: '60 min', price: '€90', selected: false },
    { id: 4, name: 'Sessão de Carreira', duration: '60 min', price: '€100', selected: false },
    { id: 5, name: 'Pacote de 5 Sessões', duration: '5 x 60 min', price: '€400', selected: false },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(1);

  const handleServiceSelect = (id: number) => {
    setServices(services.map(service => ({
      ...service,
      selected: service.id === id
    })));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission
      console.log('Form submitted', {
        service: services.find(s => s.selected),
        date: selectedDate
      });
      
      // You could add a toast notification here
      alert('Pedido de reserva enviado! Entraremos em contacto em breve.');
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !services.some(service => service.selected);
    }
    if (currentStep === 2) {
      return !selectedDate;
    }
    return false;
  };

  return (
    <section id="booking-table" className="section-padding bg-offwhite">
      <div className="container mx-auto">
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

          <Card className="border-brown/10">
            <CardHeader className="border-b border-brown/10">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <CardTitle className="text-xl text-brown">Selecione os Detalhes</CardTitle>
                <div className="mt-2 sm:mt-0 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${currentStep >= 1 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Serviço</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${currentStep >= 2 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Data</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${currentStep >= 3 ? 'bg-brown text-white' : 'bg-gray-200'}`}>Confirmação</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Serviço</TableHead>
                    <TableHead className="w-[20%]">Data</TableHead>
                    <TableHead className="w-[20%]">Detalhes</TableHead>
                    <TableHead className="w-[20%] text-right">Confirmação</TableHead>
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
                                    onSelect={setSelectedDate}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            {selectedDate && (
                              <div className="w-full md:w-1/2 p-4 border rounded-lg bg-brown/5">
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
                      </TableCell>
                    </TableRow>
                  )}

                  {currentStep === 3 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-playfair">Confirme a sua Reserva</h3>
                          <div className="bg-brown/5 p-4 rounded-lg space-y-3">
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
                </TableBody>
              </Table>

              <div className="p-6 flex justify-between">
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
                  className="bg-brown hover:bg-brown/90 text-white"
                >
                  {currentStep === 3 ? 'Agendar Sessão' : 'Continuar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingTable;
