import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const faqItems: FAQItem[] = [
    {
      question: 'O que é o Coaching?',
      answer: `O Coaching é um processo estruturado de desenvolvimento pessoal e profissional, que ajuda uma pessoa a sair do ponto onde está (estado atual) e chegar ao ponto onde deseja estar (estado desejado).

Ele funciona por meio de conversas estratégicas entre o coach (profissional) e o coachee (cliente), utilizando ferramentas, perguntas poderosas e técnicas que estimulam:
•	Clareza de objetivos → definir o que realmente quer alcançar.
•	Autoconhecimento → entender pontos fortes, limitações e padrões de comportamento.
•	Plano de ação → traçar passos práticos para conquistar resultados.
•	Responsabilidade → manter disciplina, foco e consistência.
•	Performance → desbloquear potenciais e acelerar conquistas.`
    },
    {
      question: 'Quais são os preços e pacotes disponíveis?',
      answer: 'Oferecemos várias opções para se adaptar às suas necessidades: uma Sessão Única por 70€, um Pacote de 4 Sessões por 280€, e um Pacote de 10 Sessões por 700€.'
    },
    {
      question: 'Como são realizadas as sessões?',
      answer: 'As sessões podem ser realizadas online através de videoconferência (Zoom, Teams ou Google Meet) ou presencialmente, conforme a sua preferência e disponibilidade.'
    },
    {
      question: 'Como funciona o pagamento?',
      answer: 'O pagamento pode ser efetuado por MB WAY ou transferência bancária. Para pacotes, o pagamento é feito integralmente no início do processo para garantir o seu compromisso e agendamento.'
    },
    {
      question: 'Posso cancelar ou remarcar uma sessão?',
      answer: 'Sim, é possível cancelar ou remarcar uma sessão. Pedimos apenas que o faça com um aviso prévio de, no mínimo, 24 horas para evitar custos adicionais e permitir a reorganização da agenda.'
    },
    {
      question: 'O coaching é confidencial?',
      answer: 'Sim, a confidencialidade é total. Todas as informações partilhadas durante as sessões são estritamente confidenciais, garantindo um ambiente seguro e de confiança.'
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
