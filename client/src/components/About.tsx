import { motion } from 'framer-motion';
import evaProfileImage from '../assets/eva-perez-profile.jpg';
import evaSpeakingImage from '../assets/eva-perez-speaking.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from './OptimizedImage';
import AnimatedCounter from './AnimatedCounter';
import { ArrowRight } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();
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
                <motion.div
                  className="rounded-lg shadow-xl overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <OptimizedImage
                    src={evaProfileImage}
                    alt="Eva Pérez, Expert in Luxury Hospitality & Wellness Strategy"
                    className="w-full h-auto rounded-lg"
                    objectFit="cover"
                    priority={true}
                  />
                </motion.div>
              </div>
              <div className="md:col-span-2 mt-4">
                <motion.div
                  className="rounded-lg shadow-xl overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <OptimizedImage
                    src={evaSpeakingImage}
                    alt="Eva Pérez dando una conferencia"
                    className="w-full h-auto rounded-lg"
                    objectFit="cover"
                  />
                </motion.div>
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <AnimatedCounter end={20} suffix="+" label={t('about.stats.years')} />
              <AnimatedCounter end={50} suffix="+" label={t('about.stats.projects')} />
              <AnimatedCounter end={30} suffix="+" label={t('about.stats.conferences')} />
              <AnimatedCounter end={200} suffix="+" label={t('about.stats.trained')} />
              <AnimatedCounter end={15} suffix="+" label={t('about.stats.countries')} />
              <AnimatedCounter end={5000} label={t('about.stats.attendees')} prefix="" suffix="+" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#contact"
                className="bg-turquoise text-white px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-turquoise-dark transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t('about.contact')}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
              <motion.a
                href="#portfolio"
                className="border border-turquoise text-turquoise px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-turquoise hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t('about.portfolio')}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
