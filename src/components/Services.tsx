
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  Heart 
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Users className="w-10 h-10 text-brown" />,
      title: 'Personal Development',
      description: 'Discover your true potential and build the self-confidence to create meaningful change in your life.'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-brown" />,
      title: 'Leadership Coaching',
      description: 'Develop your leadership abilities and learn to inspire and motivate others to achieve common goals.'
    },
    {
      icon: <Briefcase className="w-10 h-10 text-brown" />,
      title: 'Career Transition',
      description: 'Navigate career changes with confidence and clarity, aligning your professional path with your values.'
    },
    {
      icon: <Heart className="w-10 h-10 text-brown" />,
      title: 'Work-Life Balance',
      description: 'Create harmony between your professional ambitions and personal well-being for a more fulfilling life.'
    }
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">MY SERVICES</span>
          <h2 className="section-title">How I Can Help You Thrive</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <motion.a 
            href="#book" 
            className="button-primary inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Book A Session
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Services;
