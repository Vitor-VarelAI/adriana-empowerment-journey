import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Obrigado = () => {
  return (
    <section className="flex items-center justify-center h-screen bg-offwhite">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-brown/10"
      >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-playfair text-brown mb-4">Agendamento Confirmado!</h1>
        <p className="text-muted-foreground mb-2">
          Receberá um email com os detalhes do seu agendamento e as instruções de pagamento nas próximas 24 horas.
        </p>
        <p className="text-muted-foreground mb-8">
          Obrigado por confiar na Adriana.
        </p>
        <Button asChild>
          <Link to="/">Voltar à Página Inicial</Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default Obrigado;
