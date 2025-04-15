import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const AutoScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const { language } = useLanguage();

  // Función para realizar el scroll automático
  const startAutoScroll = () => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    setShowButton(false);
    
    // Obtener todas las secciones principales
    const sections = document.querySelectorAll('section[id]');
    const sectionArray = Array.from(sections);
    
    // Índice inicial (empezando desde el principio)
    let currentIndex = 0;

    // Función para hacer scroll a la siguiente sección
    const scrollToNextSection = () => {
      if (currentIndex < sectionArray.length) {
        const targetSection = sectionArray[currentIndex];
        
        // Hacer scroll suave hacia la sección
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Incrementar el índice para el próximo scroll
        currentIndex++;
        
        // Programar el próximo scroll
        if (currentIndex < sectionArray.length) {
          setTimeout(scrollToNextSection, 4000); // 4 segundos entre cada scroll
        } else {
          // Finalizar el auto-scroll
          setTimeout(() => {
            setIsScrolling(false);
            setShowButton(true);
          }, 4000);
        }
      }
    };

    // Iniciar el proceso de scroll
    scrollToNextSection();
  };

  // Evento para detectar si el usuario hace scroll manual
  useEffect(() => {
    const handleManualScroll = () => {
      if (isScrolling) {
        setIsScrolling(false);
        setTimeout(() => setShowButton(true), 1000);
      }
    };

    window.addEventListener('wheel', handleManualScroll);
    window.addEventListener('touchmove', handleManualScroll);
    
    return () => {
      window.removeEventListener('wheel', handleManualScroll);
      window.removeEventListener('touchmove', handleManualScroll);
    };
  }, [isScrolling]);

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={startAutoScroll}
        className="bg-turquoise hover:bg-turquoise-dark text-white rounded-full shadow-lg"
        size="lg"
      >
        <span className="mr-2">
          {language === 'es' ? 'Recorrido automático' : 'Auto tour'}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </Button>
    </div>
  );
};

export default AutoScroll;