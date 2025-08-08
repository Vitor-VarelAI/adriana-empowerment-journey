import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
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

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="mb-4">
              <AccordionItem value={`item-${index}`} className="border border-brown/10 rounded-lg overflow-hidden">
                <AccordionTrigger className="w-full text-left bg-offwhite hover:bg-brown/5 px-4">
                  <h3 className="font-medium text-lg">{item.question}</h3>
                </AccordionTrigger>
                <AccordionContent className="bg-white border-t border-brown/10 px-4">
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
