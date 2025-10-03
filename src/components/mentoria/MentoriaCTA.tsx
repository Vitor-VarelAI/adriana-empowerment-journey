import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionWrapper from '../SectionWrapper';
import { Quote, Star, Users, Clock, ArrowRight } from 'lucide-react';

const MentoriaCTA = () => {
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Gerente de Marketing",
      content: "A mentoria transformou completamente minha perspectiva de vida. Hoje tomo decisões com mais confiança e clareza.",
      rating: 5,
      transformation: "Carreira + Vida Pessoal"
    },
    {
      name: "Carlos Mendes",
      role: "Empreendedor",
      content: "Adriana me ajudou a encontrar equilíbrio entre crescimento empresarial e bem-estar pessoal. Inestimável.",
      rating: 5,
      transformation: "Liderança + Equilíbrio"
    },
    {
      name: "Mariana Costa",
      role: "Designer UX",
      content: "Finalmente entendi o que quero da vida e como chegar lá. A mentoria vale cada euro investido.",
      rating: 5,
      transformation: "Propósito + Direção"
    }
  ];

  const stats = [
    { value: "95%", label: "Satisfação", description: "dos clientes recomendam" },
    { value: "87%", label: "Resultados", description: "atingem metas principais" },
    { value: "4.9/5", label: "Avaliação", description: "média de satisfação" },
    { value: "200+", label: "Lives", description: "transformadas" }
  ];

  return (
    <>
      {/* Testimonials Section */}
      <SectionWrapper background="custom" className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-subtitle text-brown">DEPOIMENTOS REAIS</span>
            <h2 className="section-title text-white mb-6">
              Quem Transformou Vidas Conosco
            </h2>
            <p className="text-lg text-gray-300">
              Histórias reais de pessoas que encontraram clareza, propósito e resultados extraordinários
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brown mb-1">
                  {stat.value}
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-gray-400 text-sm">{stat.description}</div>
              </div>
            ))}
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-brown/30 mb-4" />
                    <p className="text-gray-300 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t border-white/10 pt-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400 mb-2">{testimonial.role}</div>
                      <Badge variant="secondary" className="bg-brown/20 text-brown border-brown/30">
                        {testimonial.transformation}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Final CTA Section */}
      <SectionWrapper id="candidatura" background="custom" className="py-16 md:py-24 bg-gradient-to-br from-brown/5 to-offwhite">
        <div className="container mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Urgency Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="w-4 h-4" />
              ÚLTIMAS 2 VAGAS • NOVEMBRO 2025
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sua Jornada de Transformação<br/>Começa Agora
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Esta é sua oportunidade de investir no crescimento mais importante:
              <span className="text-brown font-semibold"> o seu</span>.
              Vagas limitadas para garantir atenção personalizada e resultados extraordinários.
            </p>

            {/* Investment Card */}
            <Card className="max-w-2xl mx-auto mb-8 border-2 border-brown/20">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-left">
                    <h3 className="font-bold text-xl mb-4">Investimento em Você</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-brown" />
                        <span>Acompanhamento individual</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-brown" />
                        <span>12 sessões de 60min</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-brown" />
                        <span>Suporte entre sessões</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-brown" />
                        <span>Material exclusivo</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brown mb-2">
                      €1.997
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      ou 3x de €699 sem juros
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Parcelamento disponível • Garantia de satisfação
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                variant="sessionButton"
                size="lg"
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto"
              >
                Quero Minha Vaga Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open('https://wa.me/351912345678?text=Ol%C3%A1%2C+gostaria+de+saber+mais+sobre+a+mentoria+de+6+meses.', '_blank')}
                className="w-full sm:w-auto border-brown text-brown hover:bg-brown hover:text-white"
              >
                Falar com Mentora
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              <span className="text-brown font-medium">⚠️</span> As 2 últimas vagas para Novembro 2025 estão disponíveis
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Mentoria certificada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>+200 vidas transformadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Garantia de 7 dias</span>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default MentoriaCTA;