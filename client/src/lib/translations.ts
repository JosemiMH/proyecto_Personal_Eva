// Definición de tipos para las traducciones
export type Language = 'es' | 'en';

export type TranslationKey = 
  | 'header.about'
  | 'header.services'
  | 'header.portfolio'
  | 'header.testimonials'
  | 'header.blog'
  | 'header.contact'
  | 'about.title'
  | 'about.subtitle'
  | 'about.experience'
  | 'about.approach'
  | 'about.speaker'
  | 'about.stats.years'
  | 'about.stats.projects'
  | 'about.stats.conferences'
  | 'about.stats.trained'
  | 'about.stats.countries'
  | 'about.stats.attendees'
  | 'about.contact'
  | 'about.portfolio'
  | 'about.speakingCaption'
  | 'services.title'
  | 'services.subtitle'
  | 'services.moreInfo'
  | 'services.strategy.title'
  | 'services.strategy.description'
  | 'services.projects.title'
  | 'services.projects.description'
  | 'services.training.title'
  | 'services.training.description'
  | 'services.interim.title'
  | 'services.interim.description'
  | 'portfolio.title'
  | 'portfolio.subtitle'
  | 'portfolio.description'
  | 'portfolio.viewCase'
  | 'portfolio.viewMore'
  | 'testimonials.title'
  | 'testimonials.subtitle'
  | 'testimonials.description'
  | 'blog.title'
  | 'blog.subtitle'
  | 'blog.description'
  | 'blog.readArticle'
  | 'blog.viewAll'
  | 'portfolio.all'
  | 'portfolio.consulting'
  | 'portfolio.projects'
  | 'portfolio.training'
  | 'portfolio.interim'
  | 'resources.title'
  | 'resources.subtitle'
  | 'resources.download'
  | 'newsletter.title'
  | 'newsletter.subtitle'
  | 'newsletter.subscribe'
  | 'newsletter.sending'
  | 'contact.title'
  | 'contact.subtitle'
  | 'contact.description'
  | 'contact.email'
  | 'contact.phone'
  | 'contact.location'
  | 'contact.form.name'
  | 'contact.form.email'
  | 'contact.form.company'
  | 'contact.form.service'
  | 'contact.form.message'
  | 'contact.form.privacy'
  | 'contact.form.send'
  | 'contact.form.sending'
  | 'footer.rights'
  | 'footer.design';

// Definición de las traducciones
export const translations: Record<Language, Record<TranslationKey, string>> = {
  es: {
    'header.about': 'Sobre mí',
    'header.services': 'Servicios',
    'header.portfolio': 'Portfolio',
    'header.testimonials': 'Testimonios',
    'header.blog': 'Blog',
    'header.contact': 'Contacto',
    
    'about.title': 'Sobre mí',
    'about.subtitle': 'Eva Pérez: Spa Manager y Consultora de Wellness',
    'about.experience': 'Con más de 20 años de experiencia en el sector del wellness y la gestión de spas, he dedicado mi carrera a transformar espacios de bienestar en experiencias rentables y memorables.',
    'about.approach': 'Mi enfoque integral abarca desde la optimización de operaciones y formación de equipos hasta el diseño de experiencias únicas para el cliente y la implementación de estrategias de rentabilidad.',
    'about.speaker': 'Además, como ponente internacional, comparto regularmente mi conocimiento en conferencias y eventos del sector, donde transmito las mejores prácticas y tendencias en gestión de spas y bienestar.',
    'about.stats.years': 'Años de experiencia en el sector',
    'about.stats.projects': 'Proyectos exitosos completados',
    'about.stats.conferences': 'Conferencias impartidas',
    'about.stats.trained': 'Profesionales formados',
    'about.stats.countries': 'Países donde he trabajado',
    'about.stats.attendees': 'Asistentes a conferencias',
    'about.contact': 'Contactar',
    'about.portfolio': 'Ver Portfolio',
    'about.speakingCaption': 'Eva Pérez durante una conferencia sobre gestión de spas',
    
    'services.title': 'Servicios',
    'services.subtitle': 'Soluciones Profesionales para el Sector Wellness',
    'services.moreInfo': 'Más información',
    'services.strategy.title': 'Consultoría Estratégica',
    'services.strategy.description': 'Análisis y diagnóstico de operaciones, desarrollo de planes estratégicos y asesoramiento para optimizar la rentabilidad de tu negocio wellness.',
    'services.projects.title': 'Gestión de Proyectos',
    'services.projects.description': 'Dirección integral en la creación o renovación de spas, desde la conceptualización hasta la implementación y puesta en marcha.',
    'services.training.title': 'Formación y Desarrollo',
    'services.training.description': 'Programas de capacitación a medida para equipos de trabajo en spas, enfocados en protocolos, ventas, servicio y gestión.',
    'services.interim.title': 'Interim Management',
    'services.interim.description': 'Dirección temporal de spas y centros wellness durante periodos de transición o para implementar proyectos específicos de mejora.',
    
    'portfolio.title': 'Portfolio',
    'portfolio.subtitle': 'Proyectos y Colaboraciones Destacadas',
    'portfolio.description': 'Una selección de casos de éxito que demuestran mi enfoque para transformar espacios wellness y optimizar su funcionamiento.',
    'portfolio.viewCase': 'Ver caso completo',
    'portfolio.viewMore': 'Ver más proyectos',
    'portfolio.all': 'Todos',
    'portfolio.consulting': 'Consultoría',
    'portfolio.projects': 'Proyectos',
    'portfolio.training': 'Formación',
    'portfolio.interim': 'Interim',
    
    'testimonials.title': 'Testimonios',
    'testimonials.subtitle': 'Lo que dicen mis clientes',
    'testimonials.description': 'Descubre cómo mis servicios han transformado negocios wellness y equipos profesionales.',
    
    'blog.title': 'Blog',
    'blog.subtitle': 'Últimos artículos y novedades',
    'blog.description': 'Artículos especializados sobre gestión de spas, tendencias del sector wellness y estrategias de optimización.',
    'blog.readArticle': 'Leer artículo',
    'blog.viewAll': 'Ver todos los artículos',
    'blog.readMore': 'Leer más',
    
    'resources.title': 'Recursos',
    'resources.subtitle': 'Herramientas y guías para profesionales del sector',
    'resources.download': 'Descargar',
    
    'newsletter.title': 'Suscríbete a mi newsletter',
    'newsletter.subtitle': 'Recibe mensualmente contenido exclusivo, consejos y las últimas tendencias en gestión de spas.',
    'newsletter.subscribe': 'Suscribirme',
    'newsletter.sending': 'Enviando...',
    
    'contact.title': 'Contacto',
    'contact.subtitle': '¿Hablamos sobre tu proyecto?',
    'contact.description': 'Completa el formulario y me pondré en contacto contigo para programar una consulta inicial gratuita donde podremos hablar sobre tus necesidades específicas.',
    'contact.email': 'Email',
    'contact.phone': 'Teléfono',
    'contact.location': 'Ubicación',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Email',
    'contact.form.company': 'Empresa/Organización',
    'contact.form.service': 'Servicio de interés',
    'contact.form.message': 'Mensaje',
    'contact.form.privacy': 'Acepto la política de privacidad y el tratamiento de mis datos para recibir comunicaciones.',
    'contact.form.send': 'Enviar mensaje',
    'contact.form.sending': 'Enviando...',
    
    'footer.rights': 'Todos los derechos reservados',
    'footer.design': 'Diseñado con',
  },
  en: {
    'header.about': 'About me',
    'header.services': 'Services',
    'header.portfolio': 'Portfolio',
    'header.testimonials': 'Testimonials',
    'header.blog': 'Blog',
    'header.contact': 'Contact',
    
    'about.title': 'About me',
    'about.subtitle': 'Eva Pérez: Spa Manager & Wellness Consultant',
    'about.experience': 'With over 20 years of experience in the wellness sector and spa management, I have dedicated my career to transforming wellness spaces into profitable and memorable experiences.',
    'about.approach': 'My comprehensive approach ranges from operations optimization and team training to designing unique customer experiences and implementing profitability strategies.',
    'about.speaker': 'Additionally, as an international speaker, I regularly share my knowledge at conferences and industry events, where I convey best practices and trends in spa management and wellness.',
    'about.stats.years': 'Years of industry experience',
    'about.stats.projects': 'Successful projects completed',
    'about.stats.conferences': 'Conferences delivered',
    'about.stats.trained': 'Professionals trained',
    'about.stats.countries': 'Countries where I\'ve worked',
    'about.stats.attendees': 'Conference attendees',
    'about.contact': 'Contact me',
    'about.portfolio': 'View Portfolio',
    'about.speakingCaption': 'Eva Pérez during a conference on spa management',
    
    'services.title': 'Services',
    'services.subtitle': 'Professional Solutions for the Wellness Sector',
    'services.moreInfo': 'More information',
    'services.strategy.title': 'Strategic Consulting',
    'services.strategy.description': 'Operations analysis and diagnosis, strategic plan development, and advisory services to optimize the profitability of your wellness business.',
    'services.projects.title': 'Project Management',
    'services.projects.description': 'Comprehensive management in the creation or renovation of spas, from conceptualization to implementation and launch.',
    'services.training.title': 'Training & Development',
    'services.training.description': 'Tailored training programs for spa teams, focused on protocols, sales, service, and management.',
    'services.interim.title': 'Interim Management',
    'services.interim.description': 'Temporary management of spas and wellness centers during transition periods or to implement specific improvement projects.',
    
    'portfolio.title': 'Portfolio',
    'portfolio.subtitle': 'Featured Projects and Collaborations',
    'portfolio.description': 'A selection of success cases that demonstrate my approach to transforming wellness spaces and optimizing their operation.',
    'portfolio.viewCase': 'View full case',
    'portfolio.viewMore': 'View more projects',
    'portfolio.all': 'All',
    'portfolio.consulting': 'Consulting',
    'portfolio.projects': 'Projects',
    'portfolio.training': 'Training',
    'portfolio.interim': 'Interim',
    
    'testimonials.title': 'Testimonials',
    'testimonials.subtitle': 'What my clients say',
    'testimonials.description': 'Discover how my services have transformed wellness businesses and professional teams.',
    
    'blog.title': 'Blog',
    'blog.subtitle': 'Latest articles and news',
    'blog.description': 'Specialized articles on spa management, wellness industry trends, and optimization strategies.',
    'blog.readArticle': 'Read article',
    'blog.viewAll': 'View all articles',
    'blog.readMore': 'Read more',
    
    'resources.title': 'Resources',
    'resources.subtitle': 'Tools and guides for industry professionals',
    'resources.download': 'Download',
    
    'newsletter.title': 'Subscribe to my newsletter',
    'newsletter.subtitle': 'Receive monthly exclusive content, tips, and the latest trends in spa management.',
    'newsletter.subscribe': 'Subscribe',
    'newsletter.sending': 'Sending...',
    
    'contact.title': 'Contact',
    'contact.subtitle': 'Let\'s talk about your project',
    'contact.description': 'Fill out the form and I will contact you to schedule a free initial consultation where we can discuss your specific needs.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.company': 'Company/Organization',
    'contact.form.service': 'Service of interest',
    'contact.form.message': 'Message',
    'contact.form.privacy': 'I accept the privacy policy and the processing of my data to receive communications.',
    'contact.form.send': 'Send message',
    'contact.form.sending': 'Sending...',
    
    'footer.rights': 'All rights reserved',
    'footer.design': 'Designed with',
  }
};