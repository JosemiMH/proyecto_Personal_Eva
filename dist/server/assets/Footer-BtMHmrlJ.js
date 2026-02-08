import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useLanguage } from "../entry-server.js";
import { Link } from "wouter";
import { FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
const evaProfileImage = "/assets/hero-es-kbcuNBxT.png";
const spainFlag = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23F1BF00'%20/%3e%3crect%20width='32'%20height='8'%20fill='%23AA151B'%20y='0'%20/%3e%3crect%20width='32'%20height='8'%20fill='%23AA151B'%20y='24'%20/%3e%3c/svg%3e";
const ukFlag = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23012169'/%3e%3cpath%20d='M0,0%20L32,32%20M32,0%20L0,32'%20stroke='%23fff'%20stroke-width='4'/%3e%3cpath%20d='M16,0%20L16,32%20M0,16%20L32,16'%20stroke='%23fff'%20stroke-width='8'/%3e%3cpath%20d='M16,0%20L16,32%20M0,16%20L32,16'%20stroke='%23C8102E'%20stroke-width='4'/%3e%3cpath%20d='M0,0%20L32,32%20M32,0%20L0,32'%20stroke='%23C8102E'%20stroke-width='2'/%3e%3c/svg%3e";
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-8 h-8 flex items-center justify-center rounded-full overflow-hidden ${language === "es" ? "ring-2 ring-turquoise" : "ring-1 ring-gray-300"} hover:ring-2 hover:ring-turquoise transition-all`,
        onClick: () => setLanguage("es"),
        "aria-label": "Cambiar a español",
        children: /* @__PURE__ */ jsx("img", { src: spainFlag, alt: "Bandera de España", className: "w-full h-full object-cover" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-8 h-8 flex items-center justify-center rounded-full overflow-hidden ${language === "en" ? "ring-2 ring-turquoise" : "ring-1 ring-gray-300"} hover:ring-2 hover:ring-turquoise transition-all`,
        onClick: () => setLanguage("en"),
        "aria-label": "Switch to English",
        children: /* @__PURE__ */ jsx("img", { src: ukFlag, alt: "UK Flag", className: "w-full h-full object-cover" })
      }
    )
  ] });
};
function useDeviceDetect() {
  const [deviceType, setDeviceType] = useState("desktop");
  useEffect(() => {
    const handleResize = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      const width = window.innerWidth;
      if (isMobileDevice && width < 768) {
        setDeviceType("mobile");
      } else if (isMobileDevice || width >= 768 && width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop"
  };
}
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { isMobile, isTablet, isDesktop } = useDeviceDetect();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return /* @__PURE__ */ jsxs(
    "header",
    {
      id: "navbar",
      className: `fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300 ${isMobile ? scrolled ? "py-1.5" : "py-2" : isTablet ? scrolled ? "py-2" : "py-3" : scrolled ? "py-2.5" : "py-4"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: `container mx-auto ${isMobile ? "px-3" : isTablet ? "px-5" : "px-8"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("a", { href: "#", className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: evaProfileImage,
                alt: "Eva Pérez",
                className: `rounded-full object-cover flex-shrink-0 ${isMobile ? "h-7 w-7 mr-2" : isTablet ? "h-9 w-9 mr-2.5" : "h-11 w-11 mr-3"}`
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: `font-playfair font-bold text-turquoise block leading-tight ${isMobile ? "text-base" : isTablet ? "text-xl" : "text-2xl"}`, children: "Eva Pérez" }),
              /* @__PURE__ */ jsx("span", { className: `text-sage-dark font-light ${isMobile ? "text-[8px] whitespace-normal leading-tight max-w-[220px]" : "text-xs"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: language === "es" ? "Gerente de Proyectos SPA & Wellness" : "SPA & Wellness Project Manager" }),
                /* @__PURE__ */ jsx("span", { className: "hidden md:inline text-turquoise/60", children: "|" }),
                /* @__PURE__ */ jsx("span", { children: language === "es" ? "Especialista en Optimización de Ingresos" : "Revenue Optimization Specialist" })
              ] }) })
            ] })
          ] }),
          !isMobile && /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center", children: [
            /* @__PURE__ */ jsxs("nav", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#about",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.about")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#services",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.services")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#portfolio",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.portfolio")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#testimonials",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.testimonials")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#blog",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.blog")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#contact",
                  className: `bg-turquoise text-white rounded hover:bg-turquoise-dark transition-colors ${isTablet ? "text-xs px-3 py-1.5 ml-1" : "text-sm px-4 py-2 ml-2"}`,
                  children: t("header.bookAudit")
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: isTablet ? "ml-2" : "ml-4", children: /* @__PURE__ */ jsx(LanguageSwitcher, {}) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden focus:outline-none p-1.5",
              onClick: toggleMobileMenu,
              "aria-label": "Toggle mobile menu",
              children: /* @__PURE__ */ jsx("i", { className: `fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} ${isMobile ? "text-lg" : "text-xl"} text-charcoal` })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `md:hidden bg-white w-full border-t border-gray-100 absolute left-0 right-0 z-[60] shadow-md transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"}`,
            children: /* @__PURE__ */ jsxs("div", { className: `container mx-auto ${isMobile ? "px-3 py-3 space-y-2" : "px-4 py-4 space-y-3"}`, children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#about",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.about")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#services",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.services")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#portfolio",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.portfolio")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#testimonials",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.testimonials")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#blog",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.blog")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#contact",
                  className: `block text-turquoise font-medium border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.bookAudit")
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between ${isMobile ? "py-2" : "py-3"}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`, children: language === "es" ? "Idioma" : "Language" }),
                /* @__PURE__ */ jsx(LanguageSwitcher, {})
              ] })
            ] })
          }
        )
      ]
    }
  );
};
const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const { t, language } = useLanguage();
  return /* @__PURE__ */ jsx("footer", { className: "bg-charcoal-dark text-white pt-16 pb-24 md:pb-8", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "font-playfair text-2xl font-bold text-white mb-4", children: "Eva Pérez" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-6 text-sm leading-relaxed", children: language === "es" ? "Más de 20 años transformando espacios de bienestar en experiencias memorables y rentables." : "Over 20 years transforming wellness spaces into memorable and profitable experiences." }),
            /* @__PURE__ */ jsx("div", { className: "flex space-x-4", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://www.linkedin.com/in/evaperez-spa-consultant/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-gray-400 hover:text-turquoise transition-colors w-10 h-10 flex items-center justify-center bg-charcoal rounded-full hover:bg-opacity-80",
                "aria-label": "LinkedIn",
                children: /* @__PURE__ */ jsx(FaLinkedinIn, { size: 18 })
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: 0.1 },
          children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium text-white mb-4", children: language === "es" ? "Enlaces rápidos" : "Quick Links" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#about", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.about") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#services", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.services") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#portfolio", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.portfolio") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#testimonials", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.testimonials") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#blog", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.blog") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#contact", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.contact") }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: 0.2 },
          children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium text-white mb-4", children: language === "es" ? "Contacto" : "Contact" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-sm", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaEnvelope, { className: "text-turquoise mt-1 mr-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("a", { href: "mailto:epm@epmwellness.com", className: "text-gray-400 hover:text-turquoise transition-colors", children: "epm@epmwellness.com" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaPhone, { className: "text-turquoise mt-1 mr-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("a", { href: "tel:+34676462991", className: "text-gray-400 hover:text-turquoise transition-colors", children: "+34 676 462 991" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "text-turquoise mt-1 mr-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: language === "es" ? "Madrid, España" : "Madrid, Spain" })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "border-gray-700 mb-8" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-xs mb-4 md:mb-0", children: [
        "© ",
        currentYear,
        " Eva Pérez. ",
        language === "es" ? "Todos los derechos reservados." : "All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-6", children: [
        /* @__PURE__ */ jsx(Link, { href: "/privacy", className: "text-gray-400 hover:text-turquoise text-xs transition-colors", children: language === "es" ? "Política de Privacidad" : "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { href: "/terms", className: "text-gray-400 hover:text-turquoise text-xs transition-colors", children: language === "es" ? "Términos y Condiciones" : "Terms & Conditions" }),
        /* @__PURE__ */ jsx(Link, { href: "/cookies", className: "text-gray-400 hover:text-turquoise text-xs transition-colors", children: language === "es" ? "Cookies" : "Cookies" })
      ] })
    ] })
  ] }) });
};
export {
  Footer as F,
  Header as H,
  evaProfileImage as e,
  useDeviceDetect as u
};
