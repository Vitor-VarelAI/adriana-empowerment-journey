
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Briefcase,
  Heart,
  Video,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionWrapper from './SectionWrapper';

import { useCMS } from '@/contexts/CMSContext';

const Services = () => {
  const { getContent } = useCMS();

  const services = [
    {
      icon: <Users className="w-10 h-10 text-brown" />,
      title: getContent('service.1.title', 'Desenvolvimento Pessoal'),
      description: getContent('service.1.desc', 'Descubra o seu verdadeiro potencial e construa a autoconfiança necessária para criar mudanças significativas na sua vida.'),
      cta: 'Descobrir mais'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-brown" />,
      title: getContent('service.2.title', 'Coaching de Liderança'),
      description: getContent('service.2.desc', 'Desenvolva as suas capacidades de liderança e aprenda a inspirar e motivar os outros para alcançar objetivos comuns.'),
      cta: 'Melhorar liderança'
    },
    {
      icon: <Briefcase className="w-10 h-10 text-brown" />,
      title: getContent('service.3.title', 'Transição de Carreira'),
      description: getContent('service.3.desc', 'Navegue pelas mudanças de carreira com confiança e clareza, alinhando o seu percurso profissional com os seus valores.'),
      cta: 'Mudar carreira'
    },
    {
      icon: <Heart className="w-10 h-10 text-brown" />,
      title: getContent('service.4.title', 'Equilíbrio Trabalho-Vida'),
      description: getContent('service.4.desc', 'Crie harmonia entre as suas ambições profissionais e o bem-estar pessoal para uma vida mais gratificante.'),
      cta: 'Encontrar equilíbrio'
    }
  ];

  return (
    <SectionWrapper id="services" background="white">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">OS MEUS SERVIÇOS</span>
          <h2 className="section-title">Como Posso Ajudá-lo a Prosperar</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Serviços personalizados que se adaptam às suas necessidades específicas e objetivos pessoais e profissionais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 leading-snug">{service.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{service.description}</p>
                <button className="flex items-center text-brown hover:text-brown-600 transition-colors"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="mr-2 font-medium">{service.cta}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-offwhite p-6 rounded-xl max-w-2xl mx-auto">
            <p className="text-lg text-darkgray mb-4">
              Pronto para dar o próximo passo na sua jornada de desenvolvimento?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="sessionButton"
                  size="lg"
                  onClick={() => document.getElementById('booking-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <Video className="mr-2" size={20} />
                  Agendar uma Sessão
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/mentoria-outubro-2025'}
                  className="border-brown text-brown hover:bg-brown hover:text-white"
                >
                  Mentoria 6 Meses
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Services;
