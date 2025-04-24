import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';

const Testimonials = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Determine slides per view based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };
    
    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const maxSlide = testimonials.length - slidesPerView;
  
  const goToSlide = (slide: number) => {
    const newSlide = Math.max(0, Math.min(slide, maxSlide));
    setCurrentSlide(newSlide);
    
    if (sliderRef.current) {
      const translateX = newSlide * -100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(${translateX}%)`;
    }
  };
  
  const goToPrev = () => goToSlide(currentSlide - 1);
  const goToNext = () => goToSlide(currentSlide + 1);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('testimonials.title')}</h2>
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
            {t('testimonials.subtitle')}
          </h3>
          <p className="text-charcoal-light">
            {t('testimonials.description')}
          </p>
        </motion.div>
        
        <div className="relative testimonial-slider overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(${-currentSlide * 100 / slidesPerView}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4`}>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  
                  <blockquote className="mb-6">
                    <p className="font-cormorant text-lg italic text-charcoal">
                      "{typeof testimonial.quote === 'object' ? testimonial.quote[language] : testimonial.quote}"
                    </p>
                  </blockquote>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-medium text-charcoal">{testimonial.name}</p>
                      <p className="text-sm text-charcoal-light">
                        {typeof testimonial.position === 'object' ? testimonial.position[language] : testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center focus:outline-none z-10 ml-2 lg:ml-6 hover:bg-gray-50"
            onClick={goToPrev}
            disabled={currentSlide === 0}
          >
            <i className="fas fa-chevron-left text-turquoise"></i>
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center focus:outline-none z-10 mr-2 lg:mr-6 hover:bg-gray-50"
            onClick={goToNext}
            disabled={currentSlide === maxSlide}
          >
            <i className="fas fa-chevron-right text-turquoise"></i>
          </button>
        </div>
        
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-turquoise' : 'bg-gray-300'}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
