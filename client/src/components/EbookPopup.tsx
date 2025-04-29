import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({
    message: 'Por favor, introduce un email válido',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EbookPopup = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Mostrar el popup después de 3 segundos
    const timer = setTimeout(() => {
      // Comprobar si el usuario ya ha cerrado el popup anteriormente
      const hasClosedPopup = localStorage.getItem('ebookPopupClosed');
      if (!hasClosedPopup) {
        setIsOpen(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Enviar el email a la API
      await apiRequest({
        path: '/api/newsletter',
        method: 'POST',
        body: { email: data.email }
      });

      setIsSuccess(true);
      
      // Mostrar toast de éxito
      toast({
        title: language === 'es' ? '¡Gracias por tu interés!' : 'Thank you for your interest!',
        description: language === 'es' 
          ? 'Hemos enviado el E-Book a tu correo electrónico' 
          : 'We have sent the E-Book to your email',
        variant: 'default',
      });

      // Simular descarga después de 1 segundo
      setTimeout(() => {
        // En un entorno real, aquí redirigirías a la URL real de descarga
        const link = document.createElement('a');
        link.href = '#'; // URL del PDF real aquí
        link.setAttribute('download', 'IA-Spa-Hotelero-30-dias.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cerrar el popup después de la "descarga"
        setIsOpen(false);
        // Guardar en localStorage que el usuario descargó el ebook
        localStorage.setItem('ebookPopupClosed', 'true');
      }, 1000);
    } catch (error) {
      console.error('Error al enviar el email:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es'
          ? 'Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.'
          : 'An error occurred while processing your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('ebookPopupClosed', 'true');
  };

  const popupTitle = language === 'es'
    ? 'E-Book + plantilla: Cómo implementar IA en tu spa hotelero en 30 días'
    : 'E-Book + template: How to implement AI in your hotel spa in 30 days';

  const popupDescription = language === 'es'
    ? 'Descarga esta guía práctica con los pasos concretos para comenzar a aplicar soluciones de IA en tu spa, incluyendo una plantilla de implementación lista para usar.'
    : 'Download this practical guide with concrete steps to start applying AI solutions in your spa, including a ready-to-use implementation template.';

  const buttonText = language === 'es'
    ? isSubmitting ? 'Enviando...' : 'Descargar ahora'
    : isSubmitting ? 'Sending...' : 'Download now';

  const emailPlaceholder = language === 'es'
    ? 'Tu email'
    : 'Your email';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-charcoal mb-4">
                {popupTitle}
              </h2>

              <p className="text-charcoal-light mb-6">
                {popupDescription}
              </p>

              {!isSuccess ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={emailPlaceholder}
                              type="email"
                              {...field}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-sage hover:bg-sage-dark text-white h-12 font-medium text-base"
                      disabled={isSubmitting}
                    >
                      {buttonText}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-md">
                  <p className="text-green-700 text-center">
                    {language === 'es'
                      ? '¡Gracias! Tu descarga debería comenzar automáticamente.'
                      : 'Thank you! Your download should start automatically.'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EbookPopup;