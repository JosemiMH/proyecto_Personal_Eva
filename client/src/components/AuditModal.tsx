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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuditModalProps {
    children: React.ReactNode;
}

export function AuditModal({ children }: AuditModalProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2, "Name required"),
        email: z.string().email("Invalid email"),
        phone: z.string().optional(),
        company: z.string().min(2, "Company required"), // Using company field for Hotel/Spa name
        message: z.string().min(5, "Challenge details required"), // Using message for Challenge
        service: z.string().default("Auditoría Estratégica"),
        privacy: z.literal(true),
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
            privacy: true,
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                        <Input placeholder="Eva Pérez" {...field} />
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
                                            <Input placeholder="eva@example.com" {...field} />
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
                                            <Input placeholder="+34 600..." {...field} />
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
                                        <Input placeholder="Grand Hotel & Spa..." {...field} />
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
