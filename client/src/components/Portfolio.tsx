import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioItems } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectModal from './ProjectModal';

type FilterCategory = 'all' | 'paradores' | 'eurostars' | 'hg' | 'melia' | 'axel' | 'independientes';

const Portfolio = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Filter by chain instead of category
  const filteredItems = portfolioItems.filter(item =>
    activeFilter === 'all' || item.chain === activeFilter
  );

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

        {/* Statistics Banner */}
        <motion.div
          className="bg-gradient-to-r from-turquoise/10 to-turquoise/5 rounded-lg p-6 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <div className="text-4xl font-bold text-turquoise mb-1">40+</div>
              <div className="text-sm text-charcoal-light">{language === 'es' ? 'Proyectos Completados' : 'Completed Projects'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-turquoise mb-1">6</div>
              <div className="text-sm text-charcoal-light">{language === 'es' ? 'Cadenas Hoteleras' : 'Hotel Chains'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-turquoise mb-1">20+</div>
              <div className="text-sm text-charcoal-light">{language === 'es' ? 'Años de Experiencia' : 'Years of Experience'}</div>
            </div>
          </div>
        </motion.div>

        <div className="flex mb-10 justify-center">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              className={`px-4 py-2 ${activeFilter === 'all' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('all')}
            >
              {t('portfolio.all')}
            </button>
            <button
              className={`px-4 py-2 ${activeFilter === 'paradores' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('paradores')}
            >
              Paradores
            </button>
            <button
              className={`px-4 py-2 ${activeFilter === 'eurostars' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('eurostars')}
            >
              Eurostars
            </button>
            <button
              className={`px-4 py-2 ${activeFilter === 'hg' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('hg')}
            >
              HG Hotels
            </button>
            <button
              className={`px-4 py-2 ${activeFilter === 'melia' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('melia')}
            >
              Meliá
            </button>
            <button
              className={`px-4 py-2 ${activeFilter === 'axel' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('axel')}
            >
              AXEL
            </button>
            <button
              className={`px-4 py-2 ${activeFilter === 'independientes' ? 'bg-turquoise text-white' : 'bg-gray-100 text-charcoal hover:bg-turquoise/10'} rounded-full text-sm font-medium transition-colors whitespace-nowrap`}
              onClick={() => setActiveFilter('independientes')}
            >
              {language === 'es' ? 'Independientes' : 'Independent'}
            </button>
          </div>
        </div>

        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={index}
              className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="relative h-64">
                <img
                  src={item.image}
                  alt={typeof item.title === 'object' ? item.title[language] : ""}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4">
                    <span className="text-xs font-medium bg-turquoise text-white px-2 py-1 rounded">
                      {typeof item.categoryName === 'object' ? item.categoryName[language] : item.categoryName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">
                  {typeof item.title === 'object' ? item.title[language] : item.title}
                </h4>
                <p className="text-charcoal-light text-sm mb-4 line-clamp-3">
                  {typeof item.description === 'object' ? item.description[language] : item.description}
                </p>
                <button
                  onClick={() => handleOpenModal(item)}
                  className="text-turquoise hover:text-turquoise-dark font-medium text-sm flex items-center"
                >
                  {t('portfolio.viewCase')} <i className="fas fa-arrow-right ml-1"></i>
                </button>
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

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </section>
  );
};

export default Portfolio;
