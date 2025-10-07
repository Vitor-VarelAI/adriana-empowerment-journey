
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
  <div className="flex space-x-4 mb-8">
    {socialLinks.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className="text-gray-500 hover:text-brown transition-colors duration-300"
        aria-label={link['aria-label']}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.icon}
      </a>
    ))}
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-20 border-t border-muted">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <motion.a
            href="#"
            className="text-brown font-playfair text-xl font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Adriana Coaching
          </motion.a>
          <p className="text-muted-foreground mb-6 text-sm text-center">
            Coaching profissional para o ajudar a encontrar paz e equilíbrio
          </p>
          
          <SocialLinks />
          
          <p className="text-muted-foreground text-xs text-center mb-2">
            Opção adicional: 12 Sessões por 840€ (pagamento em 3x, IVA incluído)
          </p>
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Adriana Coaching. Todos os direitos reservados.
          </p>
          <p className="mt-4 w-full text-xs text-muted-foreground text-center md:text-right md:w-auto md:self-end">
            Desenvolvido por{' '}
            <a
              href="https://www.linkedin.com/in/vitor-varela-2743a4b9/"
              target="_blank"
              rel="nofollow noopener noreferrer me"
              className="no-underline text-muted-foreground transition-colors hover:text-brown focus-visible:underline focus-visible:outline-none hover:underline"
            >
              VVarelAI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
