import { jsxs, jsx } from "react/jsx-runtime";
import { H as Header, F as Footer } from "./Footer-BtMHmrlJ.js";
import { useEffect } from "react";
import "../entry-server.js";
import "react-dom/server";
import "wouter";
import "@tanstack/react-query";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "framer-motion";
import "react-markdown";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "react-icons/fa";
import "react-helmet-async";
const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "font-poppins text-charcoal bg-white min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto prose prose-slate", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-playfair text-4xl font-bold mb-8 text-turquoise-dark", children: "Política de Cookies" }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "Este sitio web utiliza cookies propias y de terceros para mejorar tu experiencia de usuario, analizar el tráfico y personalizar el contenido." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "¿Qué son las cookies?" }),
      /* @__PURE__ */ jsx("p", { children: "Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "Cookies que utilizamos" }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold mt-4", children: "1. Cookies Técnicas (Necesarias)" }),
      /* @__PURE__ */ jsx("p", { children: "Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existan. Por ejemplo, controlar el tráfico, identificar la sesión o recordar elementos de un pedido." }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold mt-4", children: "2. Cookies de Análisis" }),
      /* @__PURE__ */ jsx("p", { children: "Son aquellas que nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio. Para ello se analiza tu navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que te ofrecemos." }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold mt-4", children: "3. Cookies de Preferencias" }),
      /* @__PURE__ */ jsx("p", { children: "Permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios, como, por ejemplo, el idioma o la configuración regional." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "Gestión de Cookies" }),
      /* @__PURE__ */ jsx("p", { children: "Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mb-4", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Google Chrome:" }),
          " Configuración → Privacidad y seguridad → Cookies y otros datos de sitios."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Mozilla Firefox:" }),
          " Opciones → Privacidad y Seguridad."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Safari:" }),
          " Preferencias → Privacidad."
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Ten en cuenta que, si desactivas las cookies, es posible que algunas funciones del sitio web no funcionen correctamente." })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Cookies as default
};
