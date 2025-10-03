import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Star } from 'lucide-react';

const MentoriaHero = () => {
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
    <section className="py-20 md:py-24 bg-gradient-to-br from-brown/5 to-offwhite overflow-hidden relative">
      {/* Badge Exclusividade */}
      <motion.div
        className="absolute top-6 right-6 md:top-8 md:right-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-brown text-white px-4 py-2 rounded-full text-sm font-medium shadow-soft flex items-center gap-2">
          <Users className="w-4 h-4" />
          Vagas Limitadas • 2025
        </div>
      </motion.div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Text Column */}
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-subtitle text-brown">MENTORIA EXCLUSIVA</span>
            <h1 className="section-title mb-6">
              Transforme Sua Vida<br/>em 6 Meses
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-lg">
              Programa de mentoria intensivo concebido para profissionais que buscam
              clareza, propósito e resultados extraordinários na vida e carreira.
            </p>

            {/* Benefícios Rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-brown/10 rounded-lg p-3 mb-2 inline-flex">
                  <Calendar className="w-5 h-5 text-brown" />
                </div>
                <h3 className="font-semibold text-sm">6 Meses</h3>
                <p className="text-xs text-muted-foreground">Transformação profunda</p>
              </motion.div>

              <motion.div
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-brown/10 rounded-lg p-3 mb-2 inline-flex">
                  <Clock className="w-5 h-5 text-brown" />
                </div>
                <h3 className="font-semibold text-sm">Sessões Semanais</h3>
                <p className="text-xs text-muted-foreground">Acompanhamento contínuo</p>
              </motion.div>

              <motion.div
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-brown/10 rounded-lg p-3 mb-2 inline-flex">
                  <Star className="w-5 h-5 text-brown" />
                </div>
                <h3 className="font-semibold text-sm">Resultados</h3>
                <p className="text-xs text-muted-foreground">Medidos e validados</p>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="sessionButton"
                size="lg"
                onClick={() => document.getElementById('candidatura')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto"
              >
                Quero Minha Vaga
              </Button>
            </motion.div>

            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1 justify-center md:justify-start">
              <span className="text-brown font-medium">⚠️</span>
              Últimas vagas para Novembro 2025
            </p>
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
                alt="Adriana - Mentoria Profissional"
                className="rounded-xl shadow-medium w-full h-auto image-fade"
              />

              {/* Badges Flutuantes */}
              <motion.div
                className="absolute top-4 right-4 md:right-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-soft border border-brown/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">2 Vagas Disponíveis</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute left-4 md:left-8 bottom-8 bg-brown text-white rounded-lg p-4 shadow-soft max-w-[180px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <h4 className="font-bold text-lg mb-1">Nov/2025</h4>
                <p className="text-sm opacity-90">Início da turma exclusiva</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MentoriaHero;