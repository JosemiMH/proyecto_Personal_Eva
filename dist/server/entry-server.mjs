import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { Route, Redirect, Link, useLocation, Switch, Router as Router$1 } from "wouter";
import { QueryClient, useQuery, useMutation, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import React__default, { createContext, useContext, useState, useEffect, useRef, Suspense } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { FaArrowUp } from "react-icons/fa";
import * as HelmetAsync from "react-helmet-async";
async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = await res.text() || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}
async function apiRequest({
  path,
  method = "GET",
  body = void 0
}) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : void 0,
    credentials: "include"
  });
  await throwIfResNotOk(res);
  return await res.json();
}
const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
  const res = await fetch(queryKey[0], {
    credentials: "include"
  });
  if (unauthorizedBehavior === "returnNull" && res.status === 401) {
    return null;
  }
  await throwIfResNotOk(res);
  return await res.json();
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsx(Card, { className: "w-full max-w-md mx-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex mb-4 gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "404 Page Not Found" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600", children: "Did you forget to add the page to the router?" })
  ] }) }) });
}
const services = [
  {
    icon: "fa-search",
    title: {
      es: "Consultoría Estratégica",
      en: "Strategic Consulting"
    },
    description: {
      es: "Auditorías completas, desarrollo de conceptos y planes de optimización de rentabilidad para tu spa.",
      en: "Comprehensive audits, concept development, and profitability optimization plans for your spa."
    },
    longDescription: {
      es: `En el competitivo mundo de la hospitalidad de lujo, un spa no es solo un servicio adicional; es un destino en sí mismo y un motor crucial de ingresos y satisfacción del huésped. Mi servicio de Consultoría Estratégica está diseñado para transformar áreas de bienestar en activos de alto rendimiento, combinando excelencia operativa con rentabilidad financiera.

      Basado en tres pilares fundamentales, este servicio ofrece una solución integral para hoteles y spas que buscan la excelencia:

      1. Auditorías Operativas Completas
      No se puede mejorar lo que no se mide ni se entiende a fondo. Mis auditorías operativas son un análisis profundo de la salud de tu negocio wellness.
      
      2. Desarrollo de Conceptos Únicos
      En un mercado saturado, la diferenciación es clave. Ayudo a crear identidades de spa que resuenen con tu marca hotelera y atraigan al viajero sofisticado.
      
      3. Optimización de Rentabilidad (Revenue Management)
      La pasión por el bienestar debe ir de la mano con la sostenibilidad financiera. Transformo la gestión del spa para maximizar los ingresos sin comprometer la experiencia.`,
      en: `In the competitive world of luxury hospitality, a spa is not just an additional amenity; it is a destination in itself and a crucial driver of revenue and guest satisfaction. My Strategic Consulting service is designed to transform wellness areas into high-performance assets, combining operational excellence with financial profitability.

      Based on three fundamental pillars, this service offers a comprehensive solution for hotels and spas seeking excellence:

      1. Comprehensive Operational Audits
      You cannot improve what you do not measure or fully understand. My operational audits are a deep analysis of the health of your wellness business.

      2. Unique Concept Development
      In a saturated market, differentiation is key. I help create spa identities that resonate with your hotel brand and attract the sophisticated traveler.

      3. Profitability Optimization (Revenue Management)
      Passion for wellness must go hand in hand with financial sustainability. I transform spa management to maximize revenue without compromising the experience.`
    },
    features: {
      es: ["Auditorías operativas", "Desarrollo de conceptos", "Optimización de rentabilidad"],
      en: ["Operational audits", "Concept development", "Profitability optimization"]
    }
  },
  {
    icon: "fa-tasks",
    title: {
      es: "Gestión de Proyectos",
      en: "Project Management"
    },
    description: {
      es: "Supervisión integral de aperturas, renovaciones y mejoras de centros wellness.",
      en: "Comprehensive supervision of openings, renovations, and improvements of wellness centers."
    },
    longDescription: {
      es: `Desde la concepción inicial hasta el día de la inauguración, la gestión de un proyecto de spa requiere una coordinación meticulosa entre arquitectos, diseñadores, proveedores y equipos operativos. Mi servicio de Gestión de Proyectos asegura que tu visión se convierta en realidad, a tiempo y dentro del presupuesto.

      Abarco todas las fases críticas del proyecto:
      
      • Planificación Técnica: Revisión de planos para asegurar la funcionalidad operativa y el flujo correcto de clientes y staff.
      • Selección de Equipamiento: Asesoramiento independiente para elegir la mejor tecnología y mobiliario, negociando directamente con proveedores.
      • Pre-Opening: Creación de la estructura operativa, selección y formación del equipo, y diseño del menú de servicios antes de la apertura.
      
      Ya sea una nueva construcción o una renovación completa, actúo como el puente entre la visión creativa y la realidad operativa.`,
      en: `From initial conception to opening day, managing a spa project requires meticulous coordination between architects, designers, suppliers, and operational teams. My Project Management service ensures your vision becomes reality, on time and on budget.

      I cover all critical phases of the project:

      • Technical Planning: Review of blueprints to ensure operational functionality and correct flow of clients and staff.
      • Equipment Selection: Independent advice to choose the best technology and furniture, negotiating directly with suppliers.
      • Pre-Opening: Creation of the operational structure, team selection and training, and service menu design before opening.

      Whether it's a new build or a complete renovation, I act as the bridge between creative vision and operational reality.`
    },
    features: {
      es: ["Apertura de nuevos spas", "Renovación y reposicionamiento", "Implantación de servicios"],
      en: ["New spa openings", "Renovation and repositioning", "Service implementation"]
    }
  },
  {
    icon: "fa-users",
    title: {
      es: "Formación y Desarrollo",
      en: "Training & Development"
    },
    description: {
      es: "Programas formativos para equipos, mentoría para managers y creación de manuales.",
      en: "Training programs for teams, mentoring for managers, and creation of manuals."
    },
    longDescription: {
      es: `El activo más valioso de un spa es su equipo. Incluso las instalaciones más impresionantes fallan si el servicio no es excepcional. Mis programas de Formación y Desarrollo están diseñados para elevar las competencias técnicas y emocionales de tu personal.

      Ofrezco soluciones formativas a medida:
      
      • Excelencia en el Servicio: Protocolos de etiqueta, atención al cliente y creación de experiencias memorables.
      • Ventas y Retail: Técnicas para aumentar el ticket medio y la venta de productos sin ser intrusivos.
      • Mentoría para Spa Managers: Acompañamiento uno a uno para desarrollar las habilidades de liderazgo y gestión financiera de tus directivos.
      • Manuales Operativos (SOPs): Creación de la "biblia" de tu spa, estandarizando cada proceso para garantizar la consistencia.`,
      en: `A spa's most valuable asset is its team. Even the most impressive facilities fail if the service is not exceptional. My Training & Development programs are designed to elevate the technical and emotional competencies of your staff.

      I offer tailored training solutions:

      • Service Excellence: Etiquette protocols, customer service, and creating memorable experiences.
      • Sales & Retail: Techniques to increase average ticket and product sales without being intrusive.
      • Mentoring for Spa Managers: One-on-one coaching to develop the leadership and financial management skills of your managers.
      • Standard Operating Procedures (SOPs): Creation of your spa's "bible", standardizing every process to ensure consistency.`
    },
    features: {
      es: ["Formación de equipos", "Mentoría para managers", "Manuales operativos"],
      en: ["Team training", "Manager mentoring", "Operational manuals"]
    }
  },
  {
    icon: "fa-sync-alt",
    title: {
      es: "Interim Management",
      en: "Interim Management"
    },
    description: {
      es: "Gestión temporal de spas en transición o implementación de cambios estructurales.",
      en: "Temporary management of spas in transition or implementation of structural changes."
    },
    longDescription: {
      es: `Hay momentos críticos en la vida de un negocio donde se necesita un liderazgo experto inmediato. Ya sea por una baja inesperada de la dirección, una crisis operativa o una necesidad de reestructuración profunda, mi servicio de Interim Management ofrece una solución ejecutiva ágil y efectiva.

      Asumo el control operativo de tu spa por un periodo definido para:
      
      • Estabilizar la Operativa: Restaurar el orden y la calidad del servicio rápidamente.
      • Implementar Cambios Difíciles: Ejecutar reestructuraciones o cambios de estrategia que requieren una visión externa objetiva.
      • Cubrir Transiciones: Mantener el rendimiento del negocio mientras se busca o forma al nuevo Spa Manager permanente.
      
      Aporto la experiencia de haber gestionado múltiples centros de alto nivel, permitiéndome ser efectiva desde el primer día.`,
      en: `There are critical moments in the life of a business where immediate expert leadership is needed. Whether due to an unexpected management vacancy, an operational crisis, or a need for deep restructuring, my Interim Management service offers an agile and effective executive solution.

      I assume operational control of your spa for a defined period to:

      • Stabilize Operations: Restore order and service quality quickly.
      • Implement Difficult Changes: Execute restructurings or strategy changes that require an objective external vision.
      • Cover Transitions: Maintain business performance while searching for or training the new permanent Spa Manager.

      I bring the experience of having managed multiple high-level centers, allowing me to be effective from day one.`
    },
    features: {
      es: ["Gestión temporal", "Resolución de crisis", "Cambios estructurales"],
      en: ["Temporary management", "Crisis resolution", "Structural changes"]
    }
  }
];
const portfolioItems = [
  {
    title: {
      es: "Cadena Paradores de España",
      en: "Paradores Chain Spain"
    },
    description: {
      es: "Consultoría integral y conceptualización de marca de spa en la prestigiosa cadena Paradores. Supervisión de 13+ establecimientos históricos.",
      en: "Comprehensive consulting and spa brand conceptualization for the prestigious Paradores chain. Supervision of 13+ historic establishments."
    },
    longDescription: {
      es: `Desde 2008, he tenido el privilegio de colaborar estrechamente con Paradores de Turismo de España, una de las cadenas hoteleras más prestigiosas y singulares del mundo. Este proyecto ha implicado el reto único de integrar instalaciones de bienestar modernas en edificios históricos protegidos, como castillos, conventos y palacios.

      Mi labor ha abarcado la supervisión y consultoría de más de 13 establecimientos, incluyendo joyas como La Granja, El Saler, Alcalá de Henares, Corias y Santo Estevo. Para cada uno, se desarrolló una identidad propia que respetara la historia del lugar mientras ofrecía estándares de lujo contemporáneos.

      El trabajo incluyó la definición de los estándares de marca para toda la línea de spas, la creación de menús de tratamiento inspirados en la historia local y la formación continua de los equipos para asegurar una experiencia homogénea en toda la red.`,
      en: `Since 2008, I have had the privilege of collaborating closely with Paradores de Turismo de España, one of the most prestigious and unique hotel chains in the world. This project involved the unique challenge of integrating modern wellness facilities into protected historic buildings, such as castles, convents, and palaces.

      My work has covered the supervision and consulting of over 13 establishments, including gems like La Granja, El Saler, Alcalá de Henares, Corias, and Santo Estevo. For each, a unique identity was developed that respected the history of the place while offering contemporary luxury standards.

      The work included defining brand standards for the entire spa line, creating treatment menus inspired by local history, and continuous team training to ensure a consistent experience across the network.`
    },
    image: "/assets/new_gen/parador.png",
    chain: "paradores",
    chainName: {
      es: "Paradores",
      en: "Paradores"
    },
    highlights: {
      es: ["13+ establecimientos históricos", "Gestión desde 2008", "Estándares de calidad únicos"],
      en: ["13+ historic establishments", "Management since 2008", "Unique quality standards"]
    },
    results: {
      es: ["Estandarización exitosa de la operativa en toda la red", "Incremento del RevPATH en un 25% promedio", "Creación de protocolos exclusivos de marca"],
      en: ["Successful standardization of operations across the network", "Average RevPATH increase of 25%", "Creation of exclusive brand protocols"]
    },
    category: "consultoria",
    categoryName: {
      es: "Consultoría",
      en: "Consulting"
    }
  },
  {
    title: {
      es: "Eurostars Hotels & Resorts",
      en: "Eurostars Hotels & Resorts"
    },
    description: {
      es: "Gestión integral de centros wellness de lujo, destacando el Hotel Aurea Convento Capuchinos en Segovia.",
      en: "Comprehensive management of luxury wellness centers, highlighting Hotel Aurea Convento Capuchinos in Segovia."
    },
    longDescription: {
      es: `La colaboración con Eurostars Hotels & Resorts se ha centrado en elevar el perfil de sus activos de bienestar en propiedades clave. El proyecto más emblemático ha sido el Hotel Aurea Convento Capuchinos en Segovia, donde gestioné el spa desde su inauguración en 2014.

      El desafío principal fue posicionar el spa no solo como un servicio para huéspedes, sino como un destino de bienestar para la ciudad de Segovia. Implementamos una estrategia de apertura al público local que transformó el modelo de negocio.

      Además, supervisé la gestión del Eurostars Mijas, enfocándome en la optimización de la rentabilidad en un entorno de resort de alta competencia en la Costa del Sol.`,
      en: `The collaboration with Eurostars Hotels & Resorts has focused on raising the profile of their wellness assets in key properties. The most emblematic project has been the Hotel Aurea Convento Capuchinos in Segovia, where I managed the spa since its opening in 2014.

      The main challenge was to position the spa not only as a guest amenity but as a wellness destination for the city of Segovia. We implemented a strategy of opening to the local public that transformed the business model.

      Additionally, I supervised the management of Eurostars Mijas, focusing on profitability optimization in a highly competitive resort environment on the Costa del Sol.`
    },
    image: "/assets/new_gen/eurostars.png",
    chain: "eurostars",
    chainName: {
      es: "Eurostars",
      en: "Eurostars"
    },
    highlights: {
      es: ["Spa de referencia en Segovia", "Gestión desde 2014", "Apertura a la ciudad"],
      en: ["Reference spa in Segovia", "Management since 2014", "City opening strategy"]
    },
    results: {
      es: ["Captación de un 40% de clientela externa local", "Reconocimiento como mejor spa urbano de la región", "Optimización de costes operativos"],
      en: ["Capture of 40% local external clientele", "Recognition as the best urban spa in the region", "Operational cost optimization"]
    },
    category: "proyectos",
    categoryName: {
      es: "Proyectos",
      en: "Projects"
    }
  },
  {
    title: {
      es: "Cadena HG Hoteles de Montaña",
      en: "HG Mountain Hotels Chain"
    },
    description: {
      es: "Gestión operativa completa de spas en destinos alpinos premium: HG Cerler, HG La Molina y HG Formigal.",
      en: "Complete operational management of spas in premium alpine destinations: HG Cerler, HG La Molina, and HG Formigal."
    },
    longDescription: {
      es: `La gestión de spas en destinos de esquí presenta desafíos únicos: estacionalidad extrema, necesidades específicas de recuperación muscular para deportistas y logística compleja en alta montaña. Con HG Hoteles, asumí la supervisión de sus centros en Cerler, La Molina y Formigal.

      Desarrollamos una carta de servicios "Après-Ski" altamente especializada, enfocada en la recuperación muscular y la relajación profunda tras la jornada de deporte. Esto nos permitió maximizar la ocupación en las horas punta de la tarde.

      También implementamos programas de formación intensiva para equipos temporales, asegurando que la calidad del servicio se mantuviera alta a pesar de la rotación natural de la temporada.`,
      en: `Managing spas in ski destinations presents unique challenges: extreme seasonality, specific muscle recovery needs for athletes, and complex logistics in high mountains. With HG Hotels, I assumed supervision of their centers in Cerler, La Molina, and Formigal.

      We developed a highly specialized "Après-Ski" service menu, focused on muscle recovery and deep relaxation after a day of sports. This allowed us to maximize occupancy during peak afternoon hours.

      We also implemented intensive training programs for temporary teams, ensuring that service quality remained high despite the natural turnover of the season.`
    },
    image: "/assets/new_gen/hg.png",
    chain: "hg",
    chainName: {
      es: "HG Hotels",
      en: "HG Hotels"
    },
    highlights: {
      es: ["3 resorts de montaña", "Servicios especializados ski", "Alta ocupación estacional"],
      en: ["3 mountain resorts", "Specialized ski services", "High seasonal occupancy"]
    },
    results: {
      es: ["Maximización de ingresos en temporada corta", 'Diseño de tratamientos firma "Après-Ski"', "Alta fidelización de clientes repetidores"],
      en: ["Revenue maximization in short season", 'Design of signature "Après-Ski" treatments', "High loyalty of returning customers"]
    },
    category: "interim",
    categoryName: {
      es: "Interim",
      en: "Interim"
    }
  },
  {
    title: {
      es: "Meliá Hotels International",
      en: "Meliá Hotels International"
    },
    description: {
      es: "Dirección de wellness centers en resorts premium: Meliá Tanau, Meliá Isla Canela y Meliá Alto Aragón.",
      en: "Management of wellness centers in premium resorts: Meliá Tanau, Meliá Isla Canela, and Meliá Alto Aragón."
    },
    longDescription: {
      es: `Trabajar con una marca global como Meliá requiere un alineamiento perfecto con estándares internacionales de excelencia. Mi rol abarcó la dirección de wellness centers en ubicaciones diversas, desde la playa en Isla Canela hasta la montaña en Tanau y Alto Aragón.

      El foco principal fue la implementación de protocolos de calidad rigurosos y la creación de experiencias que elevaran la percepción de valor del resort. En Meliá Tanau, por ejemplo, posicionamos el spa como un servicio VIP exclusivo para los clientes de las suites y el servicio Royal Service.

      La gestión incluyó la integración de los sistemas de reservas del spa con el PMS del hotel para una experiencia de cliente sin fricciones y una mejor captura de datos.`,
      en: `Working with a global brand like Meliá requires perfect alignment with international standards of excellence. My role covered the management of wellness centers in diverse locations, from the beach in Isla Canela to the mountains in Tanau and Alto Aragón.

      The main focus was the implementation of rigorous quality protocols and the creation of experiences that elevated the resort's value perception. At Meliá Tanau, for example, we positioned the spa as an exclusive VIP service for suite and Royal Service guests.

      Management included integrating spa booking systems with the hotel's PMS for a frictionless customer experience and better data capture.`
    },
    image: "/assets/new_gen/melia.png",
    chain: "melia",
    chainName: {
      es: "Meliá",
      en: "Meliá"
    },
    highlights: {
      es: ["Resorts premium internacionales", "Protocolos de lujo", "Experiencias exclusivas"],
      en: ["Premium international resorts", "Luxury protocols", "Exclusive experiences"]
    },
    results: {
      es: ["Integración total con la experiencia del huésped", "Aumento del ticket medio por habitación", "Excelentes puntuaciones en auditorías de calidad"],
      en: ["Full integration with guest experience", "Increase in average ticket per room", "Excellent scores in quality audits"]
    },
    category: "consultoria",
    categoryName: {
      es: "Consultoría",
      en: "Consulting"
    }
  },
  {
    title: {
      es: "AXEL Hotels - Wellness Urbano",
      en: "AXEL Hotels - Urban Wellness"
    },
    description: {
      es: "Gestión de spas urbanos de vanguardia para AXEL Hotels en Madrid e Ibiza. Experiencias innovadoras.",
      en: "Management of cutting-edge urban spas for AXEL Hotels in Madrid and Ibiza. Innovative experiences."
    },
    longDescription: {
      es: `AXEL Hotels se dirige a un público cosmopolita y exigente que busca experiencias más allá de lo tradicional. En los proyectos de Madrid e Ibiza, el objetivo fue romper con el concepto clásico de spa y crear espacios de socialización y bienestar vibrantes.

      Diseñamos menús de tratamiento atrevidos y modernos, alineados con la filosofía "heterofriendly" y de libertad de la marca. La gestión operativa tuvo que adaptarse a horarios extendidos y a una demanda de servicios de estética avanzada y preparación para eventos sociales.

      El éxito radicó en entender el estilo de vida del cliente AXEL y ofrecer un producto wellness que se sintiera como una extensión natural de su experiencia de ocio.`,
      en: `AXEL Hotels targets a cosmopolitan and demanding audience seeking experiences beyond the traditional. In the Madrid and Ibiza projects, the goal was to break with the classic spa concept and create vibrant socialization and wellness spaces.

      We designed bold and modern treatment menus, aligned with the brand's "heterofriendly" and freedom philosophy. Operational management had to adapt to extended hours and a demand for advanced aesthetic services and social event preparation.

      Success lay in understanding the AXEL customer lifestyle and offering a wellness product that felt like a natural extension of their leisure experience.`
    },
    image: "/assets/new_gen/axel.png",
    chain: "axel",
    chainName: {
      es: "AXEL",
      en: "AXEL"
    },
    highlights: {
      es: ["Diseño vanguardista", "Público cosmopolita", "Ubicaciones premium"],
      en: ["Avant-garde design", "Cosmopolitan clientele", "Premium locations"]
    },
    results: {
      es: ['Posicionamiento como "Social Spa"', "Alta demanda de tratamientos pre-party", "Fuerte identidad de marca"],
      en: ['Positioning as "Social Spa"', "High demand for pre-party treatments", "Strong brand identity"]
    },
    category: "proyectos",
    categoryName: {
      es: "Proyectos",
      en: "Projects"
    }
  },
  {
    title: {
      es: "Proyectos Independientes Premium",
      en: "Premium Independent Projects"
    },
    description: {
      es: "Consultoría y gestión para hoteles independientes: Hotel Valencia Congress, Hacienda del Álamo, y más.",
      en: "Consulting and management for independent hotels: Hotel Valencia Congress, Hacienda del Álamo, and more."
    },
    longDescription: {
      es: `Los hoteles independientes ofrecen la libertad de crear conceptos totalmente únicos. He tenido el placer de trabajar con propiedades singulares como el Hotel Valencia Congress, Golf Resort Hacienda del Álamo, Hilton La Torre y el Hotel Pazo Los Escudos.

      En cada uno de estos proyectos, la clave ha sido conectar con la comunidad local. Por ejemplo, en Hacienda del Álamo, desarrollamos un exitoso programa de membresías que convirtió al spa en el club social de referencia de la zona. En el NH Collection Constanza, logramos una base de clientes fieles en menos de un año.

      Mi enfoque con los independientes es crear un modelo de negocio sostenible que no dependa únicamente de la ocupación del hotel, blindando así los ingresos del spa.`,
      en: `Independent hotels offer the freedom to create totally unique concepts. I have had the pleasure of working with unique properties such as Hotel Valencia Congress, Golf Resort Hacienda del Álamo, Hilton La Torre, and Hotel Pazo Los Escudos.

      In each of these projects, the key has been connecting with the local community. For example, at Hacienda del Álamo, we developed a successful membership program that turned the spa into the area's reference social club. At NH Collection Constanza, we achieved a loyal customer base in less than a year.

      My approach with independents is to create a sustainable business model that does not rely solely on hotel occupancy, thus shielding spa revenue.`
    },
    image: "/assets/new_gen/boutique.png",
    chain: "independientes",
    chainName: {
      es: "Independientes",
      en: "Independent"
    },
    highlights: {
      es: ["20+ proyectos boutique", "Identidades únicas", "Captación clientela local"],
      en: ["20+ boutique projects", "Unique identities", "Local clientele attraction"]
    },
    results: {
      es: ["Programas de membresía exitosos", "Reducción de la dependencia de la ocupación hotelera", "Creación de destinos wellness locales"],
      en: ["Successful membership programs", "Reduced dependence on hotel occupancy", "Creation of local wellness destinations"]
    },
    category: "formacion",
    categoryName: {
      es: "Formación",
      en: "Training"
    }
  }
];
const testimonials = [
  {
    quote: {
      es: "Eva transformó completamente nuestro spa. Su experiencia y visión estratégica nos permitieron incrementar nuestros ingresos en un 40% en tan solo 3 meses, mejorando simultáneamente la satisfacción de nuestros clientes.",
      en: "Eva completely transformed our spa. Her experience and strategic vision allowed us to increase our revenue by 40% in just 3 months, while simultaneously improving customer satisfaction."
    },
    name: "María González",
    position: {
      es: "Directora, Serenity Wellness Resort",
      en: "Director, Serenity Wellness Resort"
    },
    avatar: "/assets/new_gen/avatar_1.png"
  },
  {
    quote: {
      es: "El programa de formación que Eva desarrolló para nuestro equipo elevó nuestro nivel de servicio a estándares internacionales. Su enfoque práctico y su profundo conocimiento del sector han sido transformadores.",
      en: "The training program that Eva developed for our team elevated our service level to international standards. Her practical approach and deep industry knowledge have been transformative."
    },
    name: "Carlos Mendoza",
    position: {
      es: "CEO, Wellness Collective",
      en: "CEO, Wellness Collective"
    },
    avatar: "/assets/new_gen/avatar_2.png"
  },
  {
    quote: {
      es: "Contar con Eva como consultora durante la apertura de nuestro nuevo spa fue la mejor decisión que tomamos. Su atención al detalle, conocimiento operativo y capacidad para formar a nuestro equipo fueron excepcionales.",
      en: "Having Eva as a consultant during the opening of our new spa was the best decision we made. Her attention to detail, operational knowledge, and ability to train our team were exceptional."
    },
    name: "Laura Serrano",
    position: {
      es: "Propietaria, Pure Bliss Day Spa",
      en: "Owner, Pure Bliss Day Spa"
    },
    avatar: "/assets/new_gen/avatar_3.png"
  },
  {
    quote: {
      es: "La intervención de Eva como interim manager durante nuestra reestructuración fue clave para mantener la calidad del servicio mientras implementábamos cambios profundos en nuestra operativa.",
      en: "Eva's intervention as an interim manager during our restructuring was key to maintaining service quality while implementing deep changes in our operations."
    },
    name: "Javier Moreno",
    position: {
      es: "Director General, Luxury Spa Collection",
      en: "General Manager, Luxury Spa Collection"
    },
    avatar: "/assets/new_gen/avatar_4.png"
  }
];
const resources = [
  {
    title: {
      es: "KPIs esenciales para la gestión de spas",
      en: "Essential KPIs for spa management"
    },
    description: {
      es: "Descubre los indicadores clave que todo spa manager debe monitorizar para asegurar el éxito de su negocio.",
      en: "Discover the key indicators that every spa manager should monitor to ensure business success."
    },
    image: "/assets/new_gen/res_kpi.png",
    buttonText: {
      es: "Leer guía",
      en: "Read guide"
    },
    content: {
      es: [
        "## Introducción a los KPIs en el Spa",
        "La gestión de un spa no puede basarse únicamente en la intuición. Para garantizar la rentabilidad y la sostenibilidad del negocio, es fundamental monitorizar una serie de indicadores clave de rendimiento (KPIs).",
        "### 1. Ingreso por Hora de Tratamiento Disponible (RevPATH)",
        "Este es quizás el indicador más importante. Mide la eficiencia con la que utilizas tu inventario principal: el tiempo y el espacio.",
        "**Fórmula:** `Ingresos Totales de Spa / (Horas de Cabina Disponibles x Número de Cabinas)`",
        "### 2. Tasa de Ocupación de Cabinas",
        "Indica qué porcentaje de tu capacidad máxima estás utilizando. Una ocupación del 100% no siempre es ideal, ya que puede impedir reservas de última hora de clientes VIP.",
        "**Meta ideal:** Entre 75% y 85%.",
        "### 3. Ticket Medio (Average Ticket)",
        "Cuánto gasta en promedio cada cliente por visita. Aumentar este valor suele ser más rentable que adquirir nuevos clientes.",
        "**Estrategias:** Up-selling (ofrecer un tratamiento superior) y Cross-selling (vender productos retail).",
        "### 4. Ratio de Venta de Retail (Retail to Service Ratio)",
        "Mide qué porcentaje de tus ingresos totales proviene de la venta de productos. Un equipo bien formado debería ser capaz de recomendar productos para el cuidado en casa.",
        "**Meta:** El retail debería representar al menos el 20-25% de los ingresos totales.",
        "### 5. Tasa de Retención de Clientes",
        "Es mucho más costoso captar un nuevo cliente que mantener uno existente. Este KPI mide la lealtad de tu clientela.",
        "**Acción:** Implementar programas de fidelización y seguimiento post-tratamiento."
      ],
      en: [
        "## Introduction to Spa KPIs",
        "Spa management cannot rely solely on intuition. To ensure business profitability and sustainability, it is crucial to monitor a series of Key Performance Indicators (KPIs).",
        "### 1. Revenue Per Available Treatment Hour (RevPATH)",
        "This is perhaps the most important indicator. It measures how efficiently you are using your main inventory: time and space.",
        "**Formula:** `Total Spa Revenue / (Available Treatment Hours x Number of Treatment Rooms)`",
        "### 2. Treatment Room Occupancy Rate",
        "Indicates what percentage of your maximum capacity you are using. 100% occupancy is not always ideal, as it may prevent last-minute bookings from VIP guests.",
        "**Ideal Goal:** Between 75% and 85%.",
        "### 3. Average Ticket",
        "How much each client spends on average per visit. Increasing this value is usually more profitable than acquiring new clients.",
        "**Strategies:** Up-selling (offering a superior treatment) and Cross-selling (selling retail products).",
        "### 4. Retail to Service Ratio",
        "Measures what percentage of your total revenue comes from product sales. A well-trained team should be able to recommend home care products.",
        "**Goal:** Retail should represent at least 20-25% of total revenue.",
        "### 5. Client Retention Rate",
        "It is much more expensive to acquire a new client than to keep an existing one. This KPI measures the loyalty of your clientele.",
        "**Action:** Implement loyalty programs and post-treatment follow-up."
      ]
    },
    resourceType: "kpi"
  },
  {
    title: {
      es: "Checklist: 50 puntos para optimizar la experiencia",
      en: "Checklist: 50 points to optimize the experience"
    },
    description: {
      es: "Una lista exhaustiva de elementos a revisar para asegurar que tus clientes disfruten de una experiencia excepcional.",
      en: "A comprehensive list of items to review to ensure your clients enjoy an exceptional experience."
    },
    image: "/assets/new_gen/res_checklist.png",
    buttonText: {
      es: "Ver checklist",
      en: "View checklist"
    },
    content: {
      es: [
        "## La Experiencia de Cliente Perfecta",
        "Desde la reserva hasta la despedida, cada punto de contacto cuenta. Utiliza este checklist para auditar tu spa.",
        "### 📞 Fase 1: Reserva y Llegada",
        "- [ ] El teléfono se responde antes del tercer tono.",
        "- [ ] Se utiliza el nombre del cliente al menos tres veces durante la reserva.",
        "- [ ] Se envían confirmaciones automáticas por email/SMS 24h antes.",
        "- [ ] La recepción está impecable, sin papeles desordenados a la vista.",
        "- [ ] Se ofrece una bebida de bienvenida inmediatamente al llegar.",
        "### 🧖‍♀️ Fase 2: Vestuarios y Zonas Húmedas",
        "- [ ] Taquillas limpias y libres de objetos de clientes anteriores.",
        "- [ ] Albornoces y toallas esponjosos, sin hilos sueltos ni manchas.",
        "- [ ] Dispensadores de jabón/champú llenos y limpios.",
        "- [ ] Temperatura del agua de duchas y piscinas verificada cada 2 horas.",
        "- [ ] Música ambiental a volumen adecuado (apenas perceptible).",
        "### 💆‍♂️ Fase 3: El Tratamiento",
        "- [ ] El terapeuta se presenta con nombre y sonrisa.",
        "- [ ] Se realiza una consulta previa sobre contraindicaciones y preferencias.",
        "- [ ] La cabina tiene la iluminación y temperatura ajustadas antes de entrar.",
        "- [ ] Privacidad absoluta durante el cambio de ropa.",
        "- [ ] El masaje comienza y termina puntualmente.",
        "### 🛍️ Fase 4: Despedida y Retail",
        "- [ ] Se ofrecen recomendaciones de cuidado en casa (no venta agresiva).",
        "- [ ] Se acompaña al cliente a la recepción.",
        "- [ ] El proceso de pago es rápido y fluido.",
        "- [ ] Se invita al cliente a reservar su próxima cita.",
        "- [ ] Se envía una encuesta de satisfacción 24h después."
      ],
      en: [
        "## The Perfect Guest Experience",
        "From booking to farewell, every touchpoint matters. Use this checklist to audit your spa.",
        "### 📞 Phase 1: Booking & Arrival",
        "- [ ] Phone is answered before the third ring.",
        "- [ ] Client's name is used at least three times during booking.",
        "- [ ] Automated confirmations sent via email/SMS 24h prior.",
        "- [ ] Reception is spotless, no cluttered papers in sight.",
        "- [ ] A welcome drink is offered immediately upon arrival.",
        "### 🧖‍♀️ Phase 2: Locker Rooms & Wet Areas",
        "- [ ] Lockers clean and free of previous guests' items.",
        "- [ ] Robes and towels fluffy, no loose threads or stains.",
        "- [ ] Soap/shampoo dispensers full and clean.",
        "- [ ] Shower and pool water temperature checked every 2 hours.",
        "- [ ] Ambient music at appropriate volume (barely perceptible).",
        "### 💆‍♂️ Phase 3: The Treatment",
        "- [ ] Therapist introduces themselves with a name and smile.",
        "- [ ] Pre-treatment consultation on contraindications and preferences held.",
        "- [ ] Treatment room lighting and temperature adjusted before entry.",
        "- [ ] Absolute privacy ensuring clothing change.",
        "- [ ] Massage starts and ends punctually.",
        "### 🛍️ Phase 4: Farewell & Retail",
        "- [ ] Home care recommendations offered (no aggressive selling).",
        "- [ ] Client is escorted to reception.",
        "- [ ] Payment process is fast and smooth.",
        "- [ ] Client is invited to book their next appointment.",
        "- [ ] Satisfaction survey sent 24h later."
      ]
    },
    resourceType: "checklist"
  },
  {
    title: {
      es: "Plantilla: Plan de formación para equipos",
      en: "Template: Training plan for teams"
    },
    description: {
      es: "Una estructura base para desarrollar programas de formación efectivos para tu equipo de spa.",
      en: "A base structure for developing effective training programs for your spa team."
    },
    image: "/assets/new_gen/res_training.png",
    buttonText: {
      es: "Ver plan",
      en: "View plan"
    },
    content: {
      es: [
        "## Plan de Formación Continua",
        "Un equipo bien formado es el activo más valioso de un spa de lujo. Utiliza esta estructura para planificar el año.",
        "### Trimestre 1: Excelencia y Protocolos",
        "**Objetivo:** Estandarizar la calidad del servicio.",
        "1. **Semana 1:** Revisión de Estándares de Marca (Grooming, lenguaje, etiqueta).",
        "2. **Semana 2:** Protocolos de Bienvenida y Despedida (Role-playing).",
        "3. **Semana 3:** Gestión de Quejas y Recuperación de Servicio.",
        "4. **Semana 4:** Evaluación práctica de estándares.",
        "### Trimestre 2: Venta y Conocimiento de Producto",
        "**Objetivo:** Aumentar el ticket medio y venta retail.",
        "1. **Semana 1:** Ingredientes activos y beneficios de la línea principal.",
        "2. **Semana 2:** Técnicas de venta consultiva (Diagnóstico vs Venta).",
        "3. **Semana 3:** Cierre de ventas y manejo de objeciones.",
        "4. **Semana 4:** Concurso interno de ventas.",
        "### Trimestre 3: Técnica y Novedades",
        "**Objetivo:** Refrescar habilidades manuales e introducir nuevos tratamientos.",
        "1. **Semana 1:** Repaso de masaje Sueco y Tejido Profundo (Ergonomía del terapeuta).",
        "2. **Semana 2:** Formación en nuevo tratamiento de temporada.",
        "3. **Semana 3:** Aparatología (si aplica) y seguridad.",
        "4. **Semana 4:** Intercambio de tratamientos entre terapeutas (Team bonding).",
        "### Trimestre 4: Bienestar Emocional y Soft Skills",
        "**Objetivo:** Mejorar la conexión con el cliente y el clima laboral.",
        "1. **Semana 1:** Inteligencia emocional en el servicio.",
        "2. **Semana 2:** Gestión del estrés para terapeutas.",
        "3. **Semana 3:** Mindfulness aplicado al tratamiento.",
        "4. **Semana 4:** Evaluación anual de desempeño y plan de carrera."
      ],
      en: [
        "## Continuous Training Plan",
        "A well-trained team is the most valuable asset of a luxury spa. Use this structure to plan the year.",
        "### Quarter 1: Excellence & Protocols",
        "**Goal:** Standardize service quality.",
        "1. **Week 1:** Brand Standards Review (Grooming, language, etiquette).",
        "2. **Week 2:** Welcome and Farewell Protocols (Role-playing).",
        "3. **Week 3:** Complaint Management and Service Recovery.",
        "4. **Week 4:** Practical standards evaluation.",
        "### Quarter 2: Sales & Product Knowledge",
        "**Goal:** Increase average ticket and retail sales.",
        "1. **Week 1:** Active ingredients and benefits of the main line.",
        "2. **Week 2:** Consultative sales techniques (Diagnosis vs Sales).",
        "3. **Week 3:** Closing sales and handling objections.",
        "4. **Week 4:** Internal sales contest.",
        "### Quarter 3: Technique & News",
        "**Goal:** Refresh manual skills and introduce new treatments.",
        "1. **Week 1:** Swedish and Deep Tissue Massage Review (Therapist ergonomics).",
        "2. **Week 2:** Training on new seasonal treatment.",
        "3. **Week 3:** Equipment (if applicable) and safety.",
        "4. **Week 4:** Treatment exchange between therapists (Team bonding).",
        "### Quarter 4: Emotional Wellness & Soft Skills",
        "**Goal:** Improve connection with the client and work climate.",
        "1. **Week 1:** Emotional intelligence in service.",
        "2. **Week 2:** Stress management for therapists.",
        "3. **Week 3:** Mindfulness applied to treatment.",
        "4. **Week 4:** Annual performance evaluation and career plan."
      ]
    },
    resourceType: "training"
  }
];
const blogPosts = [
  {
    title: {
      es: "Tendencias Spa 2026: Del 'Mimo' a la Longevidad Científica",
      en: "Spa Trends 2026: From 'Pampering' to Scientific Longevity"
    },
    excerpt: {
      es: "Descubre las 5 tendencias que definirán el bienestar de lujo en 2026. Aviso para navegantes: si solo vendes masajes, te estás quedando atrás.",
      en: "Discover the 5 trends that will define luxury wellness in 2026. Warning: if you're only selling massages, you're falling behind."
    },
    image: "/attached_assets/blog_longevity_luxury_spa_v2.png",
    date: {
      es: "10 Febrero, 2026",
      en: "February 10, 2026"
    },
    category: {
      es: "Tendencias",
      en: "Trends"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "El mundo del wellness está cambiando a una velocidad vertiginosa. Lo que en 2024 era 'innovador', en 2026 será el estándar básico. Como consultora estratégica, mi trabajo es diferenciar entre modas pasajeras y cambios estructurales de mercado. Aquí te presento las 5 tendencias que realmente impactarán en la cuenta de resultados de los hoteles de lujo.",
        "**1. La Era de la Longevidad Femenina**",
        "Por fin, el sector deja de tratar a las mujeres como 'hombres pequeños'. En 2026, veremos programas clínicos diseñados específicamente para la biología femenina: optimización hormonal, gestión de la menopausia como una etapa de poder (no de declive) y salud ovárica. Los spas que ofrezcan programas de 'Longevity for Her' con respaldo médico captarán al segmento de mercado con mayor poder adquisitivo.",
        "**2. 'Social Wellness' vs. Soledad**",
        "La pandemia de soledad global ha creado una contra-tendencia: la socialización saludable. Los huéspedes ya no quieren encerrarse en una cabina oscura por 60 minutos. Buscan clubes de baño romanos modernos, saunas comunitarias de diseño y experiencias de contraste (frío/calor) en grupo. El spa se convierte en el nuevo club social, reemplazando al bar del hotel.",
        "**3. Dormir es el Nuevo Lujo (Clinical Sleep)**",
        "Ya no basta con una carta de almohadas. Los programas de sueño de 2026 incluyen diagnósticos clínicos de apnea, colchones con IA que regulan la temperatura en tiempo real y terapias de luz circadiana. Los hoteles que garanticen 'el mejor sueño de tu vida' con datos que lo respalden, podrán cobrar un premium significativo por habitación.",
        "**4. Biohacking Estético**",
        "La belleza se fusiona con la biotecnología. Olvida los tratamientos faciales superficiales. Hablamos de exosomas, terapia con células madre y láseres fríos que regeneran el colágeno a nivel celular. El cliente de lujo busca resultados visibles inmediatos y salud dérmica a largo plazo, no solo 'sentirse bien'.",
        "**5. La Integración de la IA Invisible**",
        "La tecnología no reemplazará al terapeuta, lo potenciará. Imagina un sistema que ajusta la música, la temperatura y la aromaterapia de la cabina basándose en la variabilidad de la frecuencia cardíaca (VFC) del cliente en tiempo real. Hiper-personalización automática para asegurar una relajación profunda.",
        "**¿Está tu spa preparado para 2026?**",
        "Adaptarse a estas tendencias no requiere necesariamente una reforma millonaria, pero sí un cambio de mentalidad y estrategia. Si quieres analizar cómo integrar estos conceptos en tu menú de servicios actual para aumentar tu ticket medio, hablemos."
      ],
      en: [
        "The wellness world is changing at breakneck speed. What was 'innovative' in 2024 will be the basic standard in 2026. As a strategic consultant, my job is to differentiate between passing fads and structural market changes. Here are the 5 trends that will truly impact the bottom line of luxury hotels.",
        "**1. The Era of Female Longevity**",
        "Finally, the sector stops treating women like 'small men'. In 2026, we will see clinical programs designed specifically for female biology: hormonal optimization, menopause management as a stage of power (not decline), and ovarian health. Spas offering medically-backed 'Longevity for Her' programs will capture the market segment with the highest purchasing power.",
        "**2. 'Social Wellness' vs. Loneliness**",
        "The global loneliness pandemic has created a counter-trend: healthy socialization. Guests no longer want to lock themselves in a dark room for 60 minutes. They seek modern Roman bath clubs, designer communal saunas, and group contrast (hot/cold) experiences. The spa becomes the new social club, replacing the hotel bar.",
        "**3. Sleep is the New Luxury (Clinical Sleep)**",
        "A pillow menu is no longer enough. 2026 sleep programs include clinical apnea diagnostics, AI mattresses that regulate temperature in real-time, and circadian light therapies. Hotels that guarantee 'the best sleep of your life' with backing data can charge a significant room premium.",
        "**4. Aesthetic Biohacking**",
        "Beauty fuses with biotechnology. Forget superficial facials. We are talking about exosomes, stem cell therapy, and cold lasers that regenerate collagen at a cellular level. The luxury client seeks immediate visible results and long-term dermal health, not just 'feeling good'.",
        "**5. Invisible AI Integration**",
        "Technology will not replace the therapist; it will empower them. Imagine a system that adjusts the room's music, temperature, and aromatherapy based on the client's Heart Rate Variability (HRV) in real-time. Automatic hyper-personalization to ensure deep relaxation.",
        "**Is your spa ready for 2026?**",
        "Adapting to these trends doesn't necessarily require a million-dollar renovation, but it does require a shift in mindset and strategy. If you want to analyze how to integrate these concepts into your current service menu to increase your average ticket, let's talk."
      ]
    }
  },
  {
    title: {
      es: "El Secreto de la Longevidad: Cómo los Hoteles de Lujo Están Innovando en Bienestar",
      en: "The Secret of Longevity: How Luxury Hotels Are Innovating in Wellness"
    },
    excerpt: {
      es: "Descubre cómo la ciencia de la longevidad y el biohacking están transformando la experiencia del spa de lujo, convirtiendo los hoteles en destinos de renovación biológica.",
      en: "Discover how longevity science and biohacking are transforming the luxury spa experience, turning hotels into destinations for biological renewal."
    },
    image: "/attached_assets/blog_longevity_luxury_spa_v2.png",
    date: {
      es: "12 Diciembre, 2025",
      en: "December 12, 2025"
    },
    category: {
      es: "Longevidad",
      en: "Longevity"
    },
    readTime: {
      es: "6 min lectura",
      en: "6 min read"
    },
    content: {
      es: [
        "El sector de la hospitalidad de lujo está experimentando una transformación sin precedentes en 2025. El huésped moderno ya no busca solo opulencia estética o relajación pasiva, sino una vitalidad medible y una extensión de su 'healthspan' (años de vida saludable). Los hoteles de élite están evolucionando para convertirse en verdaderos santuarios de longevidad, integrando medicina preventiva avanzada en sus ofertas de bienestar.",
        "**La Nueva Era del Medical Wellness de Lujo**",
        "Estamos presenciando la convergencia definitiva entre la hospitalidad y la medicina. Resorts en destinos como Suiza, Tailandia y ahora también en España, están incorporando clínicas completas dirigidas por equipos médicos multidisciplinares. Ya no hablamos solo de masajes, sino de diagnósticos moleculares, análisis de biomarcadores en tiempo real y terapias epigenéticas diseñadas para revertir el reloj biológico.",
        "**Tecnologías de Vanguardia al Servicio del Huésped**",
        "Entre las innovaciones más destacadas se encuentran las cámaras hiperbáricas de oxígeno, que saturan el plasma sanguíneo para acelerar la regeneración celular y la función cognitiva. La crioterapia de cuerpo entero, a temperaturas de -110°C, se ofrece no solo para la recuperación muscular de atletas, sino como un potente antiinflamatorio sistémico y estimulante del metabolismo. Además, terapias de fotobiomodulación (luz roja e infrarroja) se están estandarizando para mejorar la salud mitocondrial mientras el huésped descansa.",
        "**Nutrición de Precisión y Suplementación**",
        "La experiencia culinaria también se ha redefinido. Los menús ya no se basan solo en el sabor, sino en la densidad nutricional y la compatibilidad genética. A través de pruebas de nutrigenómica, los chefs diseñan planes de alimentación personalizados que reducen la inflamación y optimizan la energía. Esto se complementa con 'barras de alquimia' donde se sirven sueros intravenosos (IV Drips) de vitaminas y nootrópicos, personalizados según las carencias específicas detectadas en el check-in.",
        "**El Objetivo Final: Transformación Biológica**",
        "El lujo en 2025 se define por el resultado: devolver al huésped a su vida cotidiana no solo descansado, sino biológicamente optimizado. Los programas de sueño, por ejemplo, utilizan colchones inteligentes y monitoreo biométrico para reestructurar la arquitectura del sueño del cliente. En definitiva, estos hoteles no venden camas, venden años de vida de calidad."
      ],
      en: [
        "The luxury hospitality sector is undergoing an unprecedented transformation in 2025. The modern guest is no longer seeking just aesthetic opulence or passive relaxation, but measurable vitality and an extension of their 'healthspan'. Elite hotels are evolving into true longevity sanctuaries, integrating advanced preventive medicine into their wellness offerings.",
        "**The New Era of Luxury Medical Wellness**",
        "We are witnessing the definitive convergence between hospitality and medicine. Resorts in destinations like Switzerland, Thailand, and now Spain are incorporating full clinics led by multidisciplinary medical teams. We are no longer talking just about massages, but about molecular diagnostics, real-time biomarker analysis, and epigenetic therapies designed to reverse the biological clock.",
        "**Cutting-Edge Technologies at the Guest's Service**",
        "Among the most notable innovations are hyperbaric oxygen chambers, which saturate blood plasma to accelerate cellular regeneration and cognitive function. Whole-body cryotherapy, at temperatures of -110°C, is offered not only for athlete muscle recovery but as a potent systemic anti-inflammatory and metabolic booster. Additionally, photobiomodulation (red and infrared light) therapies are becoming standard to improve mitochondrial health while the guest rests.",
        "**Precision Nutrition and Supplementation**",
        "The culinary experience has also been redefined. Menus are no longer based solely on flavor, but on nutritional density and genetic compatibility. Through nutrigenomics testing, chefs design personalized meal plans that reduce inflammation and optimize energy. This is complemented by 'alchemy bars' serving intravenous (IV) vitamin drips and nootropics, customized according to specific deficiencies detected at check-in.",
        "**The Ultimate Goal: Biological Transformation**",
        "Luxury in 2025 is defined by the outcome: returning the guest to their daily life not just rested, but biologically optimized. Sleep programs, for example, use smart mattresses and biometric monitoring to restructure the client's sleep architecture. Ultimately, these hotels are not selling beds; they are selling years of quality life."
      ]
    }
  },
  {
    title: {
      es: "IA y la Hiper-personalización en el Wellness",
      en: "AI & Hyper-personalization in Wellness"
    },
    excerpt: {
      es: "Cómo el Big Data, la Inteligencia Artificial y los wearables están redefiniendo los tratamientos a medida, anticipando las necesidades del cliente antes de que las exprese.",
      en: "How Big Data, Artificial Intelligence, and wearables are redefining bespoke treatments, anticipating client needs before they are even expressed."
    },
    image: "/assets/new_gen/blog_ai.png",
    date: {
      es: "15 Enero, 2025",
      en: "January 15, 2025"
    },
    category: {
      es: "Tecnología",
      en: "Technology"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "La inteligencia artificial (IA) ha dejado de ser una promesa futurista para convertirse en el cerebro invisible que orquesta la experiencia perfecta en los spas de lujo de 2025. La 'talla única' ha muerto; hoy, el lujo es sinónimo de hiper-personalización basada en datos.",
        "**El Viaje del Cliente Impulsado por Datos**",
        "Desde el momento de la reserva, algoritmos predictivos analizan el historial del cliente, sus preferencias declaradas y datos biométricos compartidos (desde sus propios wearables) para diseñar itinerarios a medida. Imagina llegar a tu habitación y que la iluminación, la temperatura y la aromaterapia estén ajustadas automáticamente para contrarrestar tu jet lag específico, basándose en tus datos de vuelo y ritmo circadiano.",
        "**Diagnósticos de Precisión Clínica**",
        "En la cabina, la tecnología eleva la terapia manual. Escáneres de piel impulsados por IA analizan capas dérmicas invisibles al ojo humano, detectando daño solar, niveles de hidratación y elasticidad. Esto permite al terapeuta (o al sistema automatizado) crear mezclas de productos 'in-situ' con las concentraciones exactas de activos que la piel necesita en ese preciso instante. No es magia, es alquimia digital.",
        "**Tecnología Invisible y Empatía Aumentada**",
        "Lejos de deshumanizar el servicio, la IA actúa como un 'co-terapeuta'. Monitorea los signos vitales del cliente durante un masaje para sugerir al terapeuta cambios en la presión o el ritmo para maximizar la relajación parasimpática. Además, libera al personal de tareas administrativas, permitiéndoles centrarse en la conexión emocional. La tecnología se vuelve invisible, operando en segundo plano para que la experiencia humana brille con mayor intensidad.",
        "**El Futuro: Bienestar Predictivo**",
        "El siguiente paso es el bienestar predictivo: sistemas que no solo reaccionan a cómo te sientes, sino que anticipan cómo te sentirás. Mediante el análisis continuo de variabilidad de frecuencia cardíaca (VFC) y calidad del sueño, tu spa de confianza podrá sugerirte intervenciones preventivas antes de que aparezcan los síntomas de agotamiento o enfermedad."
      ],
      en: [
        "Artificial intelligence (AI) has moved from a futuristic promise to the invisible brain orchestrating the perfect experience in the luxury spas of 2025. 'One size fits all' is dead; today, luxury is synonymous with data-driven hyper-personalization.",
        "**The Data-Driven Guest Journey**",
        "From the moment of booking, predictive algorithms analyze the client's history, stated preferences, and shared biometric data (from their own wearables) to design bespoke itineraries. Imagine arriving at your room and having the lighting, temperature, and aromatherapy automatically adjusted to counteract your specific jet lag, based on your flight data and circadian rhythm.",
        "**Clinical Precision Diagnostics**",
        "In the treatment room, technology elevates manual therapy. AI-driven skin scanners analyze dermal layers invisible to the human eye, detecting sun damage, hydration levels, and elasticity. This allows the therapist (or automated system) to create product blends 'in-situ' with the exact concentrations of actives the skin needs at that precise moment. It's not magic, it's digital alchemy.",
        "**Invisible Technology and Augmented Empathy**",
        "Far from dehumanizing service, AI acts as a 'co-therapist'. It monitors the client's vital signs during a massage to suggest changes in pressure or rhythm to the therapist to maximize parasympathetic relaxation. Additionally, it frees staff from administrative tasks, allowing them to focus on emotional connection. Technology becomes invisible, operating in the background so the human experience shines brighter.",
        "**The Future: Predictive Wellness**",
        "The next step is predictive wellness: systems that not only react to how you feel but anticipate how you will feel. Through continuous analysis of heart rate variability (HRV) and sleep quality, your trusted spa will be able to suggest preventive interventions before symptoms of burnout or illness appear."
      ]
    }
  },
  {
    title: {
      es: "La Revolución de la Longevidad y el Biohacking",
      en: "The Longevity Revolution & Biohacking"
    },
    excerpt: {
      es: "Más allá de la relajación: cámaras hiperbáricas, crioterapia y sueros IV para optimizar la salud celular y el rendimiento cognitivo.",
      en: "Beyond relaxation: hyperbaric chambers, cryotherapy, and IV drips to optimize cellular health and cognitive performance."
    },
    image: "/attached_assets/blog_longevity_luxury_spa_v2.png",
    date: {
      es: "02 Febrero, 2025",
      en: "February 02, 2025"
    },
    category: {
      es: "Innovación",
      en: "Innovation"
    },
    readTime: {
      es: "7 min lectura",
      en: "7 min read"
    },
    content: {
      es: [
        "El término 'spa' (Salus Per Aquam) se está redefiniendo hacia 'Salus Per Scientiam'. Los clientes de alto nivel adquisitivo están impulsando la transición de la relajación hedonista hacia el 'Biohacking': el uso de ciencia y tecnología para controlar la propia biología y optimizar el rendimiento físico y mental.",
        "**El Arsenal del Biohacker en el Hotel**",
        "Las instalaciones de spa modernas parecen cada vez más laboratorios de la NASA. La **Crioterapia de Cuerpo Entero** es una de las estrellas; exposiciones breves a frío extremo provocan una cascada de endorfinas y una vasoconstricción masiva que, al liberarse, inunda los tejidos de sangre oxigenada y nutrientes. Es el 'reset' metabólico definitivo.",
        "Por otro lado, la **Oxigenación Hiperbárica (HBOT)** ofrece lo opuesto: presurizar el cuerpo para forzar la entrada de oxígeno en fluidos donde normalmente no llega, acelerando la curación de tejidos, la neuroplasticidad y combatiendo la fatiga crónica típica de los ejecutivos de alto nivel.",
        "**Sueros IV y Nutrición Celular**",
        "La suplementación oral tiene límites de absorción. Por eso, los 'Drip Lounges' son el nuevo bar de moda. Tratamientos intravenosos de NAD+ (una coenzima vital para la energía celular que disminuye con la edad), glutatión (el antioxidante maestro) y complejos vitamínicos se administran mientras el cliente disfruta de vistas al mar o una sesión de meditación guiada. El efecto es casi inmediato: claridad mental, energía renovada y una piel radiante desde el interior.",
        "**Neuro-hacking y Salud Mental**",
        "El biohacking no es solo físico. Tecnologías de neurofeedback y estimulación magnética transcraneal (TMS) suave están entrando en los spas para entrenar el cerebro hacia estados de calma profunda (ondas Alpha/Theta) o concentración máxima (ondas Beta/Gamma). Combinado con tanques de flotación privación sensorial, estas herramientas ofrecen un atajo hacia estados meditativos que normalmente requerirían años de práctica.",
        "Esta revolución marca el fin del bienestar pasivo. El huésped es ahora un participante activo e informado en la optimización de su propia máquina biológica."
      ],
      en: [
        "The term 'spa' (Salus Per Aquam) is being redefined towards 'Salus Per Scientiam'. High-net-worth clients are driving the transition from hedonistic relaxation to 'Biohacking': the use of science and technology to control one's own biology and optimize physical and mental performance.",
        "**The Biohacker's Arsenal at the Hotel**",
        "Modern spa facilities increasingly resemble NASA laboratories. **Whole-Body Cryotherapy** is one of the stars; brief exposures to extreme cold trigger an endorphin cascade and massive vasoconstriction which, upon release, floods tissues with oxygenated blood and nutrients. It is the ultimate metabolic 'reset'.",
        "On the other hand, **Hyperbaric Oxygen Therapy (HBOT)** offers the opposite: pressurizing the body to force oxygen into fluids where it normally doesn't reach, accelerating tissue healing, neuroplasticity, and combating the chronic fatigue typical of high-level executives.",
        "**IV Drips and Cellular Nutrition**",
        "Oral supplementation has absorption limits. That's why 'Drip Lounges' are the new trendy bar. Intravenous treatments of NAD+ (a vital coenzyme for cellular energy that declines with age), glutathione (the master antioxidant), and vitamin complexes are administered while the client enjoys ocean views or a guided meditation session. The effect is almost immediate: mental clarity, renewed energy, and radiant skin from the inside out.",
        "**Neuro-hacking and Mental Health**",
        "Biohacking is not just physical. Neurofeedback technologies and mild transcranial magnetic stimulation (TMS) are entering spas to train the brain towards states of deep calm (Alpha/Theta waves) or peak focus (Beta/Gamma waves). Combined with sensory deprivation float tanks, these tools offer a shortcut to meditative states that would normally require years of practice.",
        "This revolution marks the end of passive wellness. The guest is now an active and informed participant in the optimization of their own biological machine."
      ]
    }
  },
  {
    title: {
      es: "Eco-Lujo: Sostenibilidad como Estándar Premium",
      en: "Eco-Luxury: Sustainability as a Premium Standard"
    },
    excerpt: {
      es: "Por qué los spas de lujo están liderando la 'Blue Beauty', eliminando plásticos y adoptando la arquitectura bioclimática para un bienestar consciente.",
      en: "Why luxury spas are leading 'Blue Beauty', eliminating plastics, and adopting bioclimatic architecture for conscious wellness."
    },
    image: "/assets/new_gen/blog_eco.png",
    date: {
      es: "20 Febrero, 2025",
      en: "February 20, 2025"
    },
    category: {
      es: "Sostenibilidad",
      en: "Sustainability"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "En 2025, la ostentación derrochadora ha sido reemplazada por el lujo consciente. El 'Eco-Lujo' establece que no puede haber bienestar personal si es a costa del bienestar planetario. Los spas más exclusivos del mundo están demostrando que la sostenibilidad extrema y el confort supremo no son mutuamente excluyentes, sino sinérgicos.",
        "**Blue Beauty y la Protección de los Océanos**",
        "Más allá de la 'Green Beauty', la tendencia dominante es la 'Blue Beauty': cosmética diseñada para minimizar el impacto en la vida marina. Los spas de resorts costeros están eliminando filtros solares tóxicos (como la oxibenzona) y utilizando exfoliantes a base de sal o semillas, desterrando para siempre los microplásticos. Además, marcas de lujo están utilizando envases hechos de plásticos recuperados del océano, cerrando el círculo de residuos.",
        "**Arquitectura Bioclimática y Espacios Vivos**",
        "El edificio del spa ya no es una caja climatizada artificialmente. La arquitectura bioclimática utiliza la orientación solar, la ventilación cruzada natural y materiales térmicos locales (como piedra y madera certificada) para reducir drásticamente la huella de carbono. El diseño biofílico —integrar muros vegetales, luz natural cenital y vistas ininterrumpidas a la naturaleza— no es solo estético; está probado que reduce los niveles de cortisol y mejora la recuperación del huésped.",
        "**Cero Residuos y Economía Circular**",
        "El desperdicio es el enemigo del lujo moderno. Los spas están adoptando políticas de 'Cero Residuos': desde zapatillas de spa biodegradables o lavables hasta la eliminación total de botellas de agua de plástico en favor de sistemas de filtración de agua mineralizada in-situ. Los textiles son de lino orgánico o bambú, que requieren menos agua y pesticidas que el algodón convencional.",
        "**Ética y Comunidad Local**",
        "Finalmente, el eco-lujo abarca lo social. Los tratamientos 'Signature' ahora destacan ingredientes autóctonos (Km 0), apoyando a cooperativas de agricultores locales y preservando tradiciones curativas ancestrales. El lujo se convierte así en un vehículo para la regeneración cultural y ambiental, ofreciendo al huésped una conexión auténtica y respetuosa con el destino."
      ],
      en: [
        "In 2025, wasteful ostentation has been replaced by conscious luxury. 'Eco-Luxury' establishes that personal wellness cannot come at the cost of planetary wellness. The world's most exclusive spas are demonstrating that extreme sustainability and supreme comfort are not mutually exclusive, but synergistic.",
        "**Blue Beauty and Ocean Protection**",
        "Beyond 'Green Beauty', the dominant trend is 'Blue Beauty': cosmetics designed to minimize impact on marine life. Coastal resort spas are eliminating toxic sunscreens (like oxybenzone) and using salt or seed-based scrubs, banishing microplastics forever. Furthermore, luxury brands are using packaging made from ocean-recovered plastics, closing the waste loop.",
        "**Bioclimatic Architecture and Living Spaces**",
        "The spa building is no longer an artificially climatized box. Bioclimatic architecture uses solar orientation, natural cross-ventilation, and local thermal materials (like stone and certified wood) to drastically reduce the carbon footprint. Biophilic design—integrating plant walls, overhead natural light, and uninterrupted views of nature—is not just aesthetic; it is proven to reduce cortisol levels and enhance guest recovery.",
        "**Zero Waste and Circular Economy**",
        "Waste is the enemy of modern luxury. Spas are adopting 'Zero Waste' policies: from biodegradable or washable spa slippers to the total elimination of plastic water bottles in favor of in-situ mineralized water filtration systems. Textiles are organic linen or bamboo, requiring less water and pesticides than conventional cotton.",
        "**Ethics and Local Community**",
        "Finally, eco-luxury embraces the social aspect. 'Signature' treatments now highlight indigenous ingredients (0 Km), supporting local farmer cooperatives and preserving ancestral healing traditions. Luxury thus becomes a vehicle for cultural and environmental regeneration, offering the guest an authentic and respectful connection with the destination."
      ]
    }
  },
  {
    title: {
      es: "Bienestar Mental y Mindfulness Integrado",
      en: "Mental Wellness & Integrated Mindfulness"
    },
    excerpt: {
      es: "La fusión de terapias tradicionales con prácticas de meditación y respiración para una salud holística.",
      en: "Merging traditional therapies with meditation and breathwork for holistic health."
    },
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: {
      es: "05 Marzo, 2025",
      en: "March 05, 2025"
    },
    category: {
      es: "Mindfulness",
      en: "Mindfulness"
    },
    readTime: {
      es: "6 min lectura",
      en: "6 min read"
    },
    content: {
      es: [
        "La salud mental ha tomado el protagonismo en el bienestar global. Los spas están respondiendo integrando prácticas de mindfulness y gestión del estrés directamente en sus menús de tratamientos tradicionales.",
        "Ya no se trata solo de un masaje relajante, sino de una experiencia que combina técnicas manuales con respiración guiada (Breathwork) y meditación. Los terapeutas están siendo formados para guiar a los clientes hacia estados de relajación profunda del sistema nervioso, no solo muscular.",
        "Los baños de sonido (Sound Baths) con cuencos tibetanos o gongs, y las sesiones de flotación en tanques de privación sensorial, son cada vez más populares como herramientas para desconectar la mente. El spa se convierte así en un santuario para la salud mental, ofreciendo un refugio seguro contra la sobreestimulación digital y el estrés crónico."
      ],
      en: [
        "Mental health has taken center stage in global wellness. Spas are responding by integrating mindfulness and stress management practices directly into their traditional treatment menus.",
        "It is no longer just about a relaxing massage, but an experience that combines manual techniques with guided breathing (Breathwork) and meditation. Therapists are being trained to guide clients into states of deep nervous system relaxation, not just muscular.",
        "Sound Baths with Tibetan bowls or gongs, and flotation sessions in sensory deprivation tanks, are becoming increasingly popular as tools to disconnect the mind. The spa thus becomes a sanctuary for mental health, offering a safe haven against digital overstimulation and chronic stress."
      ]
    }
  },
  {
    title: {
      es: "Menopausia: Adaptando el Spa a la Salud Hormonal",
      en: "Menopause: Adapting the Spa to Hormonal Health"
    },
    excerpt: {
      es: "Nuevos protocolos y retiros diseñados específicamente para apoyar a las mujeres en esta etapa vital.",
      en: "New protocols and retreats designed specifically to support women during this vital stage."
    },
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: {
      es: "12 Marzo, 2025",
      en: "March 12, 2025"
    },
    category: {
      es: "Salud Femenina",
      en: "Women's Health"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "Históricamente ignorada, la menopausia está siendo finalmente reconocida como una etapa vital que requiere atención especializada en el mundo del wellness. Los spas están creando programas específicos para apoyar a las mujeres durante el perimenopausia y la menopausia.",
        "Estos programas incluyen tratamientos para aliviar síntomas como los sofocos, el insomnio y los cambios en la piel, utilizando productos con fitoestrógenos y técnicas de enfriamiento. Pero también abordan el bienestar emocional, ofreciendo círculos de mujeres y talleres educativos.",
        "La adaptación de las instalaciones, con control de temperatura individualizado en las cabinas y opciones de ropa de cama transpirable, demuestra una comprensión profunda de las necesidades fisiológicas. Es un movimiento hacia un wellness más inclusivo y empático que celebra y apoya a la mujer en todas sus etapas."
      ],
      en: [
        "Historically ignored, menopause is finally being recognized as a vital stage requiring specialized attention in the wellness world. Spas are creating specific programs to support women during perimenopause and menopause.",
        "These programs include treatments to alleviate symptoms such as hot flashes, insomnia, and skin changes, using products with phytoestrogens and cooling techniques. But they also address emotional well-being, offering women's circles and educational workshops.",
        "Adapting facilities, with individualized temperature control in treatment rooms and breathable bedding options, demonstrates a deep understanding of physiological needs. It is a movement towards a more inclusive and empathetic wellness that celebrates and supports women in all their stages."
      ]
    }
  },
  {
    title: {
      es: "Efecto WOW: Redefiniendo la Experiencia de Lujo en Spas",
      en: "WOW Effect: Redefining the Luxury Spa Experience"
    },
    excerpt: {
      es: "Descubre cómo la personalización extrema, la tecnología inmersiva y el diseño sensorial crean momentos inolvidables que fidelizan al cliente más exigente.",
      en: "Discover how extreme personalization, immersive technology, and sensory design create unforgettable moments that build loyalty with the most demanding clients."
    },
    image: "/attached_assets/blog_wow_effect_spa.png",
    date: {
      es: "25 Marzo, 2025",
      en: "March 25, 2025"
    },
    category: {
      es: "Tendencias",
      en: "Trends"
    },
    readTime: {
      es: "6 min lectura",
      en: "6 min read"
    },
    content: {
      es: [
        "En el competitivo mundo del bienestar de lujo, la excelencia técnica ya no es suficiente. El cliente de hoy busca emoción, sorpresa y una conexión profunda. Esto es el 'Efecto WOW': esa fracción de segundo en la que las expectativas no solo se cumplen, sino que se pulverizan, dejando una huella emocional indeleble.",
        "**La Personalización Radical como Norma**",
        "El verdadero lujo es sentirse único. El 'Efecto WOW' comienza mucho antes de que el cliente cruce la puerta. Sistemas de CRM avanzados e Inteligencia Artificial permiten anticipar deseos no expresados: desde la temperatura preferida de la camilla hasta la selección musical basada en el estado de ánimo actual del huésped. No es magia, es empatía amplificada por datos.",
        "**Arquitectura de los Sentidos**",
        "Los spas más impactantes de 2025 son obras maestras de diseño sensorial. Hablamos de espacios de transición inmersivos donde la iluminación circadiana, aromas de diseño molecular y paisajes sonoros biófilos preparan el sistema nervioso para la terapia. El diseño ya no es estático; respira y se adapta al usuario, creando una atmósfera que envuelve y transporta.",
        "**Tecnología que Humaniza**",
        "Lejos de ser fría, la tecnología bien aplicada intensifica la calidez del servicio. Desde 'espejos mágicos' que analizan la piel y proyectan los resultados en tiempo real, hasta tumbonas de gravedad cero con terapia vibroacústica. El 'WOW' surge cuando la innovación tecnológica resuelve una necesidad de bienestar de una manera que el cliente nunca imaginó posible.",
        "**El Factor Humano: La Última Frontera**",
        "Sin embargo, la tecnología y el diseño son solo el escenario. El verdadero protagonista del 'Efecto WOW' es el terapeuta. Profesionales empoderados con inteligencia emocional, capaces de leer el lenguaje no verbal y adaptar cada movimiento, cada palabra, al momento presente. Cuando la intuición humana se encuentra con la excelencia operativa, se crea la magia pura."
      ],
      en: [
        "In the competitive world of luxury wellness, technical excellence is no longer enough. Today's client seeks emotion, surprise, and a deep connection. This is the 'WOW Effect': that fraction of a second when expectations are not just met, but shattered, leaving an indelible emotional mark.",
        "**Radical Personalization as the Norm**",
        "True luxury is feeling unique. The 'WOW Effect' begins long before the client walks through the door. Advanced CRM systems and Artificial Intelligence allow anticipating unexpressed desires: from the preferred treatment bed temperature to a music selection based on the guest's current mood. It's not magic, it's empathy amplified by data.",
        "**Architecture of the Senses**",
        "The most impactful spas of 2025 are masterpieces of sensory design. We are talking about immersive transition spaces where circadian lighting, molecular designer scents, and biophilic soundscapes prepare the nervous system for therapy. Design is no longer static; it breathes and adapts to the user, creating an atmosphere that envelops and transports.",
        "**Technology that Humanizes**",
        "Far from being cold, well-applied technology intensifies the warmth of service. From 'magic mirrors' that analyze skin and project results in real-time, to zero-gravity loungers with vibroacoustic therapy. The 'WOW' emerges when technological innovation solves a wellness need in a way the client never imagined possible.",
        "**The Human Factor: The Final Frontier**",
        "However, technology and design are just the stage. The true protagonist of the 'WOW Effect' is the therapist. Professionals empowered with emotional intelligence, capable of reading non-verbal language and adapting every movement, every word, to the present moment. When human intuition meets operational excellence, pure magic is created."
      ]
    }
  }
];
const translations = {
  es: {
    "header.about": "Sobre mí",
    "header.services": "Servicios",
    "header.ai": "IA para Wellness",
    "header.portfolio": "Portfolio",
    "header.testimonials": "Testimonios",
    "header.blog": "Blog",
    "header.contact": "Contacto",
    "about.title": "Sobre mí",
    "about.subtitle": "Eva Pérez: Spa Manager y Consultora de Wellness",
    "about.experience": "Con más de 20 años de experiencia en el sector del wellness y la gestión de spas, he dedicado mi carrera a transformar espacios de bienestar en experiencias rentables y memorables.",
    "about.approach": "Mi enfoque integral abarca desde la optimización de operaciones y formación de equipos hasta el diseño de experiencias únicas para el cliente y la implementación de estrategias de rentabilidad.",
    "about.speaker": "Además, como ponente internacional, comparto regularmente mi conocimiento en conferencias y eventos del sector, donde transmito las mejores prácticas y tendencias en gestión de spas y bienestar.",
    "about.stats.years": "Años de experiencia en el sector",
    "about.stats.projects": "Proyectos exitosos completados",
    "about.stats.conferences": "Conferencias impartidas",
    "about.stats.trained": "Profesionales formados",
    "about.stats.attendees": "Asistentes a conferencias",
    "about.contact": "Contactar",
    "about.portfolio": "Ver Portfolio",
    "about.speakingCaption": "Eva Pérez durante una conferencia sobre gestión de spas",
    "services.title": "Servicios",
    "services.subtitle": "Soluciones Profesionales para el Sector Wellness",
    "services.moreInfo": "Más información",
    "services.strategy.title": "Consultoría Estratégica",
    "services.strategy.description": "Análisis y diagnóstico de operaciones, desarrollo de planes estratégicos y asesoramiento para optimizar la rentabilidad de tu negocio wellness.",
    "services.projects.title": "Gestión de Proyectos",
    "services.projects.description": "Dirección integral en la creación o renovación de spas, desde la conceptualización hasta la implementación y puesta en marcha.",
    "services.training.title": "Formación y Desarrollo",
    "services.training.description": "Programas de capacitación a medida para equipos de trabajo en spas, enfocados en protocolos, ventas, servicio y gestión.",
    "services.interim.title": "Interim Management",
    "services.interim.description": "Dirección temporal de spas y centros wellness durante periodos de transición o para implementar proyectos específicos de mejora.",
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Proyectos y Colaboraciones Destacadas",
    "portfolio.description": "Una selección de casos de éxito que demuestran mi enfoque para transformar espacios wellness y optimizar su funcionamiento.",
    "portfolio.viewCase": "Ver caso completo",
    "portfolio.viewMore": "Ver más proyectos",
    "portfolio.all": "Todos",
    "portfolio.consulting": "Consultoría",
    "portfolio.projects": "Proyectos",
    "portfolio.training": "Formación",
    "portfolio.interim": "Interim",
    "testimonials.title": "Testimonios",
    "testimonials.subtitle": "Lo que dicen mis clientes",
    "testimonials.description": "Descubre cómo mis servicios han transformado negocios wellness y equipos profesionales.",
    "blog.title": "Blog",
    "blog.subtitle": "Últimos artículos y novedades",
    "blog.description": "Artículos especializados sobre gestión de spas, tendencias del sector wellness y estrategias de optimización.",
    "blog.readArticle": "Leer artículo",
    "blog.viewAll": "Ver todos los artículos",
    "blog.readMore": "Leer más",
    "resources.title": "Recursos",
    "resources.subtitle": "Herramientas y guías para profesionales del sector",
    "resources.download": "Descargar",
    "newsletter.title": "Suscríbete a mi newsletter",
    "newsletter.subtitle": "Recibe mensualmente contenido exclusivo, consejos y las últimas tendencias en gestión de spas.",
    "newsletter.subscribe": "Suscribirme",
    "newsletter.sending": "Enviando...",
    "newsletter.leadMagnetTitle": "Descarga GRATIS la Guía de Rentabilidad",
    "newsletter.leadMagnetSubtitle": "Descubre los 10 puntos críticos para aumentar el margen de tu spa en 30 días. Incluye plantilla de auditoría.",
    "newsletter.downloadButton": "Descargar Guía Ahora",
    "header.bookAudit": "Solicitar Auditoría",
    "hero.ctaPrimary": "Mejorar mi Spa Ahora",
    "hero.ctaSecondary": "Ver Casos de Éxito",
    "contact.title": "Contacto",
    "contact.subtitle": "¿Hablamos sobre tu proyecto?",
    "contact.description": "Completa el formulario y me pondré en contacto contigo para programar una consulta inicial gratuita donde podremos hablar sobre tus necesidades específicas.",
    "contact.email": "Email",
    "contact.phone": "Teléfono",
    "contact.location": "Ubicación",
    "contact.form.name": "Nombre",
    "contact.form.email": "Email",
    "contact.form.company": "Empresa/Organización",
    "contact.form.service": "Servicio de interés",
    "contact.form.message": "Mensaje",
    "contact.form.privacy": "Acepto la política de privacidad y el tratamiento de mis datos para recibir comunicaciones.",
    "contact.form.send": "Enviar mensaje",
    "contact.form.sending": "Enviando...",
    "footer.rights": "Todos los derechos reservados",
    "footer.design": "Diseñado con",
    "booking.title": "Reserva una consulta con Eva",
    "booking.subtitle": "Selecciona una fecha y hora para tu consulta personalizada",
    "booking.selectDate": "Selecciona una fecha",
    "booking.chooseDay": "Elige el día para tu consulta",
    "booking.weekendUnavailable": "Los fines de semana no están disponibles para reservas.",
    "booking.selectTime": "Selecciona una hora",
    "booking.availableTimes": "Horarios disponibles para el",
    "booking.noSlots": "No hay horarios disponibles para esta fecha. Por favor, selecciona otro día.",
    "booking.back": "Volver",
    "booking.complete": "Completa tu reserva",
    "booking.details": "Reservando para el",
    "booking.fullName": "Nombre completo",
    "booking.namePlaceholder": "Tu nombre",
    "booking.email": "Email",
    "booking.emailPlaceholder": "tu@email.com",
    "booking.phone": "Teléfono (opcional)",
    "booking.phonePlaceholder": "Tu teléfono",
    "booking.company": "Empresa (opcional)",
    "booking.companyPlaceholder": "Tu empresa",
    "booking.service": "Servicio",
    "booking.selectService": "Selecciona un servicio",
    "booking.message": "Mensaje (opcional)",
    "booking.messagePlaceholder": "Cuéntanos brevemente sobre tu proyecto o consulta",
    "booking.privacy": "Acepto la política de privacidad",
    "booking.privacyDesc": "Al marcar esta casilla, aceptas nuestra política de privacidad.",
    "booking.confirm": "Confirmar reserva",
    "booking.sending": "Enviando...",
    "booking.successTitle": "¡Reserva completada!",
    "booking.successDesc": "Tu cita ha sido reservada correctamente. Recibirás un email de confirmación.",
    "booking.errorTitle": "Error en la reserva",
    "booking.errorDesc": "No se pudo completar la reserva. Por favor, inténtalo de nuevo.",
    "booking.fetchError": "No se pudieron cargar los horarios disponibles",
    "booking.val.name": "El nombre debe tener al menos 2 caracteres",
    "booking.val.email": "Por favor introduce un email válido",
    "booking.val.service": "Por favor selecciona un servicio",
    "booking.val.privacy": "Debes aceptar la política de privacidad",
    "chatbot.welcome": "¡Hola! Soy el asistente virtual de Eva Pérez. ¿En qué estás interesado?",
    "chatbot.error": "Lo siento, estoy teniendo problemas para conectarme.",
    "chatbot.placeholder": "Escribe tu mensaje...",
    "chatbot.send": "Enviar",
    "chatbot.typing": "Escribiendo...",
    "chatbot.title": "Asistente Virtual",
    "chatbot.subtitle": "Experta en estrategia wellness",
    "chatbot.suggestions": "Puedes preguntar sobre:",
    "chatbot.disclaimer": "Potenciado por IA para información general."
  },
  en: {
    "header.about": "About me",
    "header.services": "Services",
    "header.ai": "AI for Wellness",
    "header.portfolio": "Portfolio",
    "header.testimonials": "Testimonials",
    "header.blog": "Blog",
    "header.contact": "Contact",
    "about.title": "About me",
    "about.subtitle": "Eva Pérez: Spa Manager & Wellness Consultant",
    "about.experience": "With over 20 years of experience in the wellness sector and spa management, I have dedicated my career to transforming wellness spaces into profitable and memorable experiences.",
    "about.approach": "My comprehensive approach ranges from operations optimization and team training to designing unique customer experiences and implementing profitability strategies.",
    "about.speaker": "Additionally, as an international speaker, I regularly share my knowledge at conferences and industry events, where I convey best practices and trends in spa management and wellness.",
    "about.stats.years": "Years of industry experience",
    "about.stats.projects": "Successful projects completed",
    "about.stats.conferences": "Conferences delivered",
    "about.stats.trained": "Professionals trained",
    "about.stats.attendees": "Conference attendees",
    "about.contact": "Contact me",
    "about.portfolio": "View Portfolio",
    "about.speakingCaption": "Eva Pérez during a conference on spa management",
    "services.title": "Services",
    "services.subtitle": "Professional Solutions for the Wellness Sector",
    "services.moreInfo": "More information",
    "services.strategy.title": "Strategic Consulting",
    "services.strategy.description": "Operations analysis and diagnosis, strategic plan development, and advisory services to optimize the profitability of your wellness business.",
    "services.projects.title": "Project Management",
    "services.projects.description": "Comprehensive management in the creation or renovation of spas, from conceptualization to implementation and launch.",
    "services.training.title": "Training & Development",
    "services.training.description": "Tailored training programs for spa teams, focused on protocols, sales, service, and management.",
    "services.interim.title": "Interim Management",
    "services.interim.description": "Temporary management of spas and wellness centers during transition periods or to implement specific improvement projects.",
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Featured Projects and Collaborations",
    "portfolio.description": "A selection of success cases that demonstrate my approach to transforming wellness spaces and optimizing their operation.",
    "portfolio.viewCase": "View full case",
    "portfolio.viewMore": "View more projects",
    "portfolio.all": "All",
    "portfolio.consulting": "Consulting",
    "portfolio.projects": "Projects",
    "portfolio.training": "Training",
    "portfolio.interim": "Interim",
    "testimonials.title": "Testimonials",
    "testimonials.subtitle": "What my clients say",
    "testimonials.description": "Discover how my services have transformed wellness businesses and professional teams.",
    "blog.title": "Blog",
    "blog.subtitle": "Latest articles and news",
    "blog.description": "Specialized articles on spa management, wellness industry trends, and optimization strategies.",
    "blog.readArticle": "Read article",
    "blog.viewAll": "View all articles",
    "blog.readMore": "Read more",
    "resources.title": "Resources",
    "resources.subtitle": "Tools and guides for industry professionals",
    "resources.download": "Download",
    "newsletter.title": "Subscribe to my newsletter",
    "newsletter.subtitle": "Receive monthly exclusive content, tips, and the latest trends in spa management.",
    "newsletter.subscribe": "Subscribe",
    "newsletter.sending": "Sending...",
    "newsletter.leadMagnetTitle": "Download FREE Profitability Guide",
    "newsletter.leadMagnetSubtitle": "Discover 10 critical points to increase your spa margin in 30 days. Includes audit template.",
    "newsletter.downloadButton": "Download Guide Now",
    "header.bookAudit": "Request Audit",
    "hero.ctaPrimary": "Improve my Spa Now",
    "hero.ctaSecondary": "View Success Stories",
    "contact.title": "Contact",
    "contact.subtitle": "Let's talk about your project",
    "contact.description": "Fill out the form and I will contact you to schedule a free initial consultation where we can discuss your specific needs.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.company": "Company/Organization",
    "contact.form.service": "Service of interest",
    "contact.form.message": "Message",
    "contact.form.privacy": "I accept the privacy policy and the processing of my data to receive communications.",
    "contact.form.send": "Send message",
    "contact.form.sending": "Sending...",
    "footer.rights": "All rights reserved",
    "footer.design": "Designed with",
    "booking.title": "Book a consultation with Eva",
    "booking.subtitle": "Select a date and time for your personalized consultation",
    "booking.selectDate": "Select a date",
    "booking.chooseDay": "Choose the day for your consultation",
    "booking.weekendUnavailable": "Weekends are not available for bookings.",
    "booking.selectTime": "Select a time",
    "booking.availableTimes": "Available times for",
    "booking.noSlots": "No available times for this date. Please select another day.",
    "booking.back": "Back",
    "booking.complete": "Complete your booking",
    "booking.details": "Booking for",
    "booking.fullName": "Full name",
    "booking.namePlaceholder": "Your name",
    "booking.email": "Email",
    "booking.emailPlaceholder": "your@email.com",
    "booking.phone": "Phone (optional)",
    "booking.phonePlaceholder": "Your phone",
    "booking.company": "Company (optional)",
    "booking.companyPlaceholder": "Your company",
    "booking.service": "Service",
    "booking.selectService": "Select a service",
    "booking.message": "Message (optional)",
    "booking.messagePlaceholder": "Tell us briefly about your project or inquiry",
    "booking.privacy": "I accept the privacy policy",
    "booking.privacyDesc": "By checking this box, you agree to our privacy policy.",
    "booking.confirm": "Confirm booking",
    "booking.sending": "Sending...",
    "booking.successTitle": "Booking completed!",
    "booking.successDesc": "Your appointment has been booked successfully. You will receive a confirmation email.",
    "booking.errorTitle": "Booking error",
    "booking.errorDesc": "Could not complete the booking. Please try again.",
    "booking.fetchError": "Could not load available time slots",
    "booking.val.name": "Name must be at least 2 characters",
    "booking.val.email": "Please enter a valid email address",
    "booking.val.service": "Please select a service",
    "booking.val.privacy": "You must accept the privacy policy",
    "chatbot.welcome": "Hello! I am Eva Pérez's virtual assistant. What are you interested in?",
    "chatbot.error": "I'm sorry, I'm having connection issues.",
    "chatbot.placeholder": "Type your message...",
    "chatbot.send": "Send",
    "chatbot.typing": "Typing...",
    "chatbot.title": "Virtual Assistant",
    "chatbot.subtitle": "Wellness strategy expert",
    "chatbot.suggestions": "You can ask about:",
    "chatbot.disclaimer": "Powered by AI for general information."
  }
};
const defaultValue = {
  language: "es",
  setLanguage: () => {
  },
  t: (key) => key
};
const LanguageContext = createContext(defaultValue);
const useLanguage = () => useContext(LanguageContext);
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        setLanguage("en");
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);
  const t = (key) => {
    return translations[language][key] || key;
  };
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children });
};
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Resources = () => {
  const { t, language } = useLanguage();
  const [selectedResource, setSelectedResource] = useState(null);
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
  return /* @__PURE__ */ jsx("section", { className: "py-16 md:py-24 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center max-w-3xl mx-auto mb-16",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("resources.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("resources.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: language === "es" ? "Accede a guías y recursos exclusivos para optimizar la gestión de tu spa. Lectura directa y práctica." : "Access exclusive guides and resources to optimize your spa management. Direct and practical reading." })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "grid grid-cols-1 md:grid-cols-3 gap-8",
        variants: containerVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        children: resources.map((resource, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover-scale flex flex-col h-full cursor-pointer group",
            variants: itemVariants,
            onClick: () => setSelectedResource(resource),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: resource.image,
                    alt: typeof resource.title === "object" ? resource.title[language] : resource.title,
                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-playfair text-xl font-bold text-charcoal mb-2", children: typeof resource.title === "object" ? resource.title[language] : resource.title }),
                /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-sm mb-4 flex-grow", children: typeof resource.description === "object" ? resource.description[language] : resource.description }),
                /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "inline-block w-full bg-turquoise hover:bg-turquoise-dark text-white text-center font-medium py-2 rounded transition-colors",
                    children: typeof resource.buttonText === "object" ? resource.buttonText[language] : resource.buttonText
                  }
                ) })
              ] })
            ]
          },
          index
        ))
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: !!selectedResource, onOpenChange: (open) => !open && setSelectedResource(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0", children: selectedResource && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "relative h-64 w-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: selectedResource.image,
            alt: "Resource header",
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedResource(null),
            className: "absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white", children: /* @__PURE__ */ jsx(DialogTitle, { className: "font-playfair text-2xl md:text-3xl font-bold leading-tight", children: typeof selectedResource.title === "object" ? selectedResource.title[language] : selectedResource.title }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8", children: /* @__PURE__ */ jsx("div", { className: "prose prose-lg prose-headings:font-playfair prose-headings:text-charcoal prose-p:text-charcoal-light prose-li:text-charcoal-light max-w-none", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: Array.isArray(selectedResource.content[language]) ? selectedResource.content[language].join("\n\n") : selectedResource.content[language] }) }) })
    ] }) }) })
  ] }) });
};
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const { toast: toast2 } = useToast();
  const {
    data: user,
    error,
    isLoading
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest({
        method: "POST",
        path: "/api/login",
        body: credentials
      });
      return await res.json();
    },
    onSuccess: (user2) => {
      queryClient.setQueryData(["/api/user"], user2);
    },
    onError: (error2) => {
      toast2({
        title: "Error al iniciar sesión",
        description: error2.message,
        variant: "destructive"
      });
    }
  });
  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest({
        method: "POST",
        path: "/api/register",
        body: credentials
      });
      return await res.json();
    },
    onSuccess: (user2) => {
      queryClient.setQueryData(["/api/user"], user2);
    },
    onError: (error2) => {
      toast2({
        title: "Error en el registro",
        description: error2.message,
        variant: "destructive"
      });
    }
  });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest({
        method: "POST",
        path: "/api/logout"
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
    onError: (error2) => {
      toast2({
        title: "Error al cerrar sesión",
        description: error2.message,
        variant: "destructive"
      });
    }
  });
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function ProtectedRoute({
  path,
  component: Component
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ jsx(Route, { path, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-border" }) }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Route, { path, children: /* @__PURE__ */ jsx(Redirect, { to: "/auth" }) });
  }
  return /* @__PURE__ */ jsx(Route, { path, component: Component });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();
  useEffect(() => {
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: showConsent && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      transition: { duration: 0.5 },
      className: "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex flex-col md:flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 md:mb-0 md:mr-8 text-center md:text-left", children: /* @__PURE__ */ jsxs("p", { className: "text-charcoal text-sm md:text-base", children: [
          language === "es" ? "Utilizamos cookies para mejorar tu experiencia. Al continuar navegando en nuestra web, aceptas nuestra " : "We use cookies to enhance your experience. By continuing to browse our site, you agree to our ",
          /* @__PURE__ */ jsx(Link, { href: "/cookies", className: "text-turquoise hover:underline", children: language === "es" ? "política de cookies" : "cookie policy" }),
          "."
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowConsent(false),
              className: "border-gray-300 text-charcoal hover:bg-gray-100 hover:text-charcoal",
              children: language === "es" ? "Más tarde" : "Later"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              onClick: acceptCookies,
              className: "bg-turquoise hover:bg-turquoise-dark text-white",
              children: language === "es" ? "Aceptar" : "Accept"
            }
          )
        ] })
      ] })
    }
  ) });
};
function useChatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const welcomeMessage = t("chatbot.welcome");
    setMessages([
      { role: "assistant", content: welcomeMessage }
    ]);
  }, [language, t]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    input.trim();
    setInput("");
    setIsLoading(true);
    try {
      const chatResponse = await apiRequest({
        path: "/api/chat",
        method: "POST",
        body: { messages: [...messages, userMessage].filter((m) => m.role !== "system") }
      });
      if (chatResponse && chatResponse.response) {
        setMessages((prev) => [...prev, chatResponse.response]);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al comunicarse con el chatbot:", error);
      const errorMessage = `${t("chatbot.error")} (${error instanceof Error ? error.message : String(error)})`;
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage
  };
}
const ChatBot = () => {
  const { language, t } = useLanguage();
  const {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage
  } = useChatbot();
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const placeholderText = String(t("chatbot.placeholder"));
  const sendButtonText = t("chatbot.send");
  const chatTitle = t("chatbot.title");
  const loadingText = t("chatbot.typing");
  const subtitle = t("chatbot.subtitle");
  const suggestionsText = t("chatbot.suggestions");
  return /* @__PURE__ */ jsxs("div", { id: "chatbot-container", className: "relative", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "fixed bottom-6 right-6 z-50 flex flex-col items-end",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 1 },
        children: [
          !isOpen && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-3 mb-3 max-w-[200px] text-sm hidden md:block", children: [
            /* @__PURE__ */ jsx("p", { className: "text-charcoal font-medium", children: language === "es" ? "¿Necesitas ayuda con tu proyecto wellness?" : "Need help with your wellness project?" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-turquoise text-xs mt-1 hover:underline",
                onClick: () => setIsOpen(true),
                children: language === "es" ? "Chatea conmigo" : "Chat with me"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            motion.button,
            {
              className: "bg-turquoise text-white rounded-full p-4 shadow-lg flex items-center justify-center",
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => setIsOpen(true),
              "aria-label": language === "es" ? "Abrir chat" : "Open chat",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-turquoise text-white p-4 rounded-t-lg flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-white", children: chatTitle }),
                /* @__PURE__ */ jsx("p", { className: "text-white/70 text-xs", children: subtitle })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "text-white hover:text-white/80 transition-colors",
                "aria-label": language === "es" ? "Cerrar chat" : "Close chat",
                children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: chatContainerRef,
              className: "flex-1 p-4 overflow-y-auto space-y-4",
              children: [
                messages.map((msg, i) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `rounded-lg p-3 max-w-[80%] ${msg.role === "user" ? "bg-sage/20 text-charcoal" : "bg-turquoise text-white"}`,
                        children: msg.content
                      }
                    )
                  },
                  i
                )),
                isLoading && /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-100 text-gray-500 rounded-lg p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.2s" } }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.4s" } }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm ml-2", children: loadingText })
                ] }) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "px-4 pt-2 pb-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mb-2", children: suggestionsText }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: [
              language === "es" ? "¿Cómo aumentar ingresos en mi spa?" : "How to increase spa revenue?",
              language === "es" ? "¿Qué tendencias wellness hay?" : "Current wellness trends?",
              language === "es" ? "¿Cómo formar a mi equipo?" : "How to train my team?"
            ].map((suggestion, i) => /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors",
                onClick: () => setInput(suggestion),
                children: suggestion
              },
              i
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-gray-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-turquoise resize-none",
                  placeholder: placeholderText,
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: handleKeyPress,
                  rows: 1,
                  disabled: isLoading
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  className: "rounded-l-none bg-turquoise hover:bg-turquoise/90",
                  onClick: sendMessage,
                  disabled: isLoading || !input.trim(),
                  children: [
                    /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-0 md:mr-2", children: [
                      /* @__PURE__ */ jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
                      /* @__PURE__ */ jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: sendButtonText })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-center text-gray-500", children: /* @__PURE__ */ jsx("p", { children: t("chatbot.disclaimer") }) })
          ] })
        ]
      }
    ) }) })
  ] });
};
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(
    motion.button,
    {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      onClick: scrollToTop,
      className: "fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 p-3 bg-turquoise text-white rounded-full shadow-lg hover:bg-turquoise-dark transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise focus:ring-offset-2",
      "aria-label": "Scroll to top",
      children: /* @__PURE__ */ jsx(FaArrowUp, { size: 20 })
    }
  ) });
};
const Home = React__default.lazy(() => import("./assets/Home-DRLUzZEp.mjs"));
const Privacy = React__default.lazy(() => import("./assets/Privacy-DyeA4x6l.mjs"));
const Terms = React__default.lazy(() => import("./assets/Terms-BM_d_WbZ.mjs"));
const Cookies = React__default.lazy(() => import("./assets/Cookies-O1H_T_T-.mjs"));
const Booking = React__default.lazy(() => import("./assets/Booking-B1IX4RUx.mjs"));
const Admin = React__default.lazy(() => import("./assets/Admin-Ch3qVOtN.mjs"));
const AuthPage = React__default.lazy(() => import("./assets/Auth-jiNbsEYK.mjs"));
function Router() {
  const [location] = useLocation();
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Loading..." }), children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(Switch, { location, children: [
    /* @__PURE__ */ jsx(Route, { path: "/", children: /* @__PURE__ */ jsx(Home, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/privacy", children: /* @__PURE__ */ jsx(Privacy, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/terms", children: /* @__PURE__ */ jsx(Terms, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/cookies", children: /* @__PURE__ */ jsx(Cookies, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/booking", children: /* @__PURE__ */ jsx(Booking, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/auth", children: /* @__PURE__ */ jsx(AuthPage, {}) }),
    /* @__PURE__ */ jsx(ProtectedRoute, { path: "/admin", component: Admin }),
    /* @__PURE__ */ jsx(Route, { path: "/resources", children: /* @__PURE__ */ jsx(Resources, {}) }),
    /* @__PURE__ */ jsx(Route, { component: NotFound })
  ] }, location) }) });
}
function App({ queryClient: propsClient }) {
  const client = propsClient || queryClient;
  return /* @__PURE__ */ jsx(QueryClientProvider, { client, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(LanguageProvider, { children: [
    /* @__PURE__ */ jsx(Router, {}),
    /* @__PURE__ */ jsx(ChatBot, {}),
    /* @__PURE__ */ jsx(CookieConsent, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(Toaster, {})
  ] }) }) });
}
const staticLocationHook = (path = "/") => () => [path, () => null];
const { HelmetProvider } = HelmetAsync;
function render(url) {
  const hook = staticLocationHook(url);
  const queryClient2 = new QueryClient();
  const helmetContext = {};
  const html = renderToString(
    /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(Router$1, { hook, children: /* @__PURE__ */ jsx(App, { queryClient: queryClient2 }) }) })
  );
  return { html, helmetContext };
}
export {
  Button as B,
  Card as C,
  Dialog as D,
  Resources as R,
  ScrollToTop as S,
  DialogContent as a,
  DialogTitle as b,
  cn as c,
  DialogDescription as d,
  blogPosts as e,
  useToast as f,
  apiRequest as g,
  buttonVariants as h,
  CardHeader as i,
  CardTitle as j,
  CardDescription as k,
  CardContent as l,
  CardFooter as m,
  toast as n,
  useAuth as o,
  portfolioItems as p,
  render,
  services as s,
  testimonials as t,
  useLanguage as u
};
