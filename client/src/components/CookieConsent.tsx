import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadGoogleTagManager, updateConsent } from '@/lib/analytics';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Comprobar si el usuario ya ha aceptado las cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted' || consent === 'true') {
      localStorage.setItem('cookieConsent', 'accepted');
      updateConsent(true);
      loadGoogleTagManager();
      return;
    }
    
    // Si no hay consentimiento, mostrar el banner después de un pequeño retraso
    if (!consent) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500); // Mostrar después de 1.5 segundos
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    updateConsent(true);
    loadGoogleTagManager();
    setShowConsent(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    updateConsent(false);
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-8 text-center md:text-left">
              <p className="text-charcoal text-sm md:text-base">
                {language === 'es' 
                  ? 'Utilizamos cookies para mejorar tu experiencia. Al continuar navegando en nuestra web, aceptas nuestra ' 
                  : 'We use cookies to enhance your experience. By continuing to browse our site, you agree to our '}
                <Link href="/cookies" className="text-turquoise hover:underline">
                  {language === 'es' ? 'política de cookies' : 'cookie policy'}
                </Link>.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={rejectCookies}
                className="border-gray-300 text-charcoal hover:bg-gray-100 hover:text-charcoal"
              >
                {language === 'es' ? 'Rechazar' : 'Reject'}
              </Button>
              <Button 
                size="sm"
                onClick={acceptCookies}
                className="bg-turquoise hover:bg-turquoise-dark text-white"
              >
                {language === 'es' ? 'Aceptar' : 'Accept'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
