import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const SimpleBenefits = () => {
  const benefits = [
    'Clareza e foco nos teus objetivos',
    'Suporte contínuo durante 6 meses',
    'Networking exclusivo e direcionado'
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-pink-200 via-[#6B1FBF] to-pink-200"></div>
          <h2 className="mt-6 text-3xl font-semibold text-gray-900 md:text-4xl">
            Por que participar?
          </h2>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Estrutura prática em blocos semanais para alinhar estratégia, ação e accountability com suporte constante.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              className="h-full rounded-2xl border border-gray-100 bg-[#F9FAFB] p-8 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B1FBF]/10 text-[#6B1FBF]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="mt-6 text-lg font-medium text-gray-800">
                {benefit}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleBenefits;
