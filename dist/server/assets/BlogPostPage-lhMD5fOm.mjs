import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { u as useLanguage, B as Button } from "../entry-server.mjs";
import { S as SEO } from "./SEO-DhGfO5vh.mjs";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import "react-dom/server";
import "react";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "framer-motion";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "react-icons/fa";
import "react-helmet-async";
function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params == null ? void 0 : params.slug;
  const { t, language } = useLanguage();
  const { data: article, isLoading } = useQuery({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen pt-24 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) });
  }
  if (!article) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pt-24 container mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Artículo no encontrado / Article not found" }),
      /* @__PURE__ */ jsx(Link, { href: "/#blog", children: /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Volver / Back"
      ] }) })
    ] });
  }
  const siteUrl = "https://evaperez-wellness.com";
  const postUrl = `/blog/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": article.image.startsWith("http") ? article.image : `${siteUrl}${article.image}`,
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: article.title,
        description: article.excerpt,
        image: article.image,
        url: postUrl
      }
    ),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(structuredData) }),
    /* @__PURE__ */ jsx("article", { className: "min-h-screen pt-24 pb-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
      /* @__PURE__ */ jsx(Link, { href: "/#blog", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "mb-8 hover:bg-transparent p-0 flex items-center text-muted-foreground hover:text-primary transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        language === "es" ? "Volver al Blog" : "Back to Blog"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: article.image,
            alt: article.title,
            className: "object-cover w-full h-full"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-primary/10 text-primary px-3 py-1 rounded-full font-medium", children: article.category }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 mr-1" }),
            new Date(article.date).toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 mr-1" }),
            article.readTime
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-playfair font-bold text-foreground leading-tight", children: article.title }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-lg dark:prose-invert max-w-none font-sans leading-relaxed", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: article.content }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 pt-8 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground italic", children: language === "es" ? "¿Te ha interesado este artículo? Hablemos de cómo aplicar estas estrategias en tu negocio." : "Found this article interesting? Let's talk about how to apply these strategies to your business." }),
          /* @__PURE__ */ jsx(Link, { href: "/#contacto", children: /* @__PURE__ */ jsx(Button, { size: "lg", children: language === "es" ? "Contactar" : "Contact Me" }) })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  BlogPostPage as default
};
