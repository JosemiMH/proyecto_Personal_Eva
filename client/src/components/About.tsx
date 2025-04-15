import { motion } from 'framer-motion';
import evaProfileImage from '../assets/eva-perez-profile.jpg';
import evaSpeakingImage from '../assets/eva-perez-speaking.jpg';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <img 
                  src={evaProfileImage} 
                  alt="Eva Pérez, Spa Manager y Consultora" 
                  className="rounded-lg shadow-xl max-w-full h-auto hover-scale"
                />
              </div>
              <div className="md:col-span-2 mt-4">
                <img 
                  src={evaSpeakingImage} 
                  alt="Eva Pérez dando una conferencia" 
                  className="rounded-lg shadow-xl max-w-full h-auto hover-scale"
                />
                <p className="text-sm text-center mt-2 text-charcoal-light italic">{t('about.speakingCaption')}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('about.title')}</h2>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
              {t('about.subtitle')}
            </h3>
            
            <p className="text-charcoal-light mb-6">
              {t('about.experience')}
            </p>
            
            <p className="text-charcoal-light mb-6">
              {t('about.approach')}
            </p>
            
            <p className="text-charcoal-light mb-6">
              {t('about.speaker')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">20+</div>
                <p className="text-sm text-charcoal-light">{t('about.stats.years')}</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">50+</div>
                <p className="text-sm text-charcoal-light">{t('about.stats.projects')}</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">30+</div>
                <p className="text-sm text-charcoal-light">{t('about.stats.conferences')}</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">200+</div>
                <p className="text-sm text-charcoal-light">{t('about.stats.trained')}</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">15+</div>
                <p className="text-sm text-charcoal-light">{t('about.stats.countries')}</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">5K+</div>
                <p className="text-sm text-charcoal-light">{t('about.stats.attendees')}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#contact" className="text-turquoise font-medium hover:text-turquoise-dark transition-colors">
                <span>{t('about.contact')}</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
              <a href="#portfolio" className="text-charcoal-light font-medium hover:text-turquoise transition-colors">
                <span>{t('about.portfolio')}</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
