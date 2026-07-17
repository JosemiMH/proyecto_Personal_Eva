import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import { AuditModal } from "@/components/AuditModal";
import { useEffect } from "react";


export default function BlogPostPage() {
    const [, params] = useRoute("/blog/:slug");
    const slug = params?.slug;
    const { language } = useLanguage();

    const { data: article, isLoading } = useQuery<Article>({
        queryKey: [`/api/articles/${slug}`],
        enabled: !!slug,
    });

    const { data: relatedArticles = [] } = useQuery<Article[]>({
        queryKey: ["/api/articles/related", slug],
        enabled: !!slug && !!article,
        queryFn: async () => {
            const response = await fetch("/api/articles", { credentials: "include" });
            if (!response.ok) throw new Error("Unable to load related articles");
            const articles = await response.json() as Article[];
            return articles
                .filter((candidate) => candidate.slug !== slug && candidate.language === article?.language)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3);
        },
    });

    const articleLanguage = article?.language === 'en' ? 'en' : 'es';
    const isSpanishArticle = articleLanguage === 'es';

    useEffect(() => {
        if (!article) return;

        document.documentElement.lang = articleLanguage;
        return () => {
            document.documentElement.lang = language;
        };
    }, [article, articleLanguage, language]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Skeleton className="h-10 w-32 mb-8" />
                    <div className="space-y-6">
                        <Skeleton className="aspect-video w-full rounded-2xl" />
                        <div className="flex gap-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-12 w-3/4" />
                        <div className="space-y-4 mt-8">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </div>
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

    const siteUrl = "https://www.epmwellness.com";
    const postUrl = `/blog/${article.slug}`;
    const articleBody = article.content.replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/, "");

    // Structured Data (Article Schema)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "image": article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`,
        "datePublished": article.date,
        "dateModified": article.date,
        "mainEntityOfPage": `${siteUrl}${postUrl}`,
        "author": {
            "@type": "Person",
            "name": "Eva Pérez",
            "url": siteUrl
        },
        "publisher": {
            "@type": "Person",
            "name": "Eva Pérez",
            "image": {
                "@type": "ImageObject",
                "url": `${siteUrl}/attached_assets/foto_perfil_Eva_Linkedin.PNG`
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
                type="article"
                language={articleLanguage}
            />

            {/* JSON-LD for this specific article */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
                }}
            />

            <article className="min-h-screen pt-24 pb-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link href="/#blog">
                        <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 flex items-center text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {isSpanishArticle ? 'Volver al Blog' : 'Back to Blog'}
                        </Button>
                    </Link>

                    <div className="space-y-6">
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="object-cover w-full h-full"
                                width="1200"
                                height="675"
                                decoding="async"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                {article.category}
                            </span>
                            <time className="flex items-center" dateTime={article.date}>
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(article.date).toLocaleDateString(isSpanishArticle ? 'es-ES' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {article.readTime}
                            </div>
                            <Link href="/" rel="author" className="font-medium text-primary hover:underline">
                                {isSpanishArticle ? 'Por Eva Pérez' : 'By Eva Pérez'}
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground leading-tight">
                            {article.title}
                        </h1>

                        <div className="prose prose-lg dark:prose-invert max-w-none font-sans leading-relaxed">
                            <ReactMarkdown>{articleBody}</ReactMarkdown>
                        </div>

                        {relatedArticles.length > 0 && (
                            <section className="border-t border-border pt-10" aria-labelledby="related-articles-title">
                                <h2 id="related-articles-title" className="font-playfair text-2xl font-bold text-foreground">
                                    {isSpanishArticle ? 'Artículos relacionados' : 'Related articles'}
                                </h2>
                                <div className="mt-6 grid gap-4 md:grid-cols-3">
                                    {relatedArticles.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/blog/${related.slug}`}
                                            className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{related.category}</p>
                                            <h3 className="mt-2 font-playfair text-lg font-bold leading-snug text-foreground group-hover:text-primary">
                                                {related.title}
                                            </h3>
                                            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                                                {isSpanishArticle ? 'Leer artículo' : 'Read article'}
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="mt-12 p-8 bg-muted/30 rounded-2xl border border-primary/10">
                            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-xl font-playfair font-bold text-foreground">
                                        {isSpanishArticle ? '¿Tu Spa está alcanzando su máximo potencial?' : 'Is your Spa reaching its full potential?'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {isSpanishArticle
                                            ? "Solicita una auditoría estratégica gratuita y descubre oportunidades ocultas de rentabilidad."
                                            : "Request a free strategic audit and discover hidden profitability opportunities."
                                        }
                                    </p>
                                </div>
                                <AuditModal source="blog_article">
                                    <Button size="lg" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                        {isSpanishArticle ? 'Solicitar Auditoría' : 'Request Audit'}
                                    </Button>
                                </AuditModal>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
