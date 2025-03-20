
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <section className="pt-32 pb-16 md:pt-36 md:pb-24 bg-offwhite overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Text Column */}
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-subtitle">PROFESSIONAL COACHING</span>
            <h1 className="section-title mb-6">
              Find peace.<br/>Find yourself.
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Professional coaching designed to guide your life in the right direction, 
              bringing peace of mind and emotional stability.
            </p>
            <motion.a 
              href="#book" 
              className="button-primary inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Book A Session
            </motion.a>
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
                Convenient
              </motion.div>
              
              <motion.div 
                className="badge absolute left-4 md:left-8 top-1/3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                Caring
              </motion.div>
              
              <motion.div 
                className="badge absolute bottom-8 right-1/4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ y: -5 }}
              >
                Confidential
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
