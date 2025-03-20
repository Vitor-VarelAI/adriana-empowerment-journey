
import { motion } from 'framer-motion';

const Features = () => {
  const stats = [
    { number: '300+', description: 'Sessões Concluídas' },
    { number: '95%', description: 'Satisfação do Cliente' },
    { number: '5+', description: 'Anos de Experiência' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        {/* Quote */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xl md:text-2xl text-darkgray font-playfair leading-relaxed">
            Abrace o <span className="text-brown">apoio psicológico</span> para orientar a sua vida na direção certa, trazendo <span className="text-brown">paz de espírito</span> e <span className="text-brown">estabilidade emocional</span>.
          </p>
        </motion.div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stats-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <motion.div 
                className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-brown mb-2"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + 0.1 * index }}
              >
                {stat.number}
              </motion.div>
              <div className="text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
