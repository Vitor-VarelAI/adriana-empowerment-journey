
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';

const ServiceComparison = () => {
  const isMobile = useIsMobile();
  const { setSelectedPackage } = useBooking();
  
  const servicePackages = [
    {
      name: 'Sessão Única',
      price: '€70',
      description: 'Ideal para quem quer experimentar uma sessão antes de avançar com pacotes',
      features: [
        { name: 'Sessão Personalizada de 60min', included: true },
        { name: 'Material de Apoio', included: true },
        { name: 'Acompanhamento por E-mail', included: false },
        { name: 'Exercícios Práticos', included: true },
        { name: 'Análise de Perfil', included: false },
        { name: 'Sessão de Seguimento', included: false },
      ],
      recommended: false
    },
    {
      name: 'Pacote de 4 Sessões',
      price: '€280',
      description: 'Continuidade semanal, ideal para dar início ao processo',
      features: [
        { name: 'Sessões Personalizadas (4x60min)', included: true },
        { name: 'Material de Apoio', included: true },
        { name: 'Acompanhamento por E-mail', included: true },
        { name: 'Exercícios Práticos', included: true },
        { name: 'Análise de Perfil', included: true },
        { name: 'Sessão de Seguimento', included: false },
      ],
      recommended: true
    },
    {
      name: 'Pacote de 10 Sessões',
      price: '€700',
      description: 'Foco em progresso visível, acompanhamento contínuo',
      features: [
        { name: 'Sessões Personalizadas (10x60min)', included: true },
        { name: 'Material de Apoio', included: true },
        { name: 'Acompanhamento por E-mail', included: true },
        { name: 'Exercícios Práticos', included: true },
        { name: 'Análise de Perfil', included: true },
        { name: 'Sessão de Seguimento', included: true },
      ],
      recommended: false
    }
  ];

  // Mobile: Show one package at a time with swipe functionality
  const renderMobileView = () => {
    return (
      <div className="relative px-4 pb-12">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-8">
          {servicePackages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative min-w-[280px] w-[85vw] max-w-[350px] flex-shrink-0 snap-center rounded-xl overflow-hidden shadow-medium border ${
                pkg.recommended 
                  ? 'border-brown' 
                  : 'border-brown/10'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 right-0 bg-brown text-white px-4 py-1 text-sm font-medium">
                  Recomendado
                </div>
              )}
              
              <div className={`p-6 ${pkg.recommended ? 'bg-brown/5' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold">{pkg.price}</span>
                  {pkg.name !== 'Sessão Única' && (
                    <span className="text-muted-foreground ml-2">por pacote</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? (
                        <CheckCircle2 className="text-brown shrink-0 mr-2" size={18} />
                      ) : (
                        <XCircle className="text-muted-foreground shrink-0 mr-2" size={18} />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div>
                  <Button
                    variant={pkg.recommended ? "sessionButton" : "outline"} 
                    className="w-full"
                    onClick={() => {
                      setSelectedPackage({
                        name: pkg.name,
                        price: pkg.price
                      });
                      toast.success(`Plano ${pkg.name} selecionado!`);
                      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Escolher Plano
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination dots for mobile */}
        <div className="flex justify-center space-x-2 mt-4">
          {servicePackages.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-brown' : 'bg-brown/30'}`}
            />
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          ⟵ Deslize para ver mais opções ⟶
        </div>
      </div>
    );
  };

  // Desktop: Show all packages in a grid
  const renderDesktopView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {servicePackages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-xl overflow-hidden shadow-medium border ${
              pkg.recommended 
                ? 'border-brown transform scale-105 z-10' 
                : 'border-brown/10'
            }`}
          >
            {pkg.recommended && (
              <div className="absolute top-0 right-0 bg-brown text-white px-4 py-1 text-sm font-medium">
                Recomendado
              </div>
            )}
            
            <div className={`p-6 ${pkg.recommended ? 'bg-brown/5' : 'bg-white'}`}>
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">{pkg.price}</span>
                {pkg.name !== 'Sessão Única' && (
                  <span className="text-muted-foreground ml-2">por pacote</span>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    {feature.included ? (
                      <CheckCircle2 className="text-brown shrink-0 mr-2" size={18} />
                    ) : (
                      <XCircle className="text-muted-foreground shrink-0 mr-2" size={18} />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div>
                <Button
                  variant={pkg.recommended ? "sessionButton" : "outline"} 
                  className="w-full"
                  onClick={() => {
                    setSelectedPackage({
                      name: pkg.name,
                      price: pkg.price
                    });
                    toast.success(`Plano ${pkg.name} selecionado!`);
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Escolher Plano
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section id="packages" className="section-padding bg-offwhite">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle">PACOTES DE SERVIÇOS</span>
          <h2 className="section-title">Escolha o Plano Ideal para Si</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos diferentes pacotes adaptados às suas necessidades específicas. 
            Todos incluem sessões de coaching personalizadas para maximizar os seus resultados.
          </p>
        </motion.div>

        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>
    </section>
  );
};

export default ServiceComparison;
