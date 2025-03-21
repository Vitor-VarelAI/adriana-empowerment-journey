
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const faqItems: FAQItem[] = [
    {
      question: 'Qual é a duração de cada sessão de coaching?',
      answer: 'Nossas sessões de coaching individual têm geralmente a duração de 60 minutos. A sessão inicial de diagnóstico é gratuita e dura 30 minutos para identificarmos juntos os seus objetivos.'
    },
    {
      question: 'Como são realizadas as sessões?',
      answer: 'As sessões podem ser realizadas online via videoconferência (Zoom, Teams ou Google Meet) ou presencialmente, dependendo da sua preferência e disponibilidade.'
    },
    {
      question: 'Quantas sessões são necessárias para ver resultados?',
      answer: 'Cada pessoa é única, mas normalmente recomendamos um pacote inicial de 5 sessões para resultados significativos. A maioria dos clientes começa a notar mudanças positivas após 2-3 sessões.'
    },
    {
      question: 'Posso cancelar ou remarcar uma sessão?',
      answer: 'Sim, pedimos apenas que nos avise com pelo menos 24 horas de antecedência para que possamos reorganizar a agenda sem custos adicionais.'
    },
    {
      question: 'O coaching é confidencial?',
      answer: 'Absolutamente. Todas as sessões são estritamente confidenciais. O seu conforto e privacidade são fundamentais para o processo de coaching.'
    },
    {
      question: 'Qual a diferença entre coaching e terapia?',
      answer: 'O coaching é orientado para objetivos futuros e ações práticas, enquanto a terapia frequentemente trabalha questões passadas e emocionais profundas. O coaching não substitui a terapia para questões de saúde mental.'
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">PERGUNTAS FREQUENTES</span>
          <h2 className="section-title">Tudo o Que Precisa de Saber</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <Collapsible
                open={openItems[index]}
                onOpenChange={() => toggleItem(index)}
                className="border border-brown/10 rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="w-full p-4 text-left bg-offwhite hover:bg-brown/5 transition-colors duration-300 flex justify-between items-center">
                  <h3 className="font-medium text-lg">{item.question}</h3>
                  <ChevronDown 
                    size={18} 
                    className={`text-brown transition-transform duration-300 ${openItems[index] ? 'rotate-180' : ''}`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    {openItems[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-white border-t border-brown/10"
                      >
                        <p className="text-muted-foreground">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
