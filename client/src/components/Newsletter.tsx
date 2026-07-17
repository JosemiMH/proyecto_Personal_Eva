import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { Link } from 'wouter';

const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const formSchema = z.object({
    email: z.string().email({
      message: language === 'es'
        ? 'Por favor introduce un email válido'
        : 'Please enter a valid email address'
    }),
    privacy: z.boolean().refine(value => value === true, {
      message: language === 'es'
        ? 'Debes aceptar la política de privacidad'
        : 'You must accept the privacy policy',
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      privacy: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await apiRequest({
        method: 'POST',
        path: '/api/newsletter',
        body: data
      });
      trackEvent('sign_up', { method: 'newsletter' });
      trackEvent('ebook_download', { resource: 'guia-rentabilidad-spa' });

      toast({
        title: language === 'es' ? "¡Guía enviada!" : "Guide sent!",
        description: language === 'es'
          ? "Revisa tu email para descargar la Guía de Rentabilidad."
          : "Check your email to download the Profitability Guide.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: language === 'es'
          ? "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo."
          : "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-turquoise text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              {t('newsletter.leadMagnetTitle')}
            </h2>
            <p className="text-white/90">
              {t('newsletter.leadMagnetSubtitle')}
            </p>
          </div>
          <div className="md:w-1/2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder={language === 'es' ? "Tu email" : "Your email"}
                            className="flex-grow p-3 rounded border-0 focus:ring-2 focus:ring-white/50 outline-none text-gray-900 bg-white placeholder:text-gray-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-white text-turquoise-dark hover:bg-gray-100 transition-colors font-medium px-6 py-3 rounded whitespace-nowrap"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('newsletter.sending') : t('newsletter.downloadButton')}
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 border-white data-[state=checked]:bg-white data-[state=checked]:text-turquoise-dark"
                          />
                        </FormControl>
                        <p className="text-sm text-white/95">
                          {language === 'es' ? 'Acepto la ' : 'I accept the '}
                          <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
                            {language === 'es' ? 'política de privacidad' : 'privacy policy'}
                          </Link>.
                        </p>
                      </div>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
