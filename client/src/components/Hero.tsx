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
          alt={language === 'es' ? "Eva Pérez - Spa Manager" : "Eva Pérez - Spa Manager"} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-shadow mb-6">
            {language === 'es' 
              ? "Transformando espacios de bienestar en experiencias memorables" 
              : "Transforming wellness spaces into memorable experiences"}
          </h1>
          <p className="text-white text-lg md:text-xl opacity-90 mb-8 max-w-xl">
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
