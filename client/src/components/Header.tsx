import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import evaProfileImage from '../assets/eva-perez-profile.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  // Handle scroll event for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      id="navbar"
      className={`fixed w-full bg-white bg-opacity-95 shadow-sm z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center">
            <img 
              src={evaProfileImage} 
              alt="Eva Pérez" 
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
            <div>
              <span className="font-playfair text-2xl font-bold text-turquoise block leading-tight">Eva Pérez</span>
              <span className="hidden md:inline-block text-sage-dark text-sm font-light">Spa Manager & Consultant</span>
            </div>
          </a>
          
          <div className="hidden lg:flex space-x-8 items-center">
            <a href="#about" className="text-charcoal hover:text-turquoise transition-colors">Sobre mí</a>
            <a href="#services" className="text-charcoal hover:text-turquoise transition-colors">Servicios</a>
            <a href="#portfolio" className="text-charcoal hover:text-turquoise transition-colors">Portfolio</a>
            <a href="#testimonials" className="text-charcoal hover:text-turquoise transition-colors">Testimonios</a>
            <a href="#blog" className="text-charcoal hover:text-turquoise transition-colors">Blog</a>
            <a href="#contact" className="bg-turquoise text-white px-6 py-2 rounded hover:bg-turquoise-dark transition-colors">Contacto</a>
          </div>
          
          <button 
            className="lg:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars text-xl text-charcoal"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`lg:hidden bg-white w-full border-t border-gray-100 ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <a href="#about" className="block py-2 text-charcoal hover:text-turquoise">Sobre mí</a>
          <a href="#services" className="block py-2 text-charcoal hover:text-turquoise">Servicios</a>
          <a href="#portfolio" className="block py-2 text-charcoal hover:text-turquoise">Portfolio</a>
          <a href="#testimonials" className="block py-2 text-charcoal hover:text-turquoise">Testimonios</a>
          <a href="#blog" className="block py-2 text-charcoal hover:text-turquoise">Blog</a>
          <a href="#contact" className="block py-2 text-turquoise font-medium">Contacto</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
