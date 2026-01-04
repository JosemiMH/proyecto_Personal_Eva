import { Link } from 'wouter';
import { FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();

  return (
    <footer className="bg-charcoal-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-playfair text-2xl font-bold text-white mb-4">Eva Pérez</div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {language === 'es'
                ? 'Más de 20 años transformando espacios de bienestar en experiencias memorables y rentables.'
                : 'Over 20 years transforming wellness spaces into memorable and profitable experiences.'}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/evaperez-spa-consultant/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-turquoise transition-colors w-10 h-10 flex items-center justify-center bg-charcoal rounded-full hover:bg-opacity-80"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-medium text-white mb-4">
              {language === 'es' ? 'Enlaces rápidos' : 'Quick Links'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-turquoise transition-colors">{t('header.about')}</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-turquoise transition-colors">{t('header.services')}</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-turquoise transition-colors">{t('header.portfolio')}</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-turquoise transition-colors">{t('header.testimonials')}</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-turquoise transition-colors">{t('header.blog')}</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-turquoise transition-colors">{t('header.contact')}</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-medium text-white mb-4">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <FaEnvelope className="text-turquoise mt-1 mr-3 flex-shrink-0" />
                <a href="mailto:epm@epmwellness.com" className="text-gray-400 hover:text-turquoise transition-colors">
                  epm@epmwellness.com
                </a>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-turquoise mt-1 mr-3 flex-shrink-0" />
                <a href="tel:+34676462991" className="text-gray-400 hover:text-turquoise transition-colors">
                  +34 676 462 991
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-turquoise mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  {language === 'es' ? 'Madrid, España' : 'Madrid, Spain'}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <hr className="border-gray-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-4 md:mb-0">
            &copy; {currentYear} Eva Pérez. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-turquoise text-xs transition-colors">
              {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-turquoise text-xs transition-colors">
              {language === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'}
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-turquoise text-xs transition-colors">
              {language === 'es' ? 'Cookies' : 'Cookies'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
