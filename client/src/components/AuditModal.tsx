import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";

interface AuditModalProps {
    children: React.ReactNode;
    source?: string;
}

export function AuditModal({ children, source = "unknown" }: AuditModalProps) {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2, "Name required"),
        email: z.string().email("Invalid email"),
        phone: z.string().optional(),
        company: z.string().min(2, "Company required"), // Using company field for Hotel/Spa name
        message: z.string().min(5, "Challenge details required"), // Using message for Challenge
        service: z.string().default("Auditoría Estratégica"),
        privacy: z.boolean().refine((accepted) => accepted, {
            message: language === "es"
                ? "Debes aceptar la política de privacidad"
                : "You must accept the privacy policy",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
            service: "Auditoría Estratégica",
            privacy: false,
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const res = await apiRequest({
                method: "POST",
                path: "/api/contact",
                body: values
            });
            return res;
        },
        onSuccess: () => {
            trackEvent('generate_lead', {
                lead_type: 'strategic_audit',
                lead_source: source,
            });
            toast({
                title: t('audit.success'),
                variant: "default",
            });
            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            let errorMessage = "Something went wrong. Please try again.";

            if (error.message) {
                // queryClient throws "Status: Body", so we look for the JSON start
                const jsonStart = error.message.indexOf('{');
                if (jsonStart !== -1) {
                    try {
                        const jsonStr = error.message.substring(jsonStart);
                        const data = JSON.parse(jsonStr);

                        // Zod validation error structure
                        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                            errorMessage = data.errors[0].message;
                        } else if (data.message) {
                            errorMessage = data.message;
                        }
                    } catch (e) {
                        // usage of raw message if parsing fails
                        errorMessage = error.message;
                    }
                } else {
                    errorMessage = error.message;
                }
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen && !open) {
            trackEvent('cta_click', {
                cta_name: 'strategic_audit',
                cta_location: source,
            });
        }
        setOpen(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('audit.title')}</DialogTitle>
                    <DialogDescription>
                        {t('audit.description')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('audit.name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Eva Pérez" autoComplete="name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('audit.email')}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="eva@example.com" autoComplete="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('audit.phone')}</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+34 600..." autoComplete="tel" {...field} />
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
                                <FormItem>
                                    <FormLabel>{t('audit.hotel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Grand Hotel & Spa..." autoComplete="organization" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('audit.challenge')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('audit.subtitle')}
                                            className="resize-none"
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
                                <FormItem className="flex items-start gap-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked === true)}
                                            className="mt-0.5"
                                        />
                                    </FormControl>
                                    <div className="space-y-1">
                                        <FormLabel className="text-sm font-normal leading-relaxed text-muted-foreground">
                                            {language === "es" ? "He leído y acepto la " : "I have read and accept the "}
                                            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-turquoise underline-offset-2 hover:underline">
                                                {language === "es" ? "política de privacidad" : "privacy policy"}
                                            </Link>
                                            .
                                        </FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-turquoise hover:bg-turquoise-dark text-white" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('audit.submit')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
