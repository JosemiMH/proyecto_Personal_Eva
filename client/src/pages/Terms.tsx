import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const Terms = () => {
  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) {
      window.scrollTo(0, 0);
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    });
  }, []);

  return (
    <>
      <SEO
        title="Términos y Condiciones"
        description="Condiciones de acceso, uso y contratación de los servicios profesionales presentados en la web de Eva Pérez."
        url="/terms"
      />
      <PageTransition>
      <div className="font-poppins text-charcoal bg-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h1 className="font-playfair text-4xl font-bold mb-8 text-turquoise-dark">Términos y Condiciones</h1>

            <p className="lead">
              Bienvenido/a a la web de Eva Pérez. Al acceder y utilizar este sitio web, aceptas cumplir con los siguientes términos y condiciones de uso.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">1. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de este sitio web (textos, imágenes, diseños, logotipos, vídeos, material descargable, guías, etc.) es propiedad exclusiva de Eva Pérez o de terceros que han autorizado su uso. Está prohibida su reproducción, distribución, comunicación pública o transformación sin la autorización expresa y por escrito de la titular.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">2. Uso del Sitio Web</h2>
            <p>
              El usuario se compromete a utilizar el sitio web de conformidad con la ley, la moral, el orden público y estos Términos y Condiciones. Se prohíbe el uso del sitio web con fines ilícitos o lesivos contra Eva Pérez o terceros.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">3. Contratación de Servicios</h2>
            <p>
              Los servicios de consultoría, formación e interim management expuestos en la web están sujetos a presupuestos personalizados. La mera solicitud de información a través de los formularios no implica relación contractual hasta la firma de la propuesta de servicios correspondiente.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">4. Exención de Responsabilidad</h2>
            <p>
              Eva Pérez no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse de la disponibilidad y continuidad técnica del funcionamiento del sitio web. Asimismo, aunque se esfuerza por mantener la información actualizada y veraz, no garantiza la inexistencia de errores en los contenidos.
            </p>
            <p>
              La información proporcionada en el "Chatbot" o asistente virtual es de carácter orientativo y no sustituye una consultoría profesional personalizada.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">5. Enlaces Externos</h2>
            <p>
              Este sitio web puede contener enlaces a sitios web de terceros. Eva Pérez no asume responsabilidad alguna por el contenido, políticas de privacidad o prácticas de dichos sitios web.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">6. Modificaciones</h2>
            <p>
              Nos reservamos el derecho a modificar, en cualquier momento y sin previo aviso, la presentación y configuración del sitio web, así como los presentes Términos y Condiciones.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">7. Legislación Aplicable</h2>
            <p>
              Estos términos se rigen por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a los juzgados y tribunales de la ciudad de Madrid (España).
            </p>

            <h2
              id="uso-inteligencia-artificial"
              className="scroll-mt-24 text-xl font-bold mt-6 mb-2"
            >
              8. Uso de Inteligencia Artificial
            </h2>
            <p>
              Determinados contenidos, imágenes, ilustraciones y elementos de este sitio web han sido creados o elaborados con la asistencia de herramientas de Inteligencia Artificial (IA). Los materiales publicados son revisados, validados y aprobados bajo supervisión humana por EPM Wellness, que asume la responsabilidad editorial sobre la información y los materiales ofrecidos en este sitio.
            </p>
            <p>
              Salvo que se indique expresamente lo contrario, las imágenes generadas con IA que acompañan casos de éxito y los retratos ilustrativos de testimonios tienen carácter conceptual: no deben interpretarse como fotografías documentales de una instalación o de la persona citada. Si se publicara contenido sintético que pudiera confundirse con una persona, lugar, entidad o acontecimiento real, se identificaría de forma específica cuando resulte legalmente exigible.
            </p>
            <p>
              El asistente virtual es un sistema de IA destinado a ofrecer información general sobre los servicios de Eva Pérez y EPM Wellness. Sus respuestas pueden ser inexactas o incompletas, no sustituyen el asesoramiento profesional personalizado y no adoptan decisiones que produzcan efectos jurídicos o similares sobre las personas usuarias.
            </p>
            <p>
              La utilización de IA tiene como finalidad apoyar la calidad, la accesibilidad y la eficiencia en la elaboración de contenidos y en la atención inicial, manteniendo supervisión humana. Antes de la primera interacción con el asistente se informa expresamente de su naturaleza artificial y del tratamiento de la conversación.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Última actualización: 17 de julio de 2026.
            </p>
          </div>
        </main>
        <Footer />
      </div>
      </PageTransition>
    </>
  );
};

export default Terms;
