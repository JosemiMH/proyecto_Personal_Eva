import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImageEs from '@/assets/images/hero-es.png';
import heroImageEn from '@/assets/images/hero-en.jpg';

const Hero = () => {
  const { language, t } = useLanguage();
  
  // Seleccionar la imagen según el idioma
  const heroImage = language === 'es' ? heroImageEs : heroImageEn;

  return (
    <div className="relative pt-36 pb-16 md:pb-24 md:pt-56 lg:pt-64 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/60 to-sage/40 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 overflow-hidden" 
          style={{ 
            minHeight: '650px',
            height: '100%'
          }}>
          <img 
            src={heroImage} 
            alt={language === 'es' 
              ? "Eva Pérez - Experta en Estrategia de Hospitalidad y Bienestar de Lujo" 
              : "Eva Pérez - Expert in Luxury Hospitality & Wellness Strategy"} 
            className="w-full h-full object-cover object-[65%_-10%] sm:object-[50%_-10%]"
          />
        </div>
      </div>
      
      <div className="container mx-auto pl-4 pr-4 sm:pl-6 sm:pr-8 lg:pl-6 relative z-20">
        <motion.div 
          className="max-w-[90%] sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight text-shadow mb-2 sm:mb-4">
            {language === 'es'
              ? "Asesoro a hoteles en la transformación de su área de Wellness"
              : "I advise hotels on transforming their Wellness area"}
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg opacity-90 mb-2 sm:mb-3 border-l-4 border-white/70 pl-3 sm:pl-4 max-w-full sm:max-w-md">
            {language === 'es'
              ? "En un motor de crecimiento estratégico, rentable y alineado con la experiencia de lujo."
              : "Into a strategic growth engine, profitable and aligned with the luxury experience."}
          </p>
          <div className="mb-2 sm:mb-4">
            <p className="text-white text-xs md:text-sm uppercase tracking-wider font-semibold">
              {language === 'es'
                ? "Experta en Estrategia de Hospitalidad y Bienestar de Lujo"
                : "Expert in Luxury Hospitality & Wellness Strategy"}
            </p>
            <p className="text-white/80 text-xs md:text-sm">
              {language === 'es'
                ? "Gerente de Proyectos SPA & Wellness – Especialista en Optimización de Ingresos"
                : "SPA & Wellness Project Manager – Revenue Optimization Specialist"}
            </p>
          </div>
          <p className="text-white text-xs md:text-sm opacity-80 mb-4 sm:mb-6 max-w-full sm:max-w-sm">
            {language === 'es'
              ? "Más de 20 años de experiencia optimizando operaciones, formando equipos excepcionales y elevando la satisfacción del cliente."
              : "Over 20 years of experience optimizing operations, training exceptional teams, and elevating customer satisfaction."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a href="#services" className="bg-turquoise hover:bg-turquoise-dark text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-colors inline-block text-center text-sm sm:text-base">
              {language === 'es' ? "Descubre mis servicios" : "Discover my services"}
            </a>
            <a href="#contact" className="bg-white hover:bg-gray-100 text-turquoise-dark font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-colors inline-block text-center text-sm sm:text-base">
              {language === 'es' ? "Contactar" : "Contact me"}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
