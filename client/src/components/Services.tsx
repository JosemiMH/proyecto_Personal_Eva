import { useState } from 'react';
import { motion } from 'framer-motion';
import { services } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceModal from './ServiceModal';

const Services = () => {
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
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
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('services.title')}</h2>
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
            {t('services.subtitle')}
          </h3>
          <p className="text-charcoal-light">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow hover-scale"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-turquoise/10 rounded-full flex items-center justify-center mb-6">
                <i className={`fas ${service.icon} text-turquoise text-2xl`}></i>
              </div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-4">
                {typeof service.title === 'object' ? service.title[language] : service.title}
              </h4>
              <p className="text-charcoal-light mb-4 line-clamp-3">
                {typeof service.description === 'object' ? service.description[language] : service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {(typeof service.features === 'object' ?
                  service.features[language] :
                  service.features
                ).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <i className="fas fa-check text-turquoise mt-1 mr-2"></i>
                    <span className="text-sm text-charcoal-light">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleOpenModal(service)}
                className="text-turquoise hover:text-turquoise-dark font-medium text-sm flex items-center"
              >
                {t('services.moreInfo')} <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </section>
  );
};

export default Services;
