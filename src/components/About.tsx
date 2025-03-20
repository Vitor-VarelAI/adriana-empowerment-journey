
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const About = () => {
  const credentials = [
    'Professional Self Coach',
    'Leader Coach',
    'Analista comportamental',
    'Certificação internacional',
    'IBC COACHING',
  ];

  return (
    <section id="about" className="section-padding bg-offwhite overflow-hidden">
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
                src="/lovable-uploads/6868c7c7-899b-48af-86d9-4729accdc0d7.png" 
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
            <span className="section-subtitle">MEET YOUR COACH</span>
            <h2 className="section-title">A Trusted Partner for Your Emotional Wellbeing</h2>
            <p className="text-muted-foreground mb-8">
              With over 5 years of experience helping individuals find clarity and purpose, 
              I bring a unique blend of professional expertise and personal warmth to each 
              coaching relationship. My approach is centered on creating a safe, confidential 
              space where you can explore challenges, discover strengths, and develop 
              practical strategies for positive change.
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
    </section>
  );
};

export default About;
