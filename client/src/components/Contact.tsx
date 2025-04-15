import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: language === 'es' 
        ? 'El nombre debe tener al menos 2 caracteres' 
        : 'Name must have at least 2 characters' 
    }),
    email: z.string().email({ 
      message: language === 'es' 
        ? 'Por favor introduce un email válido' 
        : 'Please enter a valid email address' 
    }),
    company: z.string().optional(),
    service: z.string({ 
      required_error: language === 'es' 
        ? 'Por favor selecciona un servicio' 
        : 'Please select a service' 
    }),
    message: z.string().min(10, { 
      message: language === 'es' 
        ? 'Tu mensaje debe tener al menos 10 caracteres' 
        : 'Your message must have at least 10 characters' 
    }),
    privacy: z.boolean().refine(val => val === true, {
      message: language === 'es' 
        ? 'Debes aceptar la política de privacidad'
        : 'You must accept the privacy policy'
    }),
  });

  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      service: '',
      message: '',
      privacy: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/contact', data);
      
      toast({
        title: language === 'es' ? "Mensaje enviado" : "Message sent",
        description: language === 'es' 
          ? "Gracias por contactar. Te responderé a la brevedad." 
          : "Thank you for contacting me. I will respond shortly.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: language === 'es'
          ? "Hubo un problema al enviar el mensaje. Inténtalo nuevamente."
          : "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </h2>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
              {language === 'es' ? '¿Hablamos sobre tu proyecto?' : 'Let\'s talk about your project'}
            </h3>
            <p className="text-charcoal-light mb-8">
              {language === 'es' 
                ? 'Completa el formulario y me pondré en contacto contigo para programar una consulta inicial gratuita donde podremos hablar sobre tus necesidades específicas.'
                : 'Fill out the form and I will contact you to schedule a free initial consultation where we can discuss your specific needs.'}
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-envelope text-turquoise"></i>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">Email</h4>
                  <a href="mailto:eperez@asetrabalnearios.com" className="text-turquoise hover:text-turquoise-dark">eperez@asetrabalnearios.com</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-phone text-turquoise"></i>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">{language === 'es' ? 'Teléfono' : 'Phone'}</h4>
                  <a href="tel:+34676462991" className="text-turquoise hover:text-turquoise-dark">+34 676 462 991</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-turquoise"></i>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">{language === 'es' ? 'Ubicación' : 'Location'}</h4>
                  <p className="text-charcoal-light">
                    {language === 'es' 
                      ? 'Barcelona, España (Disponible para proyectos internacionales)'
                      : 'Barcelona, Spain (Available for international projects)'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center text-turquoise hover:bg-turquoise hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center text-turquoise hover:bg-turquoise hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center text-turquoise hover:bg-turquoise hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center text-turquoise hover:bg-turquoise hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-charcoal font-medium mb-2">
                          {language === 'es' ? 'Nombre' : 'Name'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'es' ? "Tu nombre" : "Your name"} 
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-charcoal font-medium mb-2">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder={language === 'es' ? "tu@email.com" : "your@email.com"}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="block text-charcoal font-medium mb-2">
                        {language === 'es' ? 'Empresa/Organización' : 'Company/Organization'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={language === 'es' ? "Nombre de tu empresa" : "Your company name"} 
                          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="block text-charcoal font-medium mb-2">
                        {language === 'es' ? 'Servicio de interés' : 'Service of interest'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors">
                            <SelectValue placeholder={language === 'es' ? "Selecciona un servicio" : "Select a service"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="consultoria">
                            {language === 'es' ? 'Consultoría Estratégica' : 'Strategic Consulting'}
                          </SelectItem>
                          <SelectItem value="proyectos">
                            {language === 'es' ? 'Gestión de Proyectos' : 'Project Management'}
                          </SelectItem>
                          <SelectItem value="formacion">
                            {language === 'es' ? 'Formación y Desarrollo' : 'Training and Development'}
                          </SelectItem>
                          <SelectItem value="interim">
                            {language === 'es' ? 'Interim Management' : 'Interim Management'}
                          </SelectItem>
                          <SelectItem value="otro">
                            {language === 'es' ? 'Otro' : 'Other'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="block text-charcoal font-medium mb-2">
                        {language === 'es' ? 'Mensaje' : 'Message'}
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={language === 'es' ? "Cuéntame sobre tu proyecto o necesidad" : "Tell me about your project or need"} 
                          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors" 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex items-start mb-6">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="mt-1 mr-2" 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-charcoal-light">
                          {language === 'es' 
                            ? 'Acepto la política de privacidad y el tratamiento de mis datos para recibir comunicaciones.'
                            : 'I accept the privacy policy and the processing of my data to receive communications.'}
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-3 rounded transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (language === 'es' ? 'Enviando...' : 'Sending...') 
                    : (language === 'es' ? 'Enviar mensaje' : 'Send message')}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;