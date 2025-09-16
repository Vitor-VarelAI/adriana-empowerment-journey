
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const About = () => {
  const credentials = [
    'Professional Self Coach',
    'Leader Coach',
    'Analista comportamental',
    'Certificação internacional',
    'IBC COACHING',
  ];

  return (
    <SectionWrapper id="about" background="offwhite" className="overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Column */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <img 
                src="/lovable-uploads/46de618f-0c18-436a-a9ab-c7744784a9b7.png" 
                alt="Adriana - Professional Coach" 
                className="rounded-xl shadow-medium w-full h-auto image-fade loaded"
              />
            </div>
          </motion.div>
          
          {/* Text Column */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-subtitle">CONHEÇA A SUA COACH</span>
            <h2 className="section-title">Uma Parceira de Confiança para o Seu Bem-estar Emocional</h2>
            <p className="text-muted-foreground mb-8">
              Com mais de 5 anos de experiência a ajudar pessoas a encontrar clareza e propósito, 
              trago uma combinação única de conhecimentos profissionais e afecto pessoal para cada 
              relação de coaching. A minha abordagem centra-se na criação de um espaço seguro e confidencial 
              onde pode explorar desafios, descobrir pontos fortes e desenvolver 
              estratégias práticas para uma mudança positiva.
            </p>
            
            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {credentials.map((credential, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <span className="text-brown">
                    <Check size={18} />
                  </span>
                  <span>{credential}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
