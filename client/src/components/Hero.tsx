import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImageEs from '@/assets/images/hero-es.png';
import heroImageEn from '@/assets/images/hero-en.jpg';

const Hero = () => {
  const { language, t } = useLanguage();
  
  // Seleccionar la imagen según el idioma
  const heroImage = language === 'es' ? heroImageEs : heroImageEn;

  return (
    <div className="relative pt-44 pb-16 md:pb-24 md:pt-56 lg:pt-64 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/40 to-sage/20 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 overflow-hidden" style={{ minHeight: '650px' }}>
          <img 
            src={heroImage} 
            alt={language === 'es' 
              ? "Eva Pérez - Experta en Estrategia de Hospitalidad y Bienestar de Lujo" 
              : "Eva Pérez - Expert in Luxury Hospitality & Wellness Strategy"} 
            className="w-full h-full object-cover object-[50%_-10%]"
          />
        </div>
      </div>
      
      <div className="container mx-auto pl-4 pr-8 sm:pl-6 lg:pl-6 relative z-20">
        <motion.div 
          className="max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight text-shadow mb-4">
            {language === 'es'
              ? "Asesoro a hoteles en la transformación de su área de Wellness"
              : "I advise hotels on transforming their Wellness area"}
          </h1>
          <p className="text-white text-base md:text-lg opacity-90 mb-3 border-l-4 border-white/70 pl-4 max-w-md">
            {language === 'es'
              ? "En un motor de crecimiento estratégico, rentable y alineado con la experiencia de lujo."
              : "Into a strategic growth engine, profitable and aligned with the luxury experience."}
          </p>
          <div className="mb-4">
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
          <p className="text-white text-xs md:text-sm opacity-80 mb-6 max-w-sm">
            {language === 'es'
              ? "Más de 20 años de experiencia optimizando operaciones, formando equipos excepcionales y elevando la satisfacción del cliente."
              : "Over 20 years of experience optimizing operations, training exceptional teams, and elevating customer satisfaction."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#services" className="bg-turquoise hover:bg-turquoise-dark text-white font-medium px-8 py-3 rounded transition-colors inline-block text-center">
              {language === 'es' ? "Descubre mis servicios" : "Discover my services"}
            </a>
            <a href="#contact" className="bg-white hover:bg-gray-100 text-turquoise-dark font-medium px-8 py-3 rounded transition-colors inline-block text-center">
              {language === 'es' ? "Contactar" : "Contact me"}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
