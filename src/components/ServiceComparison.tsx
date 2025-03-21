
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ServiceComparison = () => {
  const servicePackages = [
    {
      name: 'Sessão Única',
      price: '€120',
      description: 'Ideal para quem quer experimentar',
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
      name: 'Pacote Essencial',
      price: '€400',
      description: 'Melhor valor para resultados reais',
      features: [
        { name: 'Sessões Personalizadas (5x60min)', included: true },
        { name: 'Material de Apoio', included: true },
        { name: 'Acompanhamento por E-mail', included: true },
        { name: 'Exercícios Práticos', included: true },
        { name: 'Análise de Perfil', included: true },
        { name: 'Sessão de Seguimento', included: false },
      ],
      recommended: true
    },
    {
      name: 'Pacote Premium',
      price: '€700',
      description: 'Transformação completa e duradoura',
      features: [
        { name: 'Sessões Personalizadas (8x60min)', included: true },
        { name: 'Material de Apoio', included: true },
        { name: 'Acompanhamento por E-mail', included: true },
        { name: 'Exercícios Práticos', included: true },
        { name: 'Análise de Perfil', included: true },
        { name: 'Sessão de Seguimento', included: true },
      ],
      recommended: false
    }
  ];

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
                
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={pkg.recommended ? "sessionButton" : "outline"} 
                    className="w-full"
                    onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Escolher Plano
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceComparison;
