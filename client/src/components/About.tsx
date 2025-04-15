import { motion } from 'framer-motion';
import evaProfileImage from '../assets/eva-perez-profile.jpg';
import evaSpeakingImage from '../assets/eva-perez-speaking.jpg';

const About = () => {
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
                <p className="text-sm text-center mt-2 text-charcoal-light italic">Eva Pérez durante una conferencia sobre gestión de spas</p>
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
            <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">Sobre mí</h2>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Eva Pérez: Spa Manager y Consultora de Wellness
            </h3>
            
            <p className="text-charcoal-light mb-6">
              Con más de 20 años de experiencia en el sector del wellness y la gestión de spas, he dedicado mi carrera a transformar espacios de bienestar en experiencias rentables y memorables.
            </p>
            
            <p className="text-charcoal-light mb-6">
              Mi enfoque integral abarca desde la optimización de operaciones y formación de equipos hasta el diseño de experiencias únicas para el cliente y la implementación de estrategias de rentabilidad.
            </p>
            
            <p className="text-charcoal-light mb-6">
              Además, como ponente internacional, comparto regularmente mi conocimiento en conferencias y eventos del sector, donde transmito las mejores prácticas y tendencias en gestión de spas y bienestar.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">20+</div>
                <p className="text-sm text-charcoal-light">Años de experiencia en el sector</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">50+</div>
                <p className="text-sm text-charcoal-light">Proyectos exitosos completados</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">30+</div>
                <p className="text-sm text-charcoal-light">Conferencias impartidas</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">200+</div>
                <p className="text-sm text-charcoal-light">Profesionales formados</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">15+</div>
                <p className="text-sm text-charcoal-light">Países donde he trabajado</p>
              </div>
              <div>
                <div className="text-turquoise text-3xl font-playfair font-bold">5K+</div>
                <p className="text-sm text-charcoal-light">Asistentes a conferencias</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#contact" className="text-turquoise font-medium hover:text-turquoise-dark transition-colors">
                <span>Contactar</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
              <a href="#portfolio" className="text-charcoal-light font-medium hover:text-turquoise transition-colors">
                <span>Ver Portfolio</span>
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
