
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const currentImageRef = imageRef.current;
    if (currentImageRef) {
      observer.observe(currentImageRef);
    }
    
    return () => {
      if (currentImageRef) {
        observer.unobserve(currentImageRef);
      }
    };
  }, []);

  return (
    <section className="py-20 md:py-24 bg-offwhite overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Text Column */}
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-subtitle">COACHING PROFISSIONAL</span>
            <h1 className="section-title mb-6">
              Encontre paz.<br/>Encontre-se.
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Coaching profissional concebido para orientar a sua vida na direção certa,
              trazendo paz de espírito e estabilidade emocional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="sessionButton"
                  size="lg"
                  onClick={() => document.getElementById('booking-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  Agendar uma Sessão
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/mentoria-outubro-2025'}
                  className="border-brown text-brown hover:bg-brown hover:text-white"
                >
                  Mentoria 6 Meses
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Image Column */}
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <img 
                ref={imageRef}
                src="/lovable-uploads/86fb6b84-589d-4a46-894f-093f11a2e9ca.png" 
                alt="Adriana - Professional Coach" 
                className="rounded-xl shadow-medium w-full h-auto image-fade"
              />
              
              {/* Floating Badges */}
              <motion.div 
                className="badge absolute top-4 right-4 md:right-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                Conveniente
              </motion.div>
              
              <motion.div 
                className="badge absolute left-4 md:left-8 top-1/3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                Cuidado
              </motion.div>
              
              <motion.div 
                className="badge absolute bottom-8 right-1/4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ y: -5 }}
              >
                Confidencial
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
