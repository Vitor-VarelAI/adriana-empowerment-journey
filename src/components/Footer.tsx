
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

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
          
          {/* Social Icons */}
          <div className="flex space-x-4 mb-8">
            <a 
              href="https://www.instagram.com/example_profile" 
              className="text-gray-500 hover:text-brown transition-colors duration-300"
              aria-label="Instagram"
              target="_blank" rel="noopener noreferrer"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://www.facebook.com/example_page" 
              className="text-gray-500 hover:text-brown transition-colors duration-300"
              aria-label="Facebook"
              target="_blank" rel="noopener noreferrer"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/in/example_user" 
              className="text-gray-500 hover:text-brown transition-colors duration-300"
              aria-label="LinkedIn"
              target="_blank" rel="noopener noreferrer"
            >
              <Linkedin size={24} />
            </a>
          </div>
          
          <p className="text-muted-foreground text-xs text-center mb-2">
            Opção adicional: 12 Sessões por 840 € (pagamento em 3x, IVA incluído)
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
