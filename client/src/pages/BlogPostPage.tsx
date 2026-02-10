import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage() {
    const [, params] = useRoute("/blog/:slug");
    const slug = params?.slug;
    const { t, language } = useLanguage();

    const { data: article, isLoading } = useQuery<Article>({
        queryKey: [`/api/articles/${slug}`],
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen pt-24 container mx-auto px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Artículo no encontrado / Article not found</h1>
                <Link href="/#blog">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver / Back
                    </Button>
                </Link>
            </div>
        );
    }

    // Determine language content (database schema has 'language' field, 
    // but if we want to show the article regardless of current UI language context 
    // matches, we just show it. However, typically we want to show the version 
    // that matches the UI or the specific slug language if they differ).
    // 
    // Since we have separate database entries for ES and EN with different slugs 
    // (e.g. 'tendencias...' vs 'spa-trends...'), the slug determines the content.
    // We don't need to filter by language here, just render what we fetched.

    const siteUrl = "https://evaperez-wellness.com";
    const postUrl = `/blog/${article.slug}`;

    // Structured Data (Article Schema)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "image": article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`,
        "datePublished": article.date,
        "author": {
            "@type": "Person",
            "name": "Eva Pérez"
        },
        "publisher": {
            "@type": "Person",
            "name": "Eva Pérez",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/generated-icon.png`
            }
        },
        "description": article.excerpt
    };

    return (
        <>
            <SEO
                title={article.title}
                description={article.excerpt}
                image={article.image}
                url={postUrl}
            />

            {/* JSON-LD for this specific article */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            <article className="min-h-screen pt-24 pb-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link href="/#blog">
                        <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 flex items-center text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === 'es' ? 'Volver al Blog' : 'Back to Blog'}
                        </Button>
                    </Link>

                    <div className="space-y-6">
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                {article.category}
                            </span>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(article.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {article.readTime}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground leading-tight">
                            {article.title}
                        </h1>

                        <div className="prose prose-lg dark:prose-invert max-w-none font-sans leading-relaxed">
                            <ReactMarkdown>{article.content}</ReactMarkdown>
                        </div>

                        <div className="mt-12 pt-8 border-t">
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground italic">
                                    {language === 'es'
                                        ? "¿Te ha interesado este artículo? Hablemos de cómo aplicar estas estrategias en tu negocio."
                                        : "Found this article interesting? Let's talk about how to apply these strategies to your business."
                                    }
                                </p>
                                <Link href="/#contacto">
                                    <Button size="lg">
                                        {language === 'es' ? 'Contactar' : 'Contact Me'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
