
import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    {
      number: '1',
      title: 'Initial Contact',
      description: 'Reach out through a simple booking form to schedule your first session and share your goals.'
    },
    {
      number: '2',
      title: 'Personalized Plan',
      description: 'Together we'll create a tailored approach to address your unique challenges and aspirations.'
    },
    {
      number: '3',
      title: 'Coaching Sessions',
      description: 'Regular one-on-one sessions provide guidance, accountability, and support on your journey.'
    }
  ];

  return (
    <section id="process" className="section-padding bg-offwhite">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">HOW IT WORKS</span>
          <h2 className="section-title">Simple, Convenient, Effective</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <motion.div 
                className="w-16 h-16 flex items-center justify-center rounded-full bg-brown-100 text-brown font-bold text-2xl mb-6"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + 0.1 * index,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {step.number}
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
