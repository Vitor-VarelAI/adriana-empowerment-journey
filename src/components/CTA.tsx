
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section id="book" className="section-padding" style={{ backgroundColor: 'rgba(135, 92, 81, 0.05)' }}>
      <div className="container mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-title">Take the First Step Toward the Life You Deserve</h2>
          <p className="text-muted-foreground mb-6">
            Begin your journey to a more balanced, fulfilling life with professional guidance and support.
          </p>
          <div className="mb-8 p-6 bg-white/50 rounded-lg border border-brown/10">
            <p className="text-brown italic font-playfair text-lg">
              "Sonhos não têm data de validade nem idade. Qual o teu plano de ação para os transformares em realidade?"
            </p>
          </div>
          <motion.a 
            href="#book" 
            className="button-primary inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Book A Session
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
