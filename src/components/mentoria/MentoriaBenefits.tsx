import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, TrendingUp, Users, Calendar, Award } from 'lucide-react';
import SectionWrapper from '../SectionWrapper';

const MentoriaBenefits = () => {
  const benefits = [
    {
      icon: Target,
      title: "Clareza de Propósito",
      description: "Identifique seus valores fundamentais e crie um plano de vida alinhado com quem você realmente é.",
      features: ["Autoconhecimento profundo", "Valores pessoais", "Visão de futuro"]
    },
    {
      icon: TrendingUp,
      title: "Crescimento Acelerado",
      description: "Desenvolva habilidades e mentalidade para superar desafios e alcançar resultados extraordinários.",
      features: ["Habilidades emocionais", "Resiliência", "Alta performance"]
    },
    {
      icon: Users,
      title: "Relacionamentos de Qualidade",
      description: "Melhore sua comunicação e construa conexões mais autênticas e significativas em todas áreas da vida.",
      features: ["Comunicação eficaz", "Inteligência emocional", "Networking autêntico"]
    },
    {
      icon: Calendar,
      title: "Equilíbrio Vida-Trabalho",
      description: "Encontre harmonia entre carreira, saúde pessoal e relacionamentos sem sacrificar seus sonhos.",
      features: ["Gestão de tempo", "Bem-estar integral", "Produtividade sustentável"]
    },
    {
      icon: Award,
      title: "Realização Profissional",
      description: "Alavanque sua carreira com propósito e encontre satisfação genuína no seu trabalho diário.",
      features: ["Liderança consciente", "Carreira com propósito", "Decisões assertivas"]
    },
    {
      icon: CheckCircle,
      title: "Resultados Medidos",
      description: "Acompanhe seu progresso com métricas claras e celebre cada conquista na sua jornada.",
      features: ["Metas SMART", "Indicadores de progresso", "Ajustes estratégicos"]
    }
  ];

  const structure = [
    {
      phase: "Mês 1-2",
      title: "Fundamentação",
      description: "Autoconhecimento e definição de objetivos",
      topics: ["Mapeamento de valores", "Análise SWOT pessoal", "Definição de metas SMART"]
    },
    {
      phase: "Mês 3-4",
      title: "Desenvolvimento",
      description: "Habilidades e mudanças de padrão",
      topics: ["Comunicação não-violenta", "Gestão emocional", "Hábitos de alta performance"]
    },
    {
      phase: "Mês 5-6",
      title: "Consolidação",
      description: "Implementação e sustentação",
      topics: ["Plano de ação", "Sistema de suporte", "Preparação para o futuro"]
    }
  ];

  return (
    <SectionWrapper background="light" className="py-16 md:py-24">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-subtitle text-brown">TRANSFORMAÇÃO GARANTIDA</span>
          <h2 className="section-title mb-6">O Que Você Vai Alcansar</h2>
          <p className="text-lg text-muted-foreground">
            Uma jornada estruturada de 6 meses que combina técnicas comprovadas de coaching
            com suporte personalizado para resultados extraordinários.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-brown/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-brown/10 p-3 rounded-lg">
                      <benefit.icon className="w-6 h-6 text-brown" />
                    </div>
                    <h3 className="font-bold text-lg">{benefit.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <div className="space-y-2">
                    {benefit.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brown rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Program Structure */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Estrutura do Programa</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma jornada carefully planejada em 3 fases para garantir transformação duradoura
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {structure.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Line */}
                {index < structure.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-brown/20 -translate-y-1/2"></div>
                )}

                <Card className="h-full border-2 border-brown/20 hover:border-brown/40 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Badge className="mb-4 bg-brown text-white hover:bg-brown/90">
                      {phase.phase}
                    </Badge>
                    <h4 className="font-bold text-xl mb-2">{phase.title}</h4>
                    <p className="text-muted-foreground mb-4">{phase.description}</p>
                    <div className="text-left space-y-2">
                      {phase.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Methodology */}
        <motion.div
          className="bg-brown/5 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Nossa Metodologia</h3>
              <p className="text-muted-foreground mb-6">
                Combinamos as melhores práticas internacionais de coaching com uma
                abordagem profundamente humana e personalizada.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Diagnóstico Personalizado</h4>
                    <p className="text-sm text-muted-foreground">
                      Mapeamento completo do seu estado atual e objetivos futuros
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Plano de Ação Estratégico</h4>
                    <p className="text-sm text-muted-foreground">
                      Metas claras com prazos e indicadores de sucesso definidos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Acompanhamento Contínuo</h4>
                    <p className="text-sm text-muted-foreground">
                      Suporte constante com ajustes estratégicos baseados nos resultados
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-soft">
                <div className="text-4xl font-bold text-brown mb-2">6 Meses</div>
                <p className="text-muted-foreground mb-4">de transformação intensiva</p>
                <div className="text-2xl font-semibold mb-1">12 Sessões</div>
                <p className="text-muted-foreground mb-4">encontros individuais</p>
                <div className="text-lg font-semibold mb-1">Suporte Contínuo</div>
                <p className="text-muted-foreground">comunicação entre sessões</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default MentoriaBenefits;