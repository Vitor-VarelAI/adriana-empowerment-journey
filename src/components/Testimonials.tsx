
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Working with Adriana has been transformative. She helped me navigate a difficult career transition with empathy and practical guidance.",
      name: "Maria C.",
      details: "38, Marketing Executive"
    },
    {
      quote: "I've tried other coaches before, but Adriana's approach is different. She truly listens and provides insights that have changed my perspective.",
      name: "João P.",
      details: "45, Entrepreneur"
    },
    {
      quote: "The tools and strategies Adriana shared have improved not just my work life, but my relationships and overall wellbeing too.",
      name: "Ana S.",
      details: "29, Teacher"
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">WHAT CLIENTS SAY</span>
          <h2 className="section-title">Real Stories, Real Impact</h2>
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
              <p className="text-darkgray mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
