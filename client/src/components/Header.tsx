import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import evaProfileImage from '../assets/eva-perez-profile.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { isMobile, isTablet, isDesktop } = useDeviceDetect();

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
        isMobile
          ? scrolled ? 'py-1.5' : 'py-2'
          : isTablet
            ? scrolled ? 'py-2' : 'py-3'
            : scrolled ? 'py-2.5' : 'py-4'
      }`}
    >
      <div className={`container mx-auto ${
        isMobile ? 'px-3' : isTablet ? 'px-5' : 'px-8'
      }`}>
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center">
            <img 
              src={evaProfileImage} 
              alt="Eva Pérez" 
              className={`rounded-full object-cover flex-shrink-0 ${
                isMobile ? 'h-7 w-7 mr-2' : isTablet ? 'h-9 w-9 mr-2.5' : 'h-11 w-11 mr-3'
              }`}
            />
            <div>
              <span className={`font-playfair font-bold text-turquoise block leading-tight ${
                isMobile ? 'text-base' : isTablet ? 'text-xl' : 'text-2xl'
              }`}>Eva Pérez</span>
              <span className={`text-sage-dark font-light max-w-xs line-clamp-1 ${
                isMobile ? 'text-[10px]' : 'text-xs'
              }`}>
                {language === 'es' 
                  ? "Gerente de Proyectos SPA & Wellness" 
                  : "SPA & Wellness Project Manager"}
              </span>
            </div>
          </a>
          
          {/* Desktop/Tablet navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center">
              <nav className="flex items-center">
                <a 
                  href="#about" 
                  className={`text-charcoal hover:text-turquoise transition-colors ${
                    isTablet ? 'text-xs px-2' : 'text-sm px-3'
                  }`}
                >
                  {t('header.about')}
                </a>
                <a 
                  href="#services" 
                  className={`text-charcoal hover:text-turquoise transition-colors ${
                    isTablet ? 'text-xs px-2' : 'text-sm px-3'
                  }`}
                >
                  {t('header.services')}
                </a>
                <a 
                  href="#portfolio" 
                  className={`text-charcoal hover:text-turquoise transition-colors ${
                    isTablet ? 'text-xs px-2' : 'text-sm px-3'
                  }`}
                >
                  {t('header.portfolio')}
                </a>
                <a 
                  href="#testimonials" 
                  className={`text-charcoal hover:text-turquoise transition-colors ${
                    isTablet ? 'text-xs px-2' : 'text-sm px-3'
                  }`}
                >
                  {t('header.testimonials')}
                </a>
                <a 
                  href="#blog" 
                  className={`text-charcoal hover:text-turquoise transition-colors ${
                    isTablet ? 'text-xs px-2' : 'text-sm px-3'
                  }`}
                >
                  {t('header.blog')}
                </a>
                <a 
                  href="#contact" 
                  className={`bg-turquoise text-white rounded hover:bg-turquoise-dark transition-colors ${
                    isTablet ? 'text-xs px-3 py-1.5 ml-1' : 'text-sm px-4 py-2 ml-2'
                  }`}
                >
                  {t('header.contact')}
                </a>
              </nav>
              <div className={isTablet ? 'ml-2' : 'ml-4'}>
                <LanguageSwitcher />
              </div>
            </div>
          )}
          
          {/* Mobile hamburger button */}
          <button 
            className="md:hidden focus:outline-none p-1.5"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} ${isMobile ? 'text-lg' : 'text-xl'} text-charcoal`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden bg-white/98 backdrop-blur-md w-full border-t border-gray-100 absolute left-0 right-0 z-50 shadow-md transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className={`container mx-auto ${isMobile ? 'px-3 py-3 space-y-2' : 'px-4 py-4 space-y-3'}`}>
          <a 
            href="#about" 
            className={`block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`} 
            onClick={toggleMobileMenu}
          >
            {t('header.about')}
          </a>
          <a 
            href="#services" 
            className={`block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`} 
            onClick={toggleMobileMenu}
          >
            {t('header.services')}
          </a>
          <a 
            href="#portfolio" 
            className={`block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`} 
            onClick={toggleMobileMenu}
          >
            {t('header.portfolio')}
          </a>
          <a 
            href="#testimonials" 
            className={`block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`} 
            onClick={toggleMobileMenu}
          >
            {t('header.testimonials')}
          </a>
          <a 
            href="#blog" 
            className={`block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`} 
            onClick={toggleMobileMenu}
          >
            {t('header.blog')}
          </a>
          <a 
            href="#contact" 
            className={`block text-turquoise font-medium border-b border-gray-100 active:bg-gray-50 transition-colors ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`} 
            onClick={toggleMobileMenu}
          >
            {t('header.contact')}
          </a>
          <div className={`flex items-center justify-between ${isMobile ? 'py-2' : 'py-3'}`}>
            <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {language === 'es' ? 'Idioma' : 'Language'}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
