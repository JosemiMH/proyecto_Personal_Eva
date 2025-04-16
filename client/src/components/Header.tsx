import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import evaProfileImage from '../assets/eva-perez-profile.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useLanguage();

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
      className={`fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-2 sm:py-3'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center">
            <img 
              src={evaProfileImage} 
              alt="Eva Pérez" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0"
            />
            <div>
              <span className="font-playfair text-lg sm:text-2xl font-bold text-turquoise block leading-tight">Eva Pérez</span>
              <span className="text-sage-dark text-[10px] sm:text-xs font-light max-w-xs line-clamp-1">
                {language === 'es' 
                  ? "Gerente de Proyectos SPA & Wellness" 
                  : "SPA & Wellness Project Manager"}
              </span>
            </div>
          </a>
          
          <div className="hidden lg:flex items-center">
            <nav className="flex items-center">
              <a href="#about" className="text-charcoal hover:text-turquoise transition-colors text-sm px-3">{t('header.about')}</a>
              <a href="#services" className="text-charcoal hover:text-turquoise transition-colors text-sm px-3">{t('header.services')}</a>
              <a href="#portfolio" className="text-charcoal hover:text-turquoise transition-colors text-sm px-3">{t('header.portfolio')}</a>
              <a href="#testimonials" className="text-charcoal hover:text-turquoise transition-colors text-sm px-3">{t('header.testimonials')}</a>
              <a href="#blog" className="text-charcoal hover:text-turquoise transition-colors text-sm px-3">{t('header.blog')}</a>
              <a href="#contact" className="bg-turquoise text-white px-4 py-2 rounded hover:bg-turquoise-dark transition-colors text-sm ml-2">{t('header.contact')}</a>
            </nav>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
          
          <button 
            className="lg:hidden focus:outline-none p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-charcoal`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`lg:hidden bg-white/95 backdrop-blur-md w-full border-t border-gray-100 absolute left-0 right-0 z-50 shadow-md transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          <a href="#about" className="block py-3 text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors" onClick={toggleMobileMenu}>{t('header.about')}</a>
          <a href="#services" className="block py-3 text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors" onClick={toggleMobileMenu}>{t('header.services')}</a>
          <a href="#portfolio" className="block py-3 text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors" onClick={toggleMobileMenu}>{t('header.portfolio')}</a>
          <a href="#testimonials" className="block py-3 text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors" onClick={toggleMobileMenu}>{t('header.testimonials')}</a>
          <a href="#blog" className="block py-3 text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors" onClick={toggleMobileMenu}>{t('header.blog')}</a>
          <a href="#contact" className="block py-3 text-turquoise font-medium border-b border-gray-100 active:bg-gray-50 transition-colors" onClick={toggleMobileMenu}>{t('header.contact')}</a>
          <div className="py-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">{language === 'es' ? 'Idioma' : 'Language'}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
