import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const CallToAction = () => {
  const { language } = useLanguage();
  
  // Contenido traducido
  const content = {
    es: {
      title: "¿Listo para transformar tu negocio wellness?",
      description: "Agenda una consulta gratuita para descubrir cómo podemos optimizar tu spa y elevar la experiencia de tus clientes.",
      button: "Agendar consulta"
    },
    en: {
      title: "Ready to transform your wellness business?",
      description: "Schedule a free consultation to discover how we can optimize your spa and elevate your customers' experience.",
      button: "Book consultation"
    }
  };

  return (
    <section className="py-16 md:py-20 bg-turquoise text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-2/3">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              {content[language].title}
            </h2>
            <p className="text-white/90 text-lg">
              {content[language].description}
            </p>
          </div>
          <div>
            <a href="#contact" className="inline-block bg-white text-turquoise-dark hover:bg-gray-100 transition-colors font-medium px-8 py-3 rounded">
              {content[language].button}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
