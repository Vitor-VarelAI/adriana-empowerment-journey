
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Trabalhar com a Adriana foi transformador. Ela ajudou-me a navegar numa transição de carreira difícil com empatia e orientação prática.",
      name: "Maria C.",
      details: "38, Executiva de Marketing"
    },
    {
      quote: "Já experimentei outros coaches antes, mas a abordagem da Adriana é diferente. Ela realmente ouve e fornece insights que mudaram a minha perspetiva.",
      name: "João P.",
      details: "45, Empresário"
    },
    {
      quote: "As ferramentas e estratégias que a Adriana partilhou melhoraram não só a minha vida profissional, mas também os meus relacionamentos e o meu bem-estar geral.",
      name: "Ana S.",
      details: "29, Professora"
    }
  ];

  return (
    <SectionWrapper id="testimonials" background="white">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">O QUE DIZEM OS CLIENTES</span>
          <h2 className="section-title">Histórias Reais, Impacto Real</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-offwhite rounded-xl p-6 shadow-soft"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 text-brown">
                <Quote size={32} />
              </div>
              <blockquote className="text-darkgray mb-6 italic leading-relaxed border-0 pl-0">"{testimonial.quote}"</blockquote>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Testimonials;
