import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins text-charcoal bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="font-playfair text-4xl font-bold mb-8 text-turquoise-dark">Términos y Condiciones</h1>

          <p className="lead">
            Bienvenido/a a la web de Eva Pérez. Al acceder y utilizar este sitio web, aceptas cumplir con los siguientes términos y condiciones de uso.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">1. Propiedad Intelectual</h3>
          <p>
            Todo el contenido de este sitio web (textos, imágenes, diseños, logotipos, vídeos, material descargable, guías, etc.) es propiedad exclusiva de Eva Pérez o de terceros que han autorizado su uso. Está prohibida su reproducción, distribución, comunicación pública o transformación sin la autorización expresa y por escrito de la titular.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">2. Uso del Sitio Web</h3>
          <p>
            El usuario se compromete a utilizar el sitio web de conformidad con la ley, la moral, el orden público y estos Términos y Condiciones. Se prohíbe el uso del sitio web con fines ilícitos o lesivos contra Eva Pérez o terceros.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">3. Contratación de Servicios</h3>
          <p>
            Los servicios de consultoría, formación e interim management expuestos en la web están sujetos a presupuestos personalizados. La mera solicitud de información a través de los formularios no implica relación contractual hasta la firma de la propuesta de servicios correspondiente.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">4. Exención de Responsabilidad</h3>
          <p>
            Eva Pérez no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse de la disponibilidad y continuidad técnica del funcionamiento del sitio web. Asimismo, aunque se esfuerza por mantener la información actualizada y veraz, no garantiza la inexistencia de errores en los contenidos.
          </p>
          <p>
            La información proporcionada en el "Chatbot" o asistente virtual es de carácter orientativo y no sustituye una consultoría profesional personalizada.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">5. Enlaces Externos</h3>
          <p>
            Este sitio web puede contener enlaces a sitios web de terceros. Eva Pérez no asume responsabilidad alguna por el contenido, políticas de privacidad o prácticas de dichos sitios web.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">6. Modificaciones</h3>
          <p>
            Nos reservamos el derecho a modificar, en cualquier momento y sin previo aviso, la presentación y configuración del sitio web, así como los presentes Términos y Condiciones.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">7. Legislación Aplicable</h3>
          <p>
            Estos términos se rigen por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a los juzgados y tribunales de la ciudad de Madrid (España).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;