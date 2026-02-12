import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { u as useLanguage, B as Button } from "../entry-server.mjs";
import { S as Skeleton, a as SEO, A as AuditModal } from "./SEO-DbT9ZaSb.mjs";
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
import "react-hook-form";
import "@hookform/resolvers/zod";
import "zod";
import "./input-CpzPiKMZ.mjs";
import "@radix-ui/react-label";
import "./textarea-CYyNOJWu.mjs";
function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params == null ? void 0 : params.slug;
  const { t, language } = useLanguage();
  const { data: article, isLoading } = useQuery({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen pt-24 pb-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32 mb-8" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "aspect-video w-full rounded-2xl" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24 rounded-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24" })
        ] }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-3/4" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-8", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" })
        ] })
      ] })
    ] }) });
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
  const siteUrl = "https://www.epmwellness.com";
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
        /* @__PURE__ */ jsx("div", { className: "mt-12 p-8 bg-muted/30 rounded-2xl border border-primary/10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center md:text-left", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-playfair font-bold text-foreground", children: language === "es" ? "¿Tu Spa está alcanzando su máximo potencial?" : "Is your Spa reaching its full potential?" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: language === "es" ? "Solicita una auditoría estratégica gratuita y descubre oportunidades ocultas de rentabilidad." : "Request a free strategic audit and discover hidden profitability opportunities." })
          ] }),
          /* @__PURE__ */ jsx(AuditModal, { children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "shrink-0 bg-primary text-primary-foreground hover:bg-primary/90", children: language === "es" ? "Solicitar Auditoría" : "Request Audit" }) })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  BlogPostPage as default
};
