import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Obrigado = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4"
    >
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Agendamento recebido com sucesso!</h1>
      <p className="text-gray-600 max-w-md">
        Receberá uma mensagem nas próximas 24 horas com instruções de pagamento e confirmação da sessão.
      </p>
      <p className="text-gray-600 max-w-md mt-2">
        Se escolheu sessão presencial, poderá ser necessário alinhar o local e horário com a Adriana.
      </p>
      <Link to="/" className="mt-6">
        <Button>Voltar à página inicial</Button>
      </Link>
    </motion.div>
  );
};

export default Obrigado;
