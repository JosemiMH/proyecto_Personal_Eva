import PageTransition from "@/components/PageTransition";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Admin = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedArticle, setGeneratedArticle] = useState<any>(null);
    const { toast } = useToast();

    const formSchema = z.object({
        topic: z.string().min(5, {
            message: "El tema debe tener al menos 5 caracteres.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsGenerating(true);
        setGeneratedArticle(null);
        try {
            const response = await apiRequest({
                method: 'POST',
                path: '/api/articles/generate',
                body: { topic: values.topic }
            });

            setGeneratedArticle(response.data);
            toast({
                title: "Artículo generado con éxito",
                description: `El artículo "${response.data.title}" ha sido creado y publicado.`,
            });
            form.reset();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudo generar el artículo. Verifica la configuración de OpenAI.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto py-24 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-playfair">Generador de Artículos con IA</CardTitle>
                    <CardDescription>
                        Introduce un tema para generar automáticamente un artículo de blog optimizado para SEO y publicarlo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tema del Artículo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Tendencias de bienestar en hoteles de lujo 2025" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-turquoise hover:bg-turquoise-dark" disabled={isGenerating}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generando contenido...
                                    </>
                                ) : (
                                    "Generar y Publicar"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {generatedArticle && (
                        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="font-bold text-green-800 mb-2">¡Artículo Publicado!</h3>
                            <p className="text-sm text-green-700 mb-2"><strong>Título:</strong> {generatedArticle.title}</p>
                            <p className="text-sm text-green-700"><strong>Slug:</strong> {generatedArticle.slug}</p>
                            <div className="mt-4">
                                <a href="/#blog" className="text-turquoise hover:underline text-sm font-medium">
                                    Ver en el blog &rarr;
                                </a>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Admin;
