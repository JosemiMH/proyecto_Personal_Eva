import { motion } from 'framer-motion';
import { resources } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { generatePdf } from '@/lib/pdfGenerator';

const Resources = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const handleDownload = (resource: any) => {
    toast({
      title: language === 'es' ? "Generando PDF..." : "Generating PDF...",
      description: language === 'es'
        ? `Tu descarga comenzará en breve.`
        : `Your download will start shortly.`,
    });

    if (resource.resourceType) {
      generatePdf(resource.resourceType, language as 'es' | 'en');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('resources.title')}</h2>
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
            {t('resources.subtitle')}
          </h3>
          <p className="text-charcoal-light">
            {language === 'es'
              ? 'Descarga guías y recursos gratuitos para mejorar la gestión de tu spa y la experiencia de tus clientes.'
              : 'Download free guides and resources to improve your spa management and enhance your client experience.'}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover-scale flex flex-col h-full"
              variants={itemVariants}
            >
              <img
                src={resource.image}
                alt={typeof resource.title === 'object' ? resource.title[language] : resource.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">
                  {typeof resource.title === 'object' ? resource.title[language] : resource.title}
                </h4>
                <p className="text-charcoal-light text-sm mb-4 flex-grow">
                  {typeof resource.description === 'object' ? resource.description[language] : resource.description}
                </p>
                <button
                  className="block w-full bg-turquoise hover:bg-turquoise-dark text-white text-center font-medium py-2 rounded transition-colors mt-auto"
                  onClick={() => handleDownload(resource)}
                >
                  {typeof resource.buttonText === 'object' ? resource.buttonText[language] : resource.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Resources;
