
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Video, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section
      const sections = ['about', 'services', 'process', 'testimonials'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Como Funciona', href: '#process' },
    { name: 'Testemunhos', href: '#testimonials' },
  ];
  
  const handleBookingClick = () => {
    const bookElement = document.getElementById('book');
    if (bookElement) {
      window.scrollTo({
        top: bookElement.offsetTop - 80,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${isScrolled ? 'py-2 glassmorphism' : 'py-4 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.a 
          href="#" 
          className="text-brown font-playfair text-xl md:text-2xl font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Adriana Coaching
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              className={`transition-colors duration-300 ${
                activeSection === link.href.substring(1) 
                  ? 'text-brown font-medium' 
                  : 'text-darkgray hover:text-brown'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              {link.name}
            </motion.a>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button
              variant="sessionButton"
              size="default"
              onClick={handleBookingClick}
            >
              <Video className="mr-2" size={16} />
              Reservar
            </Button>
          </motion.div>
        </nav>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-darkgray p-2 rounded-md hover:bg-brown/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-medium py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between py-3 border-b border-gray-100 ${
                    activeSection === link.href.substring(1) 
                      ? 'text-brown font-medium' 
                      : 'text-darkgray'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  <ChevronDown size={16} className="text-brown" />
                </a>
              ))}
              <Button
                variant="sessionButton"
                size="default"
                className="w-full mt-2"
                onClick={handleBookingClick}
              >
                <Video className="mr-2" size={16} />
                Reservar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
