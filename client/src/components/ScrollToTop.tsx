import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  // Función para volver arriba rápidamente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Evento para detectar si el usuario hace scroll y mostrar/ocultar el botón
  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón cuando se ha hecho scroll hacia abajo (más de 300px)
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Añadir el evento de scroll
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={scrollToTop}
        className="bg-turquoise hover:bg-turquoise-dark text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Volver arriba"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
      </Button>
    </div>
  );
};

export default ScrollToTop;