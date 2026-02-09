import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { B as BookingCalendar } from "./BookingCalendar-DcT-9qQV.mjs";
import { u as useLanguage, B as Button } from "../entry-server.mjs";
import { motion } from "framer-motion";
import { Link } from "wouter";
import "lucide-react";
import "react-day-picker";
import "./input-Qkbd4gOm.mjs";
import "@radix-ui/react-slot";
import "react-hook-form";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-select";
import "@radix-ui/react-separator";
import "@radix-ui/react-checkbox";
import "@hookform/resolvers/zod";
import "zod";
import "date-fns";
import "date-fns/locale";
import "react-dom/server";
import "@tanstack/react-query";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "react-markdown";
import "@radix-ui/react-dialog";
import "react-icons/fa";
import "react-helmet-async";
const Booking = () => {
  const { language } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "min-h-screen pt-24 pb-16 px-4",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-800 mb-4", children: language === "es" ? "Reserva una Consulta" : "Book a Consultation" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: language === "es" ? "Agenda una sesión personalizada con Eva Pérez para discutir tu proyecto de wellness o spa" : "Schedule a personalized session with Eva Pérez to discuss your wellness or spa project" })
        ] }),
        /* @__PURE__ */ jsx(BookingCalendar, {}),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-gray-50 rounded-xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: language === "es" ? "¿Qué esperar de la consulta?" : "What to expect from the consultation?" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Antes de la reunión" : "Before the meeting" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Recibirás un correo electrónico de confirmación con un enlace para la videollamada y un cuestionario breve para comprender mejor tus necesidades." : "You will receive a confirmation email with a video call link and a brief questionnaire to better understand your needs." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Durante la consulta" : "During the consultation" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Una conversación de 60 minutos donde analizaremos tu proyecto actual, identificaremos desafíos clave y exploraremos soluciones estratégicas." : "A 60-minute conversation where we will analyze your current project, identify key challenges, and explore strategic solutions." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Después de la sesión" : "After the session" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Recibirás un resumen con las principales ideas discutidas y recomendaciones personalizadas para implementar en tu proyecto." : "You will receive a summary with the main ideas discussed and personalized recommendations to implement in your project." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Seguimiento" : "Follow-up" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Tendrás acceso a una sesión de seguimiento breve por email para resolver cualquier duda adicional sobre las recomendaciones." : "You will have access to a brief follow-up session by email to resolve any additional questions about the recommendations." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center text-gray-600 text-sm", children: [
          /* @__PURE__ */ jsx("p", { children: language === "es" ? "Para consultas sobre cancelaciones o cambios en tu reserva, por favor contacta directamente con nosotros por email." : "For inquiries about cancellations or changes to your booking, please contact us directly by email." }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "flex items-center gap-2 px-5 py-2 text-turquoise border-turquoise hover:bg-turquoise/10",
              children: [
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m15 18-6-6 6-6" }) }),
                language === "es" ? "Volver a la página principal" : "Return to home page"
              ]
            }
          ) }) })
        ] })
      ] })
    }
  );
};
export {
  Booking as default
};
