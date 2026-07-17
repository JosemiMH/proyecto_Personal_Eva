import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  Users2,
} from "lucide-react";
import SEO from "@/components/SEO";
import { AuditModal } from "@/components/AuditModal";
import evaProfileImage from "@/assets/eva-perez-profile.webp";
import heroImage from "@/assets/images/hero-es.webp";

const siteUrl = "https://www.epmwellness.com";
const pagePath = "/auditoria-spa-hoteles";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteUrl}${pagePath}#service`,
      name: "Auditoría y consultoría estratégica de spa para hoteles",
      serviceType: "Consultoría de Spa y Wellness",
      description:
        "Diagnóstico estratégico para mejorar la rentabilidad, las operaciones y la experiencia del cliente en spas hoteleros.",
      areaServed: ["España", "Europa", "Internacional"],
      provider: {
        "@type": "Person",
        "@id": `${siteUrl}/#eva-perez`,
        name: "Eva Pérez Montes",
        jobTitle: "Spa & Wellness Consultant",
        url: siteUrl,
      },
      url: `${siteUrl}${pagePath}`,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Para qué tipo de establecimientos está pensada la auditoría?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Está dirigida a hoteles, resorts, cadenas hoteleras y centros wellness que quieran revisar su rentabilidad, procesos, equipo o propuesta de valor.",
          },
        },
        {
          "@type": "Question",
          name: "¿La primera conversación tiene coste?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La llamada inicial de diagnóstico es gratuita y sirve para entender el contexto, detectar prioridades y definir si una auditoría completa puede aportar valor.",
          },
        },
        {
          "@type": "Question",
          name: "¿La consultoría puede realizarse a distancia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. La fase inicial y parte del análisis pueden realizarse online. Cuando el proyecto lo requiere, se propone una visita presencial al establecimiento.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué idiomas puede desarrollarse el proyecto?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Los proyectos pueden desarrollarse en español o en inglés, tanto en España como en destinos internacionales.",
          },
        },
      ],
    },
  ],
};

const challenges = [
  "Baja ocupación de cabinas o rentabilidad inferior al potencial",
  "Procesos poco definidos y una operativa difícil de controlar",
  "Carta de tratamientos extensa, poco diferenciada o con márgenes débiles",
  "Equipos que necesitan formación, liderazgo y estándares claros",
];

const deliverables = [
  {
    icon: BarChart3,
    title: "Diagnóstico económico y operativo",
    text: "Revisión de KPIs, capacidad, precios, costes, ocupación, productividad y oportunidades de ingreso.",
  },
  {
    icon: Users2,
    title: "Experiencia y equipo",
    text: "Análisis del recorrido del cliente, protocolos, venta consultiva, organización y necesidades formativas.",
  },
  {
    icon: Building2,
    title: "Plan de acción priorizado",
    text: "Recomendaciones concretas, ordenadas por impacto y esfuerzo, para convertir el diagnóstico en decisiones.",
  },
];

export default function AuditLanding() {
  return (
    <div className="min-h-screen bg-white text-charcoal">
      <SEO
        title="Auditoría y Consultoría de Spa para Hoteles | Eva Pérez"
        description="Detecta oportunidades de rentabilidad, mejora operaciones y eleva la experiencia de tu spa hotelero con una consultora wellness con más de 20 años de experiencia."
        image="/attached_assets/foto_perfil_Eva_Linkedin.PNG"
        url={pagePath}
        language="es"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Eva Pérez, página principal">
            <img
              src={evaProfileImage}
              alt="Eva Pérez"
              width="64"
              height="64"
              className="h-11 w-11 rounded-full object-cover"
              decoding="async"
            />
            <div>
              <span className="block font-playfair text-xl font-bold leading-tight text-turquoise">Eva Pérez</span>
              <span className="block text-[11px] text-sage-dark">Spa & Wellness Consultant</span>
            </div>
          </Link>
          <a
            href="tel:+34676462991"
            className="hidden items-center gap-2 text-sm font-medium text-turquoise hover:text-turquoise-dark sm:flex"
          >
            <Phone className="h-4 w-4" />
            +34 676 462 991
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-charcoal-dark text-white">
          <div className="absolute inset-0 opacity-25">
            <img
              src={heroImage}
              alt=""
              width="689"
              height="398"
              className="h-full w-full object-cover object-center"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark via-charcoal-dark/95 to-turquoise-dark/70" />
          <div className="container relative mx-auto grid gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-turquoise-light">
                Auditoría estratégica para hoteles y resorts
              </p>
              <h1 className="font-playfair text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Convierte tu spa hotelero en una unidad más rentable, eficiente y memorable
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200">
                Identifica dónde se pierde margen, qué procesos frenan al equipo y qué oportunidades pueden mejorar la experiencia del huésped. Con un diagnóstico claro y un plan de acción aplicable.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AuditModal source="sem_landing_hero">
                  <button className="inline-flex items-center justify-center gap-2 rounded bg-turquoise px-7 py-3.5 font-semibold text-white transition-colors hover:bg-turquoise-dark">
                    Solicitar diagnóstico inicial
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </AuditModal>
                <a
                  href="mailto:epm@epmwellness.com"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/40 px-7 py-3.5 font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Mail className="h-4 w-4" />
                  Escribir a Eva
                </a>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                <ShieldCheck className="h-4 w-4 text-turquoise-light" />
                Primera conversación de diagnóstico gratuita y sin compromiso.
              </p>
            </div>

            <aside className="self-center rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-md">
              <p className="font-playfair text-2xl font-bold">Experiencia aplicada al negocio wellness</p>
              <dl className="mt-7 grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-3xl font-bold text-turquoise-light">20+</dt>
                  <dd className="mt-1 text-sm text-gray-200">años de experiencia</dd>
                </div>
                <div>
                  <dt className="text-3xl font-bold text-turquoise-light">40+</dt>
                  <dd className="mt-1 text-sm text-gray-200">proyectos desarrollados</dd>
                </div>
                <div className="col-span-2 border-t border-white/15 pt-5">
                  <dt className="text-sm font-semibold uppercase tracking-wider text-turquoise-light">Experiencia con</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-gray-200">
                    Paradores, Eurostars, Meliá, HG Hotels, AXEL y proyectos independientes.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-turquoise">Señales que conviene revisar</p>
              <h2 className="mt-3 font-playfair text-3xl font-bold text-charcoal md:text-4xl">
                ¿Reconoces alguno de estos retos en tu spa?
              </h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
              {challenges.map((challenge) => (
                <div key={challenge} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-turquoise" />
                  <p className="text-charcoal-light">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-turquoise">Qué aporta el análisis</p>
              <h2 className="mt-3 font-playfair text-3xl font-bold text-charcoal md:text-4xl">
                De los datos y la observación a un plan ejecutable
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {deliverables.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-turquoise/10 text-turquoise">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-playfair text-xl font-bold text-charcoal">{title}</h3>
                  <p className="mt-3 leading-relaxed text-charcoal-light">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-turquoise-dark py-14 text-white">
          <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-7 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
            <div>
              <h2 className="font-playfair text-3xl font-bold">Empieza por una conversación de diagnóstico</h2>
              <p className="mt-2 max-w-2xl text-white/85">
                Cuéntame el contexto de tu hotel o spa y te ayudaré a identificar el siguiente paso con mayor impacto.
              </p>
            </div>
            <AuditModal source="sem_landing_mid">
              <button className="inline-flex shrink-0 items-center gap-2 rounded bg-white px-7 py-3.5 font-semibold text-turquoise-dark transition-colors hover:bg-gray-100">
                Hablar con Eva
                <ArrowRight className="h-4 w-4" />
              </button>
            </AuditModal>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-playfair text-3xl font-bold text-charcoal md:text-4xl">Preguntas frecuentes</h2>
            <div className="mt-10 space-y-4">
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-charcoal">¿Para qué establecimientos está pensada?</summary>
                <p className="mt-3 text-charcoal-light">Para hoteles, resorts, cadenas hoteleras y centros wellness que quieran revisar rentabilidad, procesos, equipo o propuesta de valor.</p>
              </details>
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-charcoal">¿La primera conversación tiene coste?</summary>
                <p className="mt-3 text-charcoal-light">No. La llamada inicial de diagnóstico es gratuita y permite definir prioridades y comprobar si una auditoría completa puede aportar valor.</p>
              </details>
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-charcoal">¿Puede realizarse a distancia?</summary>
                <p className="mt-3 text-charcoal-light">Sí. La fase inicial y parte del análisis pueden realizarse online. Si el proyecto lo requiere, se propone una visita presencial.</p>
              </details>
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-charcoal">¿Se trabaja fuera de España?</summary>
                <p className="mt-3 text-charcoal-light">Sí. Eva está disponible para proyectos nacionales e internacionales, en español o en inglés.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-charcoal-light sm:px-6 md:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Eva Pérez · Spa & Wellness Consultant</p>
          <nav className="flex flex-wrap justify-center gap-5" aria-label="Enlaces legales">
            <Link href="/privacy" className="hover:text-turquoise">Privacidad</Link>
            <Link href="/cookies" className="hover:text-turquoise">Cookies</Link>
            <Link href="/terms" className="hover:text-turquoise">Términos</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
