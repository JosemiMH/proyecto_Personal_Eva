import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { P as PageTransition } from "./PageTransition-BlTVvEHH.mjs";
import { u as useDeviceDetect, e as evaProfileImage, H as Header, F as Footer } from "./Footer-D6VhcrO9.mjs";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { u as useLanguage, D as Dialog, a as DialogContent, b as DialogTitle, c as DialogDescription, B as Button, s as services, d as cn, p as portfolioItems, t as testimonials, e as blogPosts, f as useToast, g as apiRequest, R as Resources, S as ScrollToTop } from "../entry-server.mjs";
import { A as AuditModal, S as Skeleton, a as SEO } from "./SEO-DbT9ZaSb.mjs";
import { ArrowRight, Tag, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, I as Input, e as FormMessage } from "./input-CpzPiKMZ.mjs";
import { T as Textarea } from "./textarea-CYyNOJWu.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as Checkbox, B as BookingCalendar } from "./BookingCalendar-DNyuQkst.mjs";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "react-icons/fa";
import "react-dom/server";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "react-markdown";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "react-helmet-async";
import "@radix-ui/react-label";
import "react-day-picker";
import "@radix-ui/react-select";
import "@radix-ui/react-separator";
import "@radix-ui/react-checkbox";
import "date-fns";
import "date-fns/locale";
const heroImageEs = "/assets/hero-es-kbcuNBxT.png";
const heroImageEn = "/assets/hero-en-81kcQctz.jpg";
const Hero = () => {
  const { language, t } = useLanguage();
  const { isMobile, isTablet, isDesktop } = useDeviceDetect();
  const heroImage = language === "es" ? heroImageEs : heroImageEn;
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden ${isMobile ? "h-[100dvh] pt-0 pb-0" : isTablet ? "pt-44 pb-24" : "pt-56 pb-32"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 z-10 ${isMobile ? "bg-gradient-to-b from-transparent via-black/10 to-black/90" : "bg-gradient-to-r from-turquoise/60 to-sage/40 mix-blend-multiply"}` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 overflow-hidden",
          style: {
            minHeight: isMobile ? "100%" : isTablet ? "620px" : "650px",
            height: "100%"
          },
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: heroImage,
              alt: language === "es" ? "Eva Pérez - Experta en Estrategia de Hospitalidad y Bienestar de Lujo" : "Eva Pérez - Expert in Luxury Hospitality & Wellness Strategy",
              className: `w-full h-full object-cover ${isMobile ? "object-[50%_15%]" : isTablet ? "object-[55%_-10%]" : "object-[50%_-10%]"}`
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `container mx-auto relative z-20 h-full ${isMobile ? "px-6 flex flex-col justify-end pb-12" : isTablet ? "pl-6 pr-6" : "pl-8 pr-8"}`, children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: isMobile ? "w-full" : isTablet ? "max-w-md" : "max-w-xl",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h1", { className: `font-playfair font-bold text-white leading-tight text-shadow ${isMobile ? "text-2xl mb-2" : isTablet ? "text-2xl md:text-3xl mb-3" : "text-3xl lg:text-4xl mb-4"}`, children: language === "es" ? "Consultoría Estratégica de Wellness y Spa para Hoteles de Lujo" : "Strategic Wellness & Spa Consulting for Luxury Hotels" }),
          /* @__PURE__ */ jsx("p", { className: `text-white opacity-90 border-l-4 border-white/70 ${isMobile ? "text-sm mb-4 pl-3" : isTablet ? "text-base mb-3 pl-4 max-w-md" : "text-lg mb-4 pl-5 max-w-lg"}`, children: language === "es" ? "En un motor de crecimiento estratégico, rentable y alineado con la experiencia de lujo." : "Into a strategic growth engine, profitable and aligned with the luxury experience." }),
          /* @__PURE__ */ jsxs("div", { className: isMobile ? "mb-4" : isTablet ? "mb-3" : "mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: `text-white uppercase tracking-wider font-semibold ${isMobile ? "text-xs" : "text-sm"}`, children: language === "es" ? "Experta en Estrategia de Hospitalidad y Bienestar de Lujo" : "Expert in Luxury Hospitality & Wellness Strategy" }),
            /* @__PURE__ */ jsx("p", { className: `text-white/80 ${isMobile ? "text-xs" : "text-sm"}`, children: language === "es" ? "Gerente de Proyectos SPA & Wellness – Especialista en Optimización de Ingresos" : "SPA & Wellness Project Manager – Revenue Optimization Specialist" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: `text-white opacity-80 ${isMobile ? "text-xs mb-6" : isTablet ? "text-sm mb-5 max-w-sm" : "text-sm mb-6 max-w-md"}`, children: language === "es" ? "Más de 20 años de experiencia optimizando operaciones, formando equipos excepcionales y elevando la satisfacción del cliente." : "Over 20 years of experience optimizing operations, training exceptional teams, and elevating customer satisfaction." }),
          /* @__PURE__ */ jsxs("div", { className: `gap-3 ${isMobile ? "flex flex-col w-full" : "flex flex-row"}`, children: [
            /* @__PURE__ */ jsx(AuditModal, { children: /* @__PURE__ */ jsx(
              "button",
              {
                className: `bg-turquoise hover:bg-turquoise-dark text-white font-medium rounded transition-colors inline-block text-center cursor-pointer ${isMobile ? "px-6 py-3 text-sm w-full" : isTablet ? "px-7 py-2.5 text-sm" : "px-8 py-3 text-base"}`,
                children: t("hero.ctaPrimary")
              }
            ) }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#portfolio",
                className: `bg-white hover:bg-gray-100 text-turquoise-dark font-medium rounded transition-colors inline-block text-center ${isMobile ? "px-6 py-3 text-sm w-full" : isTablet ? "px-7 py-2.5 text-sm" : "px-8 py-3 text-base"}`,
                children: t("hero.ctaSecondary")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const evaSpeakingImage = "/assets/hero-en-81kcQctz.jpg";
const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  objectFit = "cover",
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);
  useEffect(() => {
    setIsLoading(!priority);
    setImageSrc(src);
    setError(false);
  }, [src, priority]);
  const handleLoad = () => {
    setIsLoading(false);
  };
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    setImageSrc("https://placehold.co/600x400/e2e8f0/94a3b8?text=Image+not+available");
  };
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleError;
    }
  }, [priority, src]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative overflow-hidden ${className}`,
      style: { width, height },
      children: [
        isLoading && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "absolute inset-0 z-10",
            style: { width: "100%", height: "100%" }
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imageSrc,
            alt,
            className: `w-full h-full transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`,
            style: { objectFit },
            onLoad: handleLoad,
            onError: handleError,
            loading: priority ? "eager" : "lazy"
          }
        )
      ]
    }
  );
};
const AnimatedCounter = ({
  end,
  duration = 2,
  label,
  prefix = "",
  suffix = ""
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (isInView && !hasAnimated) {
      let startTimestamp;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1e3), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setHasAnimated(true);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration, hasAnimated]);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      ref,
      className: "text-center",
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-turquoise mb-2", children: [
          prefix,
          count,
          suffix
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-sm md:text-base", children: label })
      ]
    }
  );
};
const About = () => {
  const { t, language } = useLanguage();
  return /* @__PURE__ */ jsx("section", { id: "about", className: "py-16 md:py-24 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-12 items-center", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "md:w-1/2",
        initial: { opacity: 0, x: -30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "rounded-lg shadow-xl overflow-hidden",
              whileHover: { scale: 1.03 },
              transition: { duration: 0.3 },
              children: /* @__PURE__ */ jsx(
                OptimizedImage,
                {
                  src: evaProfileImage,
                  alt: "Eva Pérez, Expert in Luxury Hospitality & Wellness Strategy",
                  className: "w-full h-auto rounded-lg",
                  objectFit: "cover",
                  priority: true
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 mt-4", children: [
            /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "rounded-lg shadow-xl overflow-hidden",
                whileHover: { scale: 1.03 },
                transition: { duration: 0.3 },
                children: /* @__PURE__ */ jsx(
                  OptimizedImage,
                  {
                    src: evaSpeakingImage,
                    alt: "Eva Pérez dando una conferencia",
                    className: "w-full h-auto rounded-lg",
                    objectFit: "cover"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-center mt-2 text-charcoal-light italic", children: t("about.speakingCaption") })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "md:w-1/2",
        initial: { opacity: 0, x: 30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("about.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("about.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6", children: t("about.experience") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6", children: t("about.approach") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6", children: t("about.speaker") }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-8 mb-10", children: [
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 20, suffix: "+", label: t("about.stats.years") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 50, suffix: "+", label: t("about.stats.projects") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 30, suffix: "+", label: t("about.stats.conferences") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 200, suffix: "+", label: t("about.stats.trained") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 5e3, label: t("about.stats.attendees"), prefix: "", suffix: "+" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: "#contact",
                className: "bg-turquoise text-white px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-turquoise-dark transition-colors",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx("span", { children: t("about.contact") }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: "#portfolio",
                className: "border border-turquoise text-turquoise px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-turquoise hover:text-white transition-colors",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx("span", { children: t("about.portfolio") }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) }) });
};
const ServiceModal = ({ isOpen, onClose, service }) => {
  const { language } = useLanguage();
  if (!service) return null;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[600px] max-h-[90vh] flex flex-col font-poppins p-0 gap-0 bg-white border-none shadow-2xl z-[60] overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-turquoise/10 to-transparent p-6 md:p-8 flex items-center gap-6 border-b border-gray-100", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-turquoise", children: /* @__PURE__ */ jsx("i", { className: `fas ${service.icon} text-2xl` }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(DialogTitle, { className: "font-playfair text-2xl md:text-3xl font-bold text-charcoal", children: service.title[language] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-grow overflow-y-auto bg-white", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-base text-charcoal-light leading-relaxed", children: service.longDescription ? service.longDescription[language] : service.description[language] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50/80 p-6 rounded-xl border border-gray-100", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-charcoal mb-4 flex items-center gap-2 font-playfair text-lg", children: [
          /* @__PURE__ */ jsx("i", { className: "fas fa-star text-turquoise" }),
          language === "es" ? "Características Clave" : "Key Features"
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: service.features[language].map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-1.5 w-1.5 h-1.5 rounded-full bg-turquoise shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-charcoal-light", children: feature })
        ] }, index)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 border-t border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => {
          onClose();
          const contactSection = document.getElementById("contact");
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
          }
        },
        className: "w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all",
        children: language === "es" ? "Solicitar Consultoría" : "Request Consultation"
      }
    ) })
  ] }) });
};
const Services = () => {
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "services", className: "py-16 md:py-24 bg-gray-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center max-w-3xl mx-auto mb-16",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("services.title") }),
            /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("services.subtitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: t("services.subtitle") })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          children: services.map((service, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
              variants: itemVariants,
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-turquoise/10 rounded-full flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("i", { className: `fas ${service.icon} text-turquoise text-2xl` }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-playfair text-xl font-bold text-charcoal mb-4", children: service.title[language] }),
                /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-4 line-clamp-3", children: service.description[language] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-6", children: service.features[language].map((feature, featureIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsx("i", { className: "fas fa-check text-turquoise mt-1 mr-2" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-charcoal-light", children: feature })
                ] }, featureIndex)) }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleOpenModal(service),
                    className: "text-turquoise hover:text-turquoise-dark font-medium text-sm flex items-center",
                    children: [
                      t("services.moreInfo"),
                      " ",
                      /* @__PURE__ */ jsx("i", { className: "fas fa-arrow-right ml-1" })
                    ]
                  }
                )
              ]
            },
            index
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ServiceModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        service: selectedService
      }
    )
  ] });
};
const CallToAction = () => {
  const { language } = useLanguage();
  const content = {
    es: {
      title: "¿Listo para transformar tu negocio wellness?",
      description: "Agenda una consulta gratuita para descubrir cómo podemos optimizar tu spa y elevar la experiencia de tus clientes.",
      button: "Agendar consulta"
    },
    en: {
      title: "Ready to transform your wellness business?",
      description: "Schedule a free consultation to discover how we can optimize your spa and elevate your customers' experience.",
      button: "Book consultation"
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-turquoise text-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "flex flex-col md:flex-row items-center justify-between gap-8",
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-2/3", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-playfair text-2xl md:text-3xl font-bold mb-4", children: content[language].title }),
          /* @__PURE__ */ jsx("p", { className: "text-white/90 text-lg", children: content[language].description })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AuditModal, { children: /* @__PURE__ */ jsx("button", { className: "inline-block bg-white text-turquoise-dark hover:bg-gray-100 transition-colors font-medium px-8 py-3 rounded cursor-pointer", children: content[language].button }) }) })
      ]
    }
  ) }) });
};
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const ProjectModal = ({ isOpen, onClose, project }) => {
  const { language } = useLanguage();
  if (!project) return null;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[900px] w-[95vw] h-[90vh] max-h-[90vh] flex flex-col font-poppins p-0 border-none shadow-2xl bg-white z-[60] overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-64 md:h-80 w-full shrink-0 bg-gray-900", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: project.image,
          alt: project.title[language],
          className: "w-full h-full object-cover opacity-90"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end mb-3", children: /* @__PURE__ */ jsx(Badge, { className: "bg-turquoise text-white border-none text-xs md:text-sm px-3 py-1 shadow-sm", children: project.categoryName[language] }) }),
        /* @__PURE__ */ jsx(DialogTitle, { className: "font-playfair text-2xl md:text-4xl text-white font-bold drop-shadow-md leading-tight", children: project.title[language] })
      ] }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-white/20 z-20 shadow-lg",
          "aria-label": "Close modal",
          children: /* @__PURE__ */ jsx("i", { className: "fas fa-times text-lg w-5 h-5 flex items-center justify-center" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto bg-white relative z-50", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-8 pb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-playfair text-xl md:text-2xl font-bold text-charcoal flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "w-8 h-1 bg-turquoise rounded-full block" }),
          language === "es" ? "Sobre el Proyecto" : "About the Project"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-lg md:text-xl text-charcoal-light leading-relaxed font-light", children: project.description[language] }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-lg text-charcoal-light max-w-none", children: /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line leading-relaxed", children: project.longDescription[language] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-6 rounded-xl border border-gray-100", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-charcoal mb-4 flex items-center gap-2 text-lg", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-clipboard-check text-turquoise" }),
            language === "es" ? "Desafíos & Soluciones" : "Challenges & Solutions"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: project.highlights[language].map((highlight, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1.5 w-1.5 h-1.5 rounded-full bg-turquoise shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-charcoal-light leading-relaxed", children: highlight })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg border border-gray-100", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-charcoal mb-4 flex items-center gap-2 text-lg", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-trophy text-gold" }),
            language === "es" ? "Logros Destacados" : "Key Achievements"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: project.results[language].map((result, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-star text-gold mt-1 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-charcoal-light leading-relaxed", children: result })
          ] }, index)) })
        ] })
      ] })
    ] }) })
  ] }) });
};
const Portfolio = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  const filteredItems = portfolioItems.filter(
    (item) => activeFilter === "all" || item.chain === activeFilter
  );
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "portfolio", className: "py-16 md:py-24 bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center max-w-3xl mx-auto mb-16",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("portfolio.title") }),
            /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("portfolio.subtitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: t("portfolio.description") })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "bg-gradient-to-r from-turquoise/10 to-turquoise/5 rounded-lg p-6 mb-10 text-center",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-turquoise mb-1", children: "40+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-charcoal-light", children: language === "es" ? "Proyectos Completados" : "Completed Projects" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-turquoise mb-1", children: "6" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-charcoal-light", children: language === "es" ? "Cadenas Hoteleras" : "Hotel Chains" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-turquoise mb-1", children: "20+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-charcoal-light", children: language === "es" ? "Años de Experiencia" : "Years of Experience" })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex mb-10 justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 overflow-x-auto pb-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "all" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("all"),
            children: t("portfolio.all")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "paradores" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("paradores"),
            children: "Paradores"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "eurostars" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("eurostars"),
            children: "Eurostars"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "hg" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("hg"),
            children: "HG Hotels"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "melia" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("melia"),
            children: "Meliá"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "axel" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("axel"),
            children: "AXEL"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "independientes" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("independientes"),
            children: language === "es" ? "Independientes" : "Independent"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          children: filteredItems.map((item, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
              variants: itemVariants,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative h-64", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: item.image,
                      alt: item.title[language],
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end", children: /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium bg-turquoise text-white px-2 py-1 rounded", children: item.categoryName[language] }) }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-playfair text-xl font-bold text-charcoal mb-2", children: item.title[language] }),
                  /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-sm mb-4 line-clamp-3", children: item.description[language] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleOpenModal(item),
                      className: "text-turquoise hover:text-turquoise-dark font-medium text-sm flex items-center",
                      children: [
                        t("portfolio.viewCase"),
                        " ",
                        /* @__PURE__ */ jsx("i", { className: "fas fa-arrow-right ml-1" })
                      ]
                    }
                  )
                ] })
              ]
            },
            index
          ))
        },
        activeFilter
      ),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsx("a", { href: "#", className: "inline-block px-8 py-3 border border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-colors rounded font-medium", children: t("portfolio.viewMore") }) })
    ] }),
    /* @__PURE__ */ jsx(
      ProjectModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        project: selectedProject
      }
    )
  ] });
};
const Testimonials = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const maxSlide = testimonials.length - slidesPerView;
  const goToSlide = (slide) => {
    const newSlide = Math.max(0, Math.min(slide, maxSlide));
    setCurrentSlide(newSlide);
    if (sliderRef.current) {
      const translateX = newSlide * -100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(${translateX}%)`;
    }
  };
  const goToPrev = () => goToSlide(currentSlide - 1);
  const goToNext = () => goToSlide(currentSlide + 1);
  return /* @__PURE__ */ jsx("section", { id: "testimonials", className: "py-16 md:py-24 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center max-w-3xl mx-auto mb-16",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("testimonials.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("testimonials.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: t("testimonials.description") })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative testimonial-slider overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: sliderRef,
          className: "flex transition-transform duration-500",
          style: { transform: `translateX(${-currentSlide * 100 / slidesPerView}%)` },
          children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center mb-4", children: /* @__PURE__ */ jsxs("div", { className: "text-yellow-400 flex", children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" })
            ] }) }),
            /* @__PURE__ */ jsx("blockquote", { className: "mb-6", children: /* @__PURE__ */ jsxs("p", { className: "font-cormorant text-lg italic text-charcoal", children: [
              '"',
              typeof testimonial.quote === "object" ? testimonial.quote[language] : testimonial.quote,
              '"'
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: testimonial.avatar,
                  alt: testimonial.name,
                  className: "w-12 h-12 rounded-full object-cover mr-4"
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-charcoal", children: testimonial.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-light", children: typeof testimonial.position === "object" ? testimonial.position[language] : testimonial.position })
              ] })
            ] })
          ] }) }, index))
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center focus:outline-none z-10 ml-2 lg:ml-6 hover:bg-gray-50",
          onClick: goToPrev,
          disabled: currentSlide === 0,
          children: /* @__PURE__ */ jsx("i", { className: "fas fa-chevron-left text-turquoise" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center focus:outline-none z-10 mr-2 lg:mr-6 hover:bg-gray-50",
          onClick: goToNext,
          disabled: currentSlide === maxSlide,
          children: /* @__PURE__ */ jsx("i", { className: "fas fa-chevron-right text-turquoise" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-6 space-x-2", children: Array.from({ length: maxSlide + 1 }).map((_, index) => /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-3 h-3 rounded-full ${currentSlide === index ? "bg-turquoise" : "bg-gray-300"}`,
        onClick: () => goToSlide(index)
      },
      index
    )) })
  ] }) });
};
const Blog = () => {
  const { t, language } = useLanguage();
  const { data: apiArticles, isLoading } = useQuery({
    queryKey: ["/api/articles"]
  });
  const { latestArticles, archiveArticles } = useMemo(() => {
    const filtered = apiArticles ? apiArticles.filter((article) => article.language === (language === "es" ? "es" : "en")) : blogPosts.map((post, index) => ({
      id: index + 1e3,
      slug: `post-${index}`,
      title: post.title[language],
      content: post.content[language].join("\n\n"),
      excerpt: post.excerpt[language],
      image: post.image,
      category: post.category[language],
      readTime: post.readTime[language],
      date: (/* @__PURE__ */ new Date()).toISOString()
    }));
    const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted.filter((a) => new Date(a.date).getFullYear() >= 2026);
    const archive = sorted.filter((a) => new Date(a.date).getFullYear() < 2026);
    return { latestArticles: latest, archiveArticles: archive };
  }, [apiArticles, language]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("section", { id: "blog", className: "py-20 md:py-32 bg-gray-50 relative", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-20", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24 mx-auto mb-3" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-3/4 mx-auto mb-6" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-1/2 mx-auto" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx("div", { className: `h-full rounded-2xl overflow-hidden shadow-lg ${i === 1 ? "md:col-span-2 lg:col-span-2" : ""} ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`, children: /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full" }) }, i)) })
    ] }) });
  }
  const BlogGrid = ({ articles, delay = 0 }) => /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]",
      variants: containerVariants,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true },
      children: articles.map((post, index) => /* @__PURE__ */ jsx(Link, { href: `/blog/${post.slug}`, children: /* @__PURE__ */ jsx("a", { className: `block h-full group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${index === 0 && articles.length > 1 ? "md:col-span-2 lg:col-span-2" : ""} ${index === 3 && articles.length > 4 ? "md:col-span-2 lg:col-span-1" : ""}`, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "h-full w-full",
          variants: itemVariants,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
              /* @__PURE__ */ jsx(
                OptimizedImage,
                {
                  src: post.image,
                  alt: post.title,
                  className: "w-full h-full transition-transform duration-700 group-hover:scale-110",
                  objectFit: "cover",
                  priority: index < 2
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 p-8 flex flex-col justify-end", children: /* @__PURE__ */ jsxs("div", { className: "transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4 text-white/80 text-xs font-medium uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxs("span", { className: "bg-turquoise/90 text-white px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3" }),
                  post.category
                ] }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: new Date(post.date).toLocaleDateString(language === "es" ? "es-ES" : "en-US") })
              ] }),
              /* @__PURE__ */ jsx("h4", { className: `font-playfair font-bold text-white mb-3 leading-tight group-hover:text-turquoise-light transition-colors ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`, children: post.title }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-200 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100", children: post.excerpt }),
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center text-white font-medium group/link", children: [
                /* @__PURE__ */ jsx("span", { className: "border-b border-turquoise pb-1 group-hover/link:border-white transition-colors", children: t("blog.readArticle") }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" })
              ] })
            ] }) })
          ]
        }
      ) }) }, post.id))
    }
  );
  return /* @__PURE__ */ jsx("section", { id: "blog", className: "py-20 md:py-32 bg-gray-50 relative", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center max-w-3xl mx-auto mb-20",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("blog.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight", children: t("blog.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-lg", children: t("blog.description") })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mb-20", children: /* @__PURE__ */ jsx(BlogGrid, { articles: latestArticles }) }),
    archiveArticles.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-20", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "flex items-center gap-4 mb-10",
          initial: { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal", children: [
              "2025 ",
              language === "es" ? "Archivo" : "Archive"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-200 flex-grow" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(BlogGrid, { articles: archiveArticles })
    ] })
  ] }) });
};
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const formSchema2 = z.object({
    name: z.string().min(2, {
      message: language === "es" ? "El nombre debe tener al menos 2 caracteres" : "Name must have at least 2 characters"
    }),
    email: z.string().email({
      message: language === "es" ? "Por favor introduce un email válido" : "Please enter a valid email address"
    }),
    company: z.string().optional(),
    service: z.string({
      required_error: language === "es" ? "Por favor selecciona un servicio" : "Please select a service"
    }),
    message: z.string().min(10, {
      message: language === "es" ? "Tu mensaje debe tener al menos 10 caracteres" : "Your message must have at least 10 characters"
    }),
    privacy: z.boolean().refine((val) => val === true, {
      message: language === "es" ? "Debes aceptar la política de privacidad" : "You must accept the privacy policy"
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
      privacy: false
    }
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        path: "/api/contact",
        method: "POST",
        body: data
      });
      toast({
        title: language === "es" ? "Mensaje enviado" : "Message sent",
        description: language === "es" ? "Gracias por contactar. Te responderé a la brevedad." : "Thank you for contacting me. I will respond shortly."
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: language === "es" ? "Hubo un problema al enviar el mensaje. Inténtalo nuevamente." : "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { id: "contact", className: "py-16 md:py-24 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-12", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "lg:w-1/2",
        initial: { opacity: 0, x: -30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: language === "es" ? "Contacto" : "Contact" }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: language === "es" ? "¿Hablamos sobre tu proyecto?" : "Let's talk about your project" }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-8", children: language === "es" ? "Completa el formulario y me pondré en contacto contigo para programar una consulta inicial gratuita donde podremos hablar sobre tus necesidades específicas." : "Fill out the form and I will contact you to schedule a free initial consultation where we can discuss your specific needs." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx("i", { className: "fas fa-envelope text-turquoise" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-charcoal mb-1", children: "Email" }),
                /* @__PURE__ */ jsx("a", { href: "mailto:epm@epmwellness.com", className: "text-turquoise hover:text-turquoise-dark", children: "epm@epmwellness.com" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx("i", { className: "fas fa-phone text-turquoise" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-charcoal mb-1", children: language === "es" ? "Teléfono" : "Phone" }),
                /* @__PURE__ */ jsx("a", { href: "tel:+34676462991", className: "text-turquoise hover:text-turquoise-dark", children: "+34 676 462 991" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx("i", { className: "fas fa-map-marker-alt text-turquoise" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-charcoal mb-1", children: language === "es" ? "Ubicación" : "Location" }),
                /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: language === "es" ? "Madrid, España (Disponible para proyectos internacionales)" : "Madrid, Spain (Available for international projects)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex space-x-4", children: /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/in/evaperez-spa-consultant/", target: "_blank", rel: "noopener noreferrer", className: "w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center text-turquoise hover:bg-turquoise hover:text-white transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fab fa-linkedin-in" }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "lg:w-1/2",
        initial: { opacity: 0, x: 30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, delay: 0.2 },
        children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "message", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "message", className: "text-base", children: language === "es" ? "Enviar mensaje" : "Send message" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "booking", className: "text-base", children: language === "es" ? "Reservar consulta" : "Book consultation" })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "message", className: "p-6", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "bg-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
              /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "name",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Nombre" : "Name" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: language === "es" ? "Tu nombre" : "Your name",
                        className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                        ...field
                      }
                    ) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "email",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: "Email" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "email",
                        placeholder: language === "es" ? "tu@email.com" : "your@email.com",
                        className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                        ...field
                      }
                    ) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "company",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-6", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Empresa/Organización" : "Company/Organization" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: language === "es" ? "Nombre de tu empresa" : "Your company name",
                      className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "service",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-6", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Servicio de interés" : "Service of interest" }),
                  /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: language === "es" ? "Selecciona un servicio" : "Select a service" }) }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "consultoria", children: language === "es" ? "Consultoría Estratégica" : "Strategic Consulting" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "proyectos", children: language === "es" ? "Gestión de Proyectos" : "Project Management" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "formacion", children: language === "es" ? "Formación y Desarrollo" : "Training and Development" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "interim", children: language === "es" ? "Interim Management" : "Interim Management" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "otro", children: language === "es" ? "Otro" : "Other" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "message",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-6", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Mensaje" : "Message" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      placeholder: language === "es" ? "Cuéntame sobre tu proyecto o necesidad" : "Tell me about your project or need",
                      className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                      rows: 4,
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "privacy",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex items-start mb-6", children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      checked: field.value,
                      onCheckedChange: field.onChange,
                      className: "mt-1 mr-2"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1 leading-none", children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "text-sm text-charcoal-light", children: language === "es" ? "Acepto la política de privacidad y el tratamiento de mis datos para recibir comunicaciones." : "I accept the privacy policy and the processing of my data to receive communications." }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                className: "w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-3 rounded transition-colors",
                disabled: isSubmitting,
                children: isSubmitting ? language === "es" ? "Enviando..." : "Sending..." : language === "es" ? "Enviar mensaje" : "Send message"
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "booking", className: "p-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-charcoal mb-2", children: language === "es" ? "Reserva una consulta personalizada" : "Book a personalized consultation" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: language === "es" ? "Selecciona la fecha y hora que mejor te convenga para nuestra reunión." : "Select the date and time that works best for you for our meeting." })
            ] }),
            /* @__PURE__ */ jsx(BookingCalendar, {})
          ] })
        ] })
      }
    )
  ] }) }) });
};
const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const formSchema2 = z.object({
    email: z.string().email({
      message: language === "es" ? "Por favor introduce un email válido" : "Please enter a valid email address"
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      email: ""
    }
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        method: "POST",
        path: "/api/newsletter",
        body: data
      });
      toast({
        title: language === "es" ? "¡Guía enviada!" : "Guide sent!",
        description: language === "es" ? "Revisa tu email para descargar la Guía de Rentabilidad." : "Check your email to download the Profitability Guide."
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: language === "es" ? "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo." : "There was a problem processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-turquoise text-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "flex flex-col md:flex-row items-center justify-between gap-8",
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-playfair text-2xl md:text-3xl font-bold mb-4", children: t("newsletter.leadMagnetTitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-white/90", children: t("newsletter.leadMagnetSubtitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:w-1/2", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-grow", children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: language === "es" ? "Tu email" : "Your email",
                    className: "flex-grow p-3 rounded border-0 focus:ring-2 focus:ring-white/50 outline-none text-gray-900 bg-white placeholder:text-gray-500",
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "bg-white text-turquoise-dark hover:bg-gray-100 transition-colors font-medium px-6 py-3 rounded whitespace-nowrap",
              disabled: isSubmitting,
              children: isSubmitting ? t("newsletter.sending") : t("newsletter.downloadButton")
            }
          )
        ] }) }) })
      ]
    }
  ) }) });
};
const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un email válido"
  })
});
const EbookPopup = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasClosedPopup = localStorage.getItem("ebookPopupClosed");
      if (!hasClosedPopup) {
        setIsOpen(true);
      }
    }, 3e3);
    return () => clearTimeout(timer);
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        path: "/api/newsletter",
        method: "POST",
        body: { email: data.email }
      });
      setIsSuccess(true);
      toast({
        title: language === "es" ? "¡Gracias por tu interés!" : "Thank you for your interest!",
        description: language === "es" ? "Hemos enviado el E-Book a tu correo electrónico. Revisa tu bandeja de entrada." : "We have sent the E-Book to your email. Please check your inbox.",
        variant: "default"
      });
      setTimeout(() => {
        setIsOpen(false);
        localStorage.setItem("ebookPopupClosed", "true");
      }, 2e3);
    } catch (error) {
      console.error("Error al enviar el email:", error);
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo." : "An error occurred while processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("ebookPopupClosed", "true");
  };
  const popupTitle = language === "es" ? "E-Book + plantilla: Cómo implementar IA en tu spa hotelero en 30 días" : "E-Book + template: How to implement AI in your hotel spa in 30 days";
  const popupDescription = language === "es" ? "Descarga esta guía práctica con los pasos concretos para comenzar a aplicar soluciones de IA en tu spa, incluyendo una plantilla de implementación lista para usar." : "Download this practical guide with concrete steps to start applying AI solutions in your spa, including a ready-to-use implementation template.";
  const buttonText = language === "es" ? isSubmitting ? "Enviando..." : "Descargar ahora" : isSubmitting ? "Sending..." : "Download now";
  const emailPlaceholder = language === "es" ? "Tu email" : "Your email";
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "relative bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden font-poppins",
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          transition: { type: "spring", damping: 25, stiffness: 300 },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: closePopup,
                className: "absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors z-10",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsx(X, { size: 24 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-playfair font-bold text-charcoal mb-4 leading-tight", children: popupTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6 text-base opacity-90", children: popupDescription }),
              !isSuccess ? /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "email",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: emailPlaceholder,
                          type: "email",
                          ...field,
                          className: "h-14 text-base rounded-md border border-gray-300 focus:border-turquoise focus:ring-1 focus:ring-turquoise px-4"
                        }
                      ) }),
                      /* @__PURE__ */ jsx(FormMessage, { className: "text-red-500 text-sm mt-1" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    className: "w-full bg-[#C8AD8D] hover:bg-[#BDA079] text-white h-14 font-medium text-base rounded-md transition-colors duration-300",
                    disabled: isSubmitting,
                    children: buttonText
                  }
                )
              ] }) }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-5 bg-green-50 rounded-md", children: /* @__PURE__ */ jsx("p", { className: "text-green-700 text-center", children: language === "es" ? "¡Gracias! Revisa tu correo electrónico para descargar el E-Book." : "Thank you! Check your email to download the E-Book." }) })
            ] })
          ]
        }
      )
    }
  ) });
};
const Home = () => {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href === "#") return;
        const targetElement = document.querySelector(href || "");
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth"
          });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 50 && navbar) {
        navbar.classList.add("py-2");
        navbar.classList.remove("py-4");
      } else if (navbar) {
        navbar.classList.add("py-4");
        navbar.classList.remove("py-2");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "font-poppins text-charcoal bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Consultoría Wellness & Spa de Lujo | Eva Pérez - Wellness & Hospitality Strategy",
        description: "Transforma tu hotel con estrategias de wellness rentables. Eva Pérez, experta en gestión de spas, consultoría y hospitalidad de lujo."
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("section", { id: "home", children: /* @__PURE__ */ jsx(Hero, {}) }),
    /* @__PURE__ */ jsx("section", { id: "about", children: /* @__PURE__ */ jsx(About, {}) }),
    /* @__PURE__ */ jsx("section", { id: "services", children: /* @__PURE__ */ jsx(Services, {}) }),
    /* @__PURE__ */ jsx("section", { id: "cta", children: /* @__PURE__ */ jsx(CallToAction, {}) }),
    /* @__PURE__ */ jsx("section", { id: "portfolio", children: /* @__PURE__ */ jsx(Portfolio, {}) }),
    /* @__PURE__ */ jsx("section", { id: "testimonials", children: /* @__PURE__ */ jsx(Testimonials, {}) }),
    /* @__PURE__ */ jsx("section", { id: "resources", children: /* @__PURE__ */ jsx(Resources, {}) }),
    /* @__PURE__ */ jsx("section", { id: "blog", children: /* @__PURE__ */ jsx(Blog, {}) }),
    /* @__PURE__ */ jsx("section", { id: "contact", children: /* @__PURE__ */ jsx(Contact, {}) }),
    /* @__PURE__ */ jsx("section", { id: "newsletter", children: /* @__PURE__ */ jsx(Newsletter, {}) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(EbookPopup, {})
  ] }) });
};
export {
  Home as default
};
