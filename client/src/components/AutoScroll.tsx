import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const AutoScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { language } = useLanguage();

  // Función para comprobar si estamos cerca del final de la página
  const checkIfAtBottom = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Consideramos "cerca del final" si estamos a menos del 20% de la altura total del final
    const threshold = documentHeight * 0.8;
    
    setIsAtBottom(scrollPosition > threshold);
  };

  // Función para volver arriba rápidamente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Función para realizar el scroll automático
  const startAutoScroll = () => {
    // Si estamos cerca del final, simplemente volvemos arriba
    if (isAtBottom) {
      scrollToTop();
      return;
    }
    
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
          setTimeout(scrollToNextSection, 3000); // 3 segundos entre cada scroll
        } else {
          // Finalizar el auto-scroll
          setTimeout(() => {
            setIsScrolling(false);
            setShowButton(true);
          }, 3000);
        }
      }
    };

    // Iniciar el proceso de scroll
    scrollToNextSection();
  };

  // Evento para detectar si el usuario hace scroll manual
  useEffect(() => {
    const handleManualScroll = () => {
      // Comprobar si estamos cerca del final para cambiar el botón
      checkIfAtBottom();
      
      if (isScrolling) {
        setIsScrolling(false);
        setTimeout(() => setShowButton(true), 1000);
      }
    };

    // Inicializar al montar el componente
    checkIfAtBottom();

    window.addEventListener('wheel', handleManualScroll);
    window.addEventListener('touchmove', handleManualScroll);
    window.addEventListener('scroll', handleManualScroll);
    
    return () => {
      window.removeEventListener('wheel', handleManualScroll);
      window.removeEventListener('touchmove', handleManualScroll);
      window.removeEventListener('scroll', handleManualScroll);
    };
  }, [isScrolling]);

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={startAutoScroll}
        className="bg-turquoise hover:bg-turquoise-dark text-white rounded-full shadow-lg py-4 px-5 transition-all hover:scale-105"
        size="lg"
      >
        {isAtBottom ? (
          <>
            <span className="mr-2">
              {language === 'es' ? 'Volver arriba' : 'Back to top'}
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
              <path d="M12 19V5"></path>
              <path d="m5 12 7-7 7 7"></path>
            </svg>
          </>
        ) : (
          <>
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
          </>
        )}
      </Button>
    </div>
  );
};

export default AutoScroll;