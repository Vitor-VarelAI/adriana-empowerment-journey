
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  Heart,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      icon: <Users className="w-10 h-10 text-brown" />,
      title: 'Desenvolvimento Pessoal',
      description: 'Descubra o seu verdadeiro potencial e construa a autoconfiança necessária para criar mudanças significativas na sua vida.'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-brown" />,
      title: 'Coaching de Liderança',
      description: 'Desenvolva as suas capacidades de liderança e aprenda a inspirar e motivar os outros para alcançar objetivos comuns.'
    },
    {
      icon: <Briefcase className="w-10 h-10 text-brown" />,
      title: 'Transição de Carreira',
      description: 'Navegue pelas mudanças de carreira com confiança e clareza, alinhando o seu percurso profissional com os seus valores.'
    },
    {
      icon: <Heart className="w-10 h-10 text-brown" />,
      title: 'Equilíbrio Trabalho-Vida',
      description: 'Crie harmonia entre as suas ambições profissionais e o bem-estar pessoal para uma vida mais gratificante.'
    }
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">OS MEUS SERVIÇOS</span>
          <h2 className="section-title">Como Posso Ajudá-lo a Prosperar</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="sessionButton"
              size="lg"
              onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Video className="mr-2" size={20} />
              Agendar uma Sessão
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
