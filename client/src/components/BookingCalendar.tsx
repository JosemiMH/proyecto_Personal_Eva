import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, setHours, setMinutes, isBefore, isToday } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { formatInTimeZone } from 'date-fns-tz';

interface AvailableSlot {
  start: Date;
  end: Date;
}

const serviceOptions = [
  { value: "consultoria", label: { es: "Consultoría estratégica", en: "Strategic consulting" } },
  { value: "interim", label: { es: "Dirección interina", en: "Interim management" } },
  { value: "formacion", label: { es: "Formación especializada", en: "Specialized training" } },
  { value: "proyecto", label: { es: "Gestión de proyectos", en: "Project management" } }
];

const BookingCalendar = () => {
  const { language, t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'form'>('date');
  
  const dateLocale = language === 'es' ? es : enUS;

  // Esquema de validación del formulario
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: language === 'es' ? 'El nombre debe tener al menos 2 caracteres' : 'Name must be at least 2 characters' 
    }),
    email: z.string().email({ 
      message: language === 'es' ? 'Por favor introduce un email válido' : 'Please enter a valid email address' 
    }),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string({ 
      required_error: language === 'es' ? 'Por favor selecciona un servicio' : 'Please select a service' 
    }),
    message: z.string().optional(),
    privacy: z.boolean().refine(val => val === true, {
      message: language === 'es' ? 'Debes aceptar la política de privacidad' : 'You must accept the privacy policy',
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
      privacy: false,
    },
  });

  // Cargar slots disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (!date) return;
    
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        const result = await apiRequest<{ success: boolean; data: AvailableSlot[] }>({
          path: `/api/appointments/available?date=${date.toISOString()}`,
          method: 'GET',
        });
        
        if (result.success && result.data) {
          // Convertir strings a objetos Date
          const formattedSlots = result.data.map(slot => ({
            start: new Date(slot.start),
            end: new Date(slot.end)
          }));
          setAvailableSlots(formattedSlots);
          setStep('time');
        } else {
          toast({
            title: language === 'es' ? 'Error' : 'Error',
            description: language === 'es' 
              ? 'No se pudieron cargar los horarios disponibles' 
              : 'Could not load available time slots',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es' 
            ? 'Ocurrió un error al cargar los horarios disponibles' 
            : 'An error occurred while loading available time slots',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date, language]);

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedSlot || !date) return;
    
    setSubmitLoading(true);
    
    try {
      const appointmentData = {
        ...values,
        date: selectedSlot.start,
        duration: 60,
        status: "pending"
      };
      
      const result = await apiRequest<{ success: boolean; message: string }>({
        url: '/api/appointments',
        method: 'POST',
        data: appointmentData,
      });
      
      if (result.success) {
        toast({
          title: language === 'es' ? '¡Reserva completada!' : 'Booking completed!',
          description: language === 'es' 
            ? 'Tu cita ha sido reservada correctamente. Recibirás un email de confirmación.' 
            : 'Your appointment has been booked successfully. You will receive a confirmation email.',
        });
        
        // Reiniciar el formulario
        form.reset();
        setDate(undefined);
        setSelectedSlot(null);
        setStep('date');
      } else {
        toast({
          title: language === 'es' ? 'Error en la reserva' : 'Booking error',
          description: language === 'es' 
            ? 'No se pudo completar la reserva. Por favor, inténtalo de nuevo.' 
            : 'Could not complete the booking. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: language === 'es' ? 'Error en la reserva' : 'Booking error',
        description: language === 'es' 
          ? 'Ocurrió un error al procesar tu reserva. Por favor, inténtalo de nuevo más tarde.' 
          : 'An error occurred while processing your booking. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBackClick = () => {
    if (step === 'time') {
      setStep('date');
    } else if (step === 'form') {
      setStep('time');
    }
  };

  const isDateUnavailable = (date: Date) => {
    // No permitir fechas en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) {
      return true;
    }
    
    // No permitir reservas en días específicos (ej: fines de semana)
    const day = date.getDay();
    return day === 0 || day === 6; // 0 es domingo, 6 es sábado
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'es' ? 'Reserva una consulta con Eva' : 'Book a consultation with Eva'}
        </h2>
        <p className="text-gray-600 mb-6">
          {language === 'es' 
            ? 'Selecciona una fecha y hora para tu consulta personalizada' 
            : 'Select a date and time for your personalized consultation'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12">
            <AnimatePresence mode="wait">
              {step === 'date' && (
                <motion.div
                  key="date-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'es' ? 'Selecciona una fecha' : 'Select a date'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'es' 
                          ? 'Elige el día para tu consulta' 
                          : 'Choose the day for your consultation'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={isDateUnavailable}
                        locale={dateLocale}
                        className="rounded-md border"
                        fromDate={new Date()}
                        toDate={addDays(new Date(), 60)}
                      />
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-500">
                        {language === 'es' 
                          ? 'Los fines de semana no están disponibles para reservas.' 
                          : 'Weekends are not available for bookings.'}
                      </p>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {step === 'time' && (
                <motion.div
                  key="time-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'es' ? 'Selecciona una hora' : 'Select a time'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'es' 
                          ? `Horarios disponibles para el ${format(date!, 'PPP', { locale: dateLocale })}` 
                          : `Available times for ${format(date!, 'PPP', { locale: dateLocale })}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-turquoise"></div>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {availableSlots.map((slot, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="hover:bg-turquoise/10"
                              onClick={() => handleSlotSelect(slot)}
                            >
                              {format(slot.start, 'HH:mm')}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">
                            {language === 'es' 
                              ? 'No hay horarios disponibles para esta fecha. Por favor, selecciona otro día.' 
                              : 'No available times for this date. Please select another day.'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={handleBackClick}
                      >
                        {language === 'es' ? 'Volver' : 'Back'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {step === 'form' && selectedSlot && (
                <motion.div
                  key="form-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'es' ? 'Completa tu reserva' : 'Complete your booking'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'es' 
                          ? `Reservando para el ${format(date!, 'PPP', { locale: dateLocale })} a las ${format(selectedSlot.start, 'HH:mm')}` 
                          : `Booking for ${format(date!, 'PPP', { locale: dateLocale })} at ${format(selectedSlot.start, 'HH:mm')}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {language === 'es' ? 'Nombre completo' : 'Full name'}
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder={language === 'es' ? 'Tu nombre' : 'Your name'} {...field} />
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
                                  <FormLabel>
                                    {language === 'es' ? 'Email' : 'Email'}
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'} type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {language === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder={language === 'es' ? 'Tu teléfono' : 'Your phone'} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {language === 'es' ? 'Empresa (opcional)' : 'Company (optional)'}
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder={language === 'es' ? 'Tu empresa' : 'Your company'} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {language === 'es' ? 'Servicio' : 'Service'}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={language === 'es' ? 'Selecciona un servicio' : 'Select a service'} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {serviceOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label[language]}
                                      </SelectItem>
                                    ))}
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
                              <FormItem>
                                <FormLabel>
                                  {language === 'es' ? 'Mensaje (opcional)' : 'Message (optional)'}
                                </FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={
                                      language === 'es' 
                                        ? 'Cuéntanos brevemente sobre tu proyecto o consulta' 
                                        : 'Tell us briefly about your project or inquiry'
                                    }
                                    className="resize-none" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Separator className="my-4" />
                          
                          <FormField
                            control={form.control}
                            name="privacy"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    {language === 'es' 
                                      ? 'Acepto la política de privacidad' 
                                      : 'I accept the privacy policy'}
                                  </FormLabel>
                                  <FormDescription>
                                    {language === 'es' 
                                      ? 'Al marcar esta casilla, aceptas nuestra política de privacidad.' 
                                      : 'By checking this box, you agree to our privacy policy.'}
                                  </FormDescription>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-between pt-4">
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={handleBackClick}
                            >
                              {language === 'es' ? 'Volver' : 'Back'}
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-turquoise hover:bg-turquoise/90"
                              disabled={submitLoading}
                            >
                              {submitLoading ? (
                                <>
                                  <span className="animate-spin mr-2">⏳</span>
                                  {language === 'es' ? 'Enviando...' : 'Sending...'}
                                </>
                              ) : (
                                language === 'es' ? 'Confirmar reserva' : 'Confirm booking'
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;