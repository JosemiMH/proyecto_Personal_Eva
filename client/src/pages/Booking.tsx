import { useEffect } from 'react';
import PageTransition from "@/components/PageTransition";
import BookingCalendar from '@/components/BookingCalendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const Booking = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <motion.div
        className="min-h-screen pt-24 pb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {language === 'es' ? 'Reserva una Consulta' : 'Book a Consultation'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'es'
                ? 'Agenda una sesión personalizada con Eva Pérez para discutir tu proyecto de wellness o spa'
                : 'Schedule a personalized session with Eva Pérez to discuss your wellness or spa project'}
            </p>
          </div>

          <BookingCalendar />

          <div className="mt-12 bg-gray-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {language === 'es' ? '¿Qué esperar de la consulta?' : 'What to expect from the consultation?'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Antes de la reunión' : 'Before the meeting'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es'
                    ? 'Recibirás un correo electrónico de confirmación con un enlace para la videollamada y un cuestionario breve para comprender mejor tus necesidades.'
                    : 'You will receive a confirmation email with a video call link and a brief questionnaire to better understand your needs.'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Durante la consulta' : 'During the consultation'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es'
                    ? 'Una conversación de 60 minutos donde analizaremos tu proyecto actual, identificaremos desafíos clave y exploraremos soluciones estratégicas.'
                    : 'A 60-minute conversation where we will analyze your current project, identify key challenges, and explore strategic solutions.'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Después de la sesión' : 'After the session'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es'
                    ? 'Recibirás un resumen con las principales ideas discutidas y recomendaciones personalizadas para implementar en tu proyecto.'
                    : 'You will receive a summary with the main ideas discussed and personalized recommendations to implement in your project.'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Seguimiento' : 'Follow-up'}
                </h3>
                <p className="text-gray-600">
                  {language === 'es'
                    ? 'Tendrás acceso a una sesión de seguimiento breve por email para resolver cualquier duda adicional sobre las recomendaciones.'
                    : 'You will have access to a brief follow-up session by email to resolve any additional questions about the recommendations.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>
              {language === 'es'
                ? 'Para consultas sobre cancelaciones o cambios en tu reserva, por favor contacta directamente con nosotros por email.'
                : 'For inquiries about cancellations or changes to your booking, please contact us directly by email.'}
            </p>

            <div className="mt-8 flex justify-center">
              <Link href="/">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-5 py-2 text-turquoise border-turquoise hover:bg-turquoise/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  {language === 'es' ? 'Volver a la página principal' : 'Return to home page'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default Booking;