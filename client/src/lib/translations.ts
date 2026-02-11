// Definición de tipos para las traducciones
export type Language = 'es' | 'en';

export type TranslationKey =
  | 'header.about'
  | 'header.services'
  | 'header.ai'
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
  | 'portfolio.all'
  | 'portfolio.consulting'
  | 'portfolio.projects'
  | 'portfolio.training'
  | 'portfolio.interim'
  | 'testimonials.title'
  | 'testimonials.subtitle'
  | 'testimonials.description'
  | 'blog.title'
  | 'blog.subtitle'
  | 'blog.description'
  | 'blog.readArticle'
  | 'blog.viewAll'
  | 'blog.readMore'
  | 'resources.title'
  | 'resources.subtitle'
  | 'resources.download'
  | 'newsletter.title'
  | 'newsletter.subtitle'
  | 'newsletter.subscribe'
  | 'newsletter.sending'
  | 'newsletter.leadMagnetTitle'
  | 'newsletter.leadMagnetSubtitle'
  | 'newsletter.downloadButton'
  | 'header.bookAudit'
  | 'hero.ctaPrimary'
  | 'hero.ctaSecondary'
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
  | 'footer.design'

  // Booking keys
  | 'booking.title'
  | 'booking.subtitle'
  | 'booking.selectDate'
  | 'booking.chooseDay'
  | 'booking.weekendUnavailable'
  | 'booking.selectTime'
  | 'booking.availableTimes'
  | 'booking.noSlots'
  | 'booking.back'
  | 'booking.complete'
  | 'booking.details'
  | 'booking.fullName'
  | 'booking.namePlaceholder'
  | 'booking.email'
  | 'booking.emailPlaceholder'
  | 'booking.phone'
  | 'booking.phonePlaceholder'
  | 'booking.company'
  | 'booking.companyPlaceholder'
  | 'booking.service'
  | 'booking.selectService'
  | 'booking.message'
  | 'booking.messagePlaceholder'
  | 'booking.privacy'
  | 'booking.privacyDesc'
  | 'booking.confirm'
  | 'booking.sending'
  | 'booking.successTitle'
  | 'booking.successDesc'
  | 'booking.errorTitle'
  | 'booking.errorDesc'
  | 'booking.fetchError'
  | 'booking.val.name'
  | 'booking.val.email'
  | 'booking.val.service'
  | 'booking.val.privacy'

  // ChatBot keys
  | 'chatbot.welcome'
  | 'chatbot.error'
  | 'chatbot.placeholder'
  | 'chatbot.send'
  | 'chatbot.typing'
  | 'chatbot.title'
  | 'chatbot.subtitle'
  | 'chatbot.suggestions'
  | 'chatbot.disclaimer'

  // Audit Modal
  | 'audit.title'
  | 'audit.subtitle'
  | 'audit.description'
  | 'audit.name'
  | 'audit.email'
  | 'audit.phone'
  | 'audit.hotel'
  | 'audit.challenge'
  | 'audit.submit'
  | 'audit.success';

// Definición de las traducciones
export const translations: Record<Language, Record<TranslationKey, string>> = {
  es: {
    'header.about': 'Sobre mí',
    'header.services': 'Servicios',
    'header.ai': 'IA para Wellness',
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
    'newsletter.leadMagnetTitle': 'Descarga GRATIS la Guía de Rentabilidad',
    'newsletter.leadMagnetSubtitle': 'Descubre los 10 puntos críticos para aumentar el margen de tu spa en 30 días. Incluye plantilla de auditoría.',
    'newsletter.downloadButton': 'Descargar Guía Ahora',
    'header.bookAudit': 'Solicitar Auditoría',
    'hero.ctaPrimary': 'Mejorar mi Spa Ahora',
    'hero.ctaSecondary': 'Ver Casos de Éxito',

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

    'booking.title': 'Reserva una consulta con Eva',
    'booking.subtitle': 'Selecciona una fecha y hora para tu consulta personalizada',
    'booking.selectDate': 'Selecciona una fecha',
    'booking.chooseDay': 'Elige el día para tu consulta',
    'booking.weekendUnavailable': 'Los fines de semana no están disponibles para reservas.',
    'booking.selectTime': 'Selecciona una hora',
    'booking.availableTimes': 'Horarios disponibles para el',
    'booking.noSlots': 'No hay horarios disponibles para esta fecha. Por favor, selecciona otro día.',
    'booking.back': 'Volver',
    'booking.complete': 'Completa tu reserva',
    'booking.details': 'Reservando para el',
    'booking.fullName': 'Nombre completo',
    'booking.namePlaceholder': 'Tu nombre',
    'booking.email': 'Email',
    'booking.emailPlaceholder': 'tu@email.com',
    'booking.phone': 'Teléfono (opcional)',
    'booking.phonePlaceholder': 'Tu teléfono',
    'booking.company': 'Empresa (opcional)',
    'booking.companyPlaceholder': 'Tu empresa',
    'booking.service': 'Servicio',
    'booking.selectService': 'Selecciona un servicio',
    'booking.message': 'Mensaje (opcional)',
    'booking.messagePlaceholder': 'Cuéntanos brevemente sobre tu proyecto o consulta',
    'booking.privacy': 'Acepto la política de privacidad',
    'booking.privacyDesc': 'Al marcar esta casilla, aceptas nuestra política de privacidad.',
    'booking.confirm': 'Confirmar reserva',
    'booking.sending': 'Enviando...',
    'booking.successTitle': '¡Reserva completada!',
    'booking.successDesc': 'Tu cita ha sido reservada correctamente. Recibirás un email de confirmación.',
    'booking.errorTitle': 'Error en la reserva',
    'booking.errorDesc': 'No se pudo completar la reserva. Por favor, inténtalo de nuevo.',
    'booking.fetchError': 'No se pudieron cargar los horarios disponibles',
    'booking.val.name': 'El nombre debe tener al menos 2 caracteres',
    'booking.val.email': 'Por favor introduce un email válido',
    'booking.val.service': 'Por favor selecciona un servicio',
    'booking.val.privacy': 'Debes aceptar la política de privacidad',

    'chatbot.welcome': '¡Hola! Soy el asistente virtual de Eva Pérez. ¿En qué estás interesado?',
    'chatbot.error': 'Lo siento, estoy teniendo problemas para conectarme.',
    'chatbot.placeholder': 'Escribe tu mensaje...',
    'chatbot.send': 'Enviar',
    'chatbot.typing': 'Escribiendo...',
    'chatbot.title': 'Asistente Virtual',
    'chatbot.subtitle': 'Experta en estrategia wellness',
    'chatbot.suggestions': 'Puedes preguntar sobre:',
    'chatbot.disclaimer': 'Potenciado por IA para información general.',

    // Audit Modal
    'audit.title': 'Solicitar Auditoría Gratuita',
    'audit.subtitle': 'Descubre el potencial oculto de tu spa',
    'audit.description': 'Déjame tus datos y analizaremos juntos cómo transformar tu área wellness en un motor de rentabilidad.',
    'audit.name': 'Nombre completo',
    'audit.email': 'Email corporativo',
    'audit.phone': 'WhatsApp / Teléfono',
    'audit.hotel': 'Nombre del Hotel / Spa',
    'audit.challenge': 'Principal desafío actual',
    'audit.submit': 'Solicitar Auditoría',
    'audit.success': '¡Solicitud recibida! Te contactaré en breve.',
  },
  en: {
    'header.about': 'About me',
    'header.services': 'Services',
    'header.ai': 'AI for Wellness',
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
    'newsletter.leadMagnetTitle': 'Download FREE Profitability Guide',
    'newsletter.leadMagnetSubtitle': 'Discover 10 critical points to increase your spa margin in 30 days. Includes audit template.',
    'newsletter.downloadButton': 'Download Guide Now',
    'header.bookAudit': 'Request Audit',
    'hero.ctaPrimary': 'Improve my Spa Now',
    'hero.ctaSecondary': 'View Success Stories',

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

    'booking.title': 'Book a consultation with Eva',
    'booking.subtitle': 'Select a date and time for your personalized consultation',
    'booking.selectDate': 'Select a date',
    'booking.chooseDay': 'Choose the day for your consultation',
    'booking.weekendUnavailable': 'Weekends are not available for bookings.',
    'booking.selectTime': 'Select a time',
    'booking.availableTimes': 'Available times for',
    'booking.noSlots': 'No available times for this date. Please select another day.',
    'booking.back': 'Back',
    'booking.complete': 'Complete your booking',
    'booking.details': 'Booking for',
    'booking.fullName': 'Full name',
    'booking.namePlaceholder': 'Your name',
    'booking.email': 'Email',
    'booking.emailPlaceholder': 'your@email.com',
    'booking.phone': 'Phone (optional)',
    'booking.phonePlaceholder': 'Your phone',
    'booking.company': 'Company (optional)',
    'booking.companyPlaceholder': 'Your company',
    'booking.service': 'Service',
    'booking.selectService': 'Select a service',
    'booking.message': 'Message (optional)',
    'booking.messagePlaceholder': 'Tell us briefly about your project or inquiry',
    'booking.privacy': 'I accept the privacy policy',
    'booking.privacyDesc': 'By checking this box, you agree to our privacy policy.',
    'booking.confirm': 'Confirm booking',
    'booking.sending': 'Sending...',
    'booking.successTitle': 'Booking completed!',
    'booking.successDesc': 'Your appointment has been booked successfully. You will receive a confirmation email.',
    'booking.errorTitle': 'Booking error',
    'booking.errorDesc': 'Could not complete the booking. Please try again.',
    'booking.fetchError': 'Could not load available time slots',
    'booking.val.name': 'Name must be at least 2 characters',
    'booking.val.email': 'Please enter a valid email address',
    'booking.val.service': 'Please select a service',
    'booking.val.privacy': 'You must accept the privacy policy',

    'chatbot.welcome': 'Hello! I am Eva Pérez\'s virtual assistant. What are you interested in?',
    'chatbot.error': 'I\'m sorry, I\'m having connection issues.',
    'chatbot.placeholder': 'Type your message...',
    'chatbot.send': 'Send',
    'chatbot.typing': 'Typing...',
    'chatbot.title': 'Virtual Assistant',
    'chatbot.subtitle': 'Wellness strategy expert',
    'chatbot.suggestions': 'You can ask about:',
    'chatbot.disclaimer': 'Powered by AI for general information.',

    // Audit Modal
    'audit.title': 'Request Free Audit',
    'audit.subtitle': 'Discover your spa\'s hidden potential',
    'audit.description': 'Leave your details and we will analyze together how to transform your wellness area into a profitability engine.',
    'audit.name': 'Full name',
    'audit.email': 'Work email',
    'audit.phone': 'WhatsApp / Phone',
    'audit.hotel': 'Hotel / Spa Name',
    'audit.challenge': 'Main current challenge',
    'audit.submit': 'Request Audit',
    'audit.success': 'Request received! I will contact you shortly.',
  }
};