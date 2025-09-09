
import { motion } from 'framer-motion';
import { Instagram, Youtube } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
    role="img"
  >
    <path d="M448.2 209.9a210 210 0 0 1-121.1-40v137.1a180.58 180.58 0 1 1-154.5-178.1v94.2a90.29 90.29 0 1 0 116.4 87.8V0h88.9a211.4 211.4 0 0 0 21.4 74.2 210.3 210.3 0 0 0 87.4 76.7 210.7 210.7 0 0 1-38.7 59z"/>
  </svg>
);

const socialLinks = [
  {
    href: "https://www.instagram.com/reel/DNGrZsvsfUAqr3_R8oLsYzwxCFI1NysK91IK-U0/?igsh=MWJ3MXlwa3V4dXI0Mg==",
    "aria-label": "Instagram",
    icon: <Instagram size={24} />,
  },
  {
    href: "https://www.tiktok.com/@a.iria?_t=ZN-8yhr0khAPN0&_r=1",
    "aria-label": "TikTok",
    icon: <TikTokIcon className="w-6 h-6" />,
  },
  {
    href: "https://www.youtube.com/@adrianairia",
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
    <footer className="py-12 border-t border-muted">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
