import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImageEs from '@/assets/images/hero-es.png';
import heroImageEn from '@/assets/images/hero-en.jpg';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';

const Hero = () => {
  const { language, t } = useLanguage();
  const { isMobile, isTablet, isDesktop } = useDeviceDetect();

  // Seleccionar la imagen según el idioma
  const heroImage = language === 'es' ? heroImageEs : heroImageEn;

  return (
    <div className={`relative overflow-hidden ${isMobile
      ? 'h-[100dvh] pt-0 pb-0'
      : isTablet
        ? 'pt-44 pb-24'
        : 'pt-56 pb-32'
      }`}>
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 z-10 ${isMobile
          ? 'bg-gradient-to-b from-transparent via-black/10 to-black/90'
          : 'bg-gradient-to-r from-turquoise/60 to-sage/40 mix-blend-multiply'
          }`}></div>
        <div className="absolute inset-0 overflow-hidden"
          style={{
            minHeight: isMobile ? '100%' : isTablet ? '620px' : '650px',
            height: '100%'
          }}>
          <img
            src={heroImage}
            alt={language === 'es'
              ? "Eva Pérez - Experta en Estrategia de Hospitalidad y Bienestar de Lujo"
              : "Eva Pérez - Expert in Luxury Hospitality & Wellness Strategy"}
            className={`w-full h-full object-cover ${isMobile
              ? 'object-[50%_0%]'
              : isTablet
                ? 'object-[55%_-10%]'
                : 'object-[50%_-10%]'
              }`}
          />
        </div>
      </div>

      <div className={`container mx-auto relative z-20 h-full ${isMobile
        ? 'px-6 flex flex-col justify-end pb-24'
        : isTablet
          ? 'pl-6 pr-6'
          : 'pl-8 pr-8'
        }`}>
        <motion.div
          className={isMobile ? 'w-full' : isTablet ? 'max-w-md' : 'max-w-xl'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`font-playfair font-bold text-white leading-tight text-shadow ${isMobile
            ? 'text-3xl mb-3'
            : isTablet
              ? 'text-2xl md:text-3xl mb-3'
              : 'text-3xl lg:text-4xl mb-4'
            }`}>
            {language === 'es'
              ? "Asesoro a hoteles en la transformación de su área de Wellness"
              : "I advise hotels on transforming their Wellness area"}
          </h1>
          <p className={`text-white opacity-90 border-l-4 border-white/70 ${isMobile
            ? 'text-sm mb-4 pl-3'
            : isTablet
              ? 'text-base mb-3 pl-4 max-w-md'
              : 'text-lg mb-4 pl-5 max-w-lg'
            }`}>
            {language === 'es'
              ? "En un motor de crecimiento estratégico, rentable y alineado con la experiencia de lujo."
              : "Into a strategic growth engine, profitable and aligned with the luxury experience."}
          </p>
          <div className={isMobile ? 'mb-4' : isTablet ? 'mb-3' : 'mb-4'}>
            <p className={`text-white uppercase tracking-wider font-semibold ${isMobile ? 'text-xs' : 'text-sm'
              }`}>
              {language === 'es'
                ? "Experta en Estrategia de Hospitalidad y Bienestar de Lujo"
                : "Expert in Luxury Hospitality & Wellness Strategy"}
            </p>
            <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {language === 'es'
                ? "Gerente de Proyectos SPA & Wellness – Especialista en Optimización de Ingresos"
                : "SPA & Wellness Project Manager – Revenue Optimization Specialist"}
            </p>
          </div>
          <p className={`text-white opacity-80 ${isMobile
            ? 'text-xs mb-6'
            : isTablet
              ? 'text-sm mb-5 max-w-sm'
              : 'text-sm mb-6 max-w-md'
            }`}>
            {language === 'es'
              ? "Más de 20 años de experiencia optimizando operaciones, formando equipos excepcionales y elevando la satisfacción del cliente."
              : "Over 20 years of experience optimizing operations, training exceptional teams, and elevating customer satisfaction."}
          </p>
          <div className={`gap-3 ${isMobile ? 'flex flex-col w-full' : 'flex flex-row'}`}>
            <a
              href="#contact"
              className={`bg-turquoise hover:bg-turquoise-dark text-white font-medium rounded transition-colors inline-block text-center ${isMobile
                ? 'px-6 py-3 text-sm w-full'
                : isTablet
                  ? 'px-7 py-2.5 text-sm'
                  : 'px-8 py-3 text-base'
                }`}
            >
              {t('hero.ctaPrimary')}
            </a>
            <a
              href="#portfolio"
              className={`bg-white hover:bg-gray-100 text-turquoise-dark font-medium rounded transition-colors inline-block text-center ${isMobile
                ? 'px-6 py-3 text-sm w-full'
                : isTablet
                  ? 'px-7 py-2.5 text-sm'
                  : 'px-8 py-3 text-base'
                }`}
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
