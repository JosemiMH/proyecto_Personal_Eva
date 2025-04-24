import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioItems } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';

type FilterCategory = 'all' | 'consultoria' | 'proyectos' | 'formacion' | 'interim';

const Portfolio = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="portfolio" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('portfolio.title')}</h2>
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
            {t('portfolio.subtitle')}
          </h3>
          <p className="text-charcoal-light">
            {t('portfolio.description')}
          </p>
        </motion.div>
        
        <div className="flex mb-10 justify-center">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button 
              className={`px-4 py-2 ${activeFilter === 'all' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors`}
              onClick={() => setActiveFilter('all')}
            >
              {t('portfolio.all')}
            </button>
            <button 
              className={`px-4 py-2 ${activeFilter === 'consultoria' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors`}
              onClick={() => setActiveFilter('consultoria')}
            >
              {t('portfolio.consulting')}
            </button>
            <button 
              className={`px-4 py-2 ${activeFilter === 'proyectos' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors`}
              onClick={() => setActiveFilter('proyectos')}
            >
              {t('portfolio.projects')}
            </button>
            <button 
              className={`px-4 py-2 ${activeFilter === 'formacion' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors`}
              onClick={() => setActiveFilter('formacion')}
            >
              {t('portfolio.training')}
            </button>
            <button 
              className={`px-4 py-2 ${activeFilter === 'interim' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors`}
              onClick={() => setActiveFilter('interim')}
            >
              {t('portfolio.interim')}
            </button>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="group rounded-lg overflow-hidden shadow-md hover-scale"
              variants={itemVariants}
            >
              <div className="relative h-64">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4">
                    <span className="text-xs font-medium bg-turquoise text-white px-2 py-1 rounded">{item.categoryName[language]}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">{item.title}</h4>
                <p className="text-charcoal-light text-sm mb-4">{item.description[language]}</p>
                <a href="#" className="text-turquoise hover:text-turquoise-dark font-medium text-sm">
                  {t('portfolio.viewCase')} <i className="fas fa-arrow-right ml-1"></i>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <a href="#" className="inline-block px-8 py-3 border border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-colors rounded font-medium">
            {t('portfolio.viewMore')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
