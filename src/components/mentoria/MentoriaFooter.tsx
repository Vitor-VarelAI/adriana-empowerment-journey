import { motion } from 'framer-motion';
import { Instagram, Mail, Youtube } from 'lucide-react';

const socialLinks = [
  {
    href: "https://www.instagram.com/adriana.iria/?igsh=MWpkMWhjdGhoY2k1cg%3D%3D#",
    "aria-label": "Instagram",
    icon: <Instagram size={24} />,
  },
  {
    href: "mailto:adrianairia.leadercoach@gmail.com",
    "aria-label": "Email",
    icon: <Mail size={24} />,
  },
  {
    href: "https://youtube.com/@adrianairia.?feature=shared",
    "aria-label": "YouTube",
    icon: <Youtube size={24} />,
  },
];

const SocialLinks = () => (
  <div className="flex space-x-4 mb-6 md:mb-8">
    {socialLinks.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className="text-white/50 hover:text-white transition-colors duration-300"
        aria-label={link['aria-label']}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.icon}
      </a>
    ))}
  </div>
);

const MentoriaFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] py-14 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <motion.a
              href="#"
              className="text-brown font-playfair text-xl font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Adriana Coaching
            </motion.a>
            <p className="text-white/70 mb-6 text-sm max-w-sm">
              Coaching profissional para o ajudar a encontrar paz e equilíbrio
            </p>
            <SocialLinks />
            <p className="text-white/60 text-xs">
              Opção adicional: 12 Sessões por 840€ (pagamento em 3x, IVA incluído)
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-white/60 text-center md:items-end md:text-right">
            <p className="text-sm">
              &copy; {currentYear} Adriana Coaching. Todos os direitos reservados.
            </p>
            <p className="text-xs">
              Desenvolvido por{' '}
              <a
                href="https://www.linkedin.com/in/vitor-varela-2743a4b9/"
                target="_blank"
                rel="nofollow noopener noreferrer me"
                className="no-underline text-white/60 transition-colors hover:text-white focus-visible:underline focus-visible:outline-none hover:underline"
              >
                VVarelAI
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MentoriaFooter;
