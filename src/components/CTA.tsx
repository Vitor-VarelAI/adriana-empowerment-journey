
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import BookingTable from './BookingTable';
import SimpleBookingForm from './SimpleBookingForm';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section id="book" className="section-padding" style={{ backgroundColor: 'rgba(135, 92, 81, 0.05)' }}>
      <div className="container mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-title">Dê o Primeiro Passo para a Vida que Merece</h2>
          <p className="text-muted-foreground mb-6">
            Comece a sua jornada para uma vida mais equilibrada e gratificante com orientação e apoio profissional.
          </p>
          <div className="mb-8 p-6 bg-white/50 rounded-lg border border-brown/10">
            <p className="text-brown italic font-playfair text-lg">
              "Sonhos não têm data de validade nem idade. Qual o teu plano de ação para os transformares em realidade?"
            </p>
          </div>
          <Button 
            variant="sessionButton" 
            size="lg" 
            className="mx-auto"
            onClick={() => document.getElementById('booking-table')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Video className="mr-2" size={20} />
            Agendar uma Sessão
          </Button>
        </motion.div>
        
        <BookingTable />

        <div className="mt-12">
          <SimpleBookingForm />
        </div>
      </div>
    </section>
  );
};

export default CTA;
