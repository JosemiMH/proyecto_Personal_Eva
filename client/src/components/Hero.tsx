import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImageEs from '@/assets/images/hero-es.png';
import heroImageEn from '@/assets/images/hero-en.jpg';

const Hero = () => {
  const { language, t } = useLanguage();
  
  // Seleccionar la imagen según el idioma
  const heroImage = language === 'es' ? heroImageEs : heroImageEn;

  return (
    <div className="relative pt-24 pb-16 md:pb-24 md:pt-32 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/50 to-sage/30 mix-blend-multiply z-10"></div>
        <img 
          src={heroImage} 
          alt={language === 'es' 
            ? "Eva Pérez - Experta en Estrategia de Hospitalidad y Bienestar de Lujo" 
            : "Eva Pérez - Expert in Luxury Hospitality & Wellness Strategy"} 
          className={`w-full h-full ${language === 'en' ? 'object-cover object-top' : 'object-cover'}`}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-shadow mb-6">
            {language === 'es'
              ? "Asesoro a hoteles en la transformación de su área de Wellness"
              : "I advise hotels on transforming their Wellness area"}
          </h1>
          <p className="text-white text-lg md:text-xl opacity-90 mb-4 max-w-xl font-medium border-l-4 border-white/70 pl-4">
            {language === 'es'
              ? "En un motor de crecimiento estratégico, rentable y alineado con la experiencia de lujo."
              : "Into a strategic growth engine, profitable and aligned with the luxury experience."}
          </p>
          <div className="mb-6">
            <p className="text-white text-sm md:text-base uppercase tracking-wider font-semibold mb-1">
              {language === 'es'
                ? "Experta en Estrategia de Hospitalidad y Bienestar de Lujo"
                : "Expert in Luxury Hospitality & Wellness Strategy"}
            </p>
            <p className="text-white/80 text-sm md:text-base">
              {language === 'es'
                ? "Gerente de Proyectos SPA & Wellness – Especialista en Optimización de Ingresos"
                : "SPA & Wellness Project Manager – Revenue Optimization Specialist"}
            </p>
          </div>
          <p className="text-white text-base opacity-80 mb-8 max-w-xl">
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
