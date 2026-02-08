import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, I as Input, e as FormMessage } from "./input-C7RySMSg.js";
import { h as useToast, C as Card, k as CardHeader, l as CardTitle, m as CardDescription, n as CardContent, B as Button, i as apiRequest } from "../entry-server.js";
import { Loader2 } from "lucide-react";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "class-variance-authority";
import "react-dom/server";
import "wouter";
import "@tanstack/react-query";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "framer-motion";
import "react-markdown";
import "@radix-ui/react-dialog";
import "react-icons/fa";
import "react-helmet-async";
const Admin = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const { toast } = useToast();
  const formSchema = z.object({
    topic: z.string().min(5, {
      message: "El tema debe tener al menos 5 caracteres."
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: ""
    }
  });
  const onSubmit = async (values) => {
    setIsGenerating(true);
    setGeneratedArticle(null);
    try {
      const response = await apiRequest({
        method: "POST",
        path: "/api/articles/generate",
        body: { topic: values.topic }
      });
      setGeneratedArticle(response.data);
      toast({
        title: "Artículo generado con éxito",
        description: `El artículo "${response.data.title}" ha sido creado y publicado.`
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo generar el artículo. Verifica la configuración de OpenAI.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto py-24 px-4", children: /* @__PURE__ */ jsxs(Card, { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-playfair", children: "Generador de Artículos con IA" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Introduce un tema para generar automáticamente un artículo de blog optimizado para SEO y publicarlo." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "topic",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Tema del Artículo" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Ej: Tendencias de bienestar en hoteles de lujo 2025", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-turquoise hover:bg-turquoise-dark", disabled: isGenerating, children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Generando contenido..."
        ] }) : "Generar y Publicar" })
      ] }) }),
      generatedArticle && /* @__PURE__ */ jsxs("div", { className: "mt-8 p-4 bg-green-50 rounded-lg border border-green-200", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-green-800 mb-2", children: "¡Artículo Publicado!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700 mb-2", children: [
          /* @__PURE__ */ jsx("strong", { children: "Título:" }),
          " ",
          generatedArticle.title
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700", children: [
          /* @__PURE__ */ jsx("strong", { children: "Slug:" }),
          " ",
          generatedArticle.slug
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("a", { href: "/#blog", className: "text-turquoise hover:underline text-sm font-medium", children: "Ver en el blog →" }) })
      ] })
    ] })
  ] }) });
};
export {
  Admin as default
};
