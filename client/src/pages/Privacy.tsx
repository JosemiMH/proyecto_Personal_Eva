import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins text-charcoal bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="font-playfair text-4xl font-bold mb-8 text-turquoise-dark">Política de Privacidad</h1>

          <p className="lead">
            En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales, te informamos sobre el tratamiento de tus datos personales.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">1. Responsable del Tratamiento</h3>
          <p>
            <strong>Identidad:</strong> Eva Pérez<br />
            <strong>Actividad:</strong> Consultoría de Spa y Wellness<br />
            <strong>Email de contacto:</strong> epm@epmwellness.com<br />
            <strong>Ubicación:</strong> Madrid, España
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">2. Finalidad del Tratamiento</h3>
          <p>Tratamos la información que nos facilitas para las siguientes finalidades:</p>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Formulario de Contacto:</strong> Responder a tus consultas, solicitudes de auditoría o propuestas de colaboración.</li>
            <li><strong>Newsletter y Lead Magnets:</strong> Enviarte la guía gratuita solicitada y comunicaciones periódicas (newsletter) con contenidos sobre gestión de spas, novedades y servicios, siempre que hayas dado tu consentimiento explícito.</li>
            <li><strong>Gestión de Servicios:</strong> En caso de contratación, para la gestión administrativa, fiscal y contable de los servicios prestados.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-2">3. Legitimación</h3>
          <p>La base legal para el tratamiento de tus datos es:</p>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Consentimiento:</strong> Al marcar la casilla de aceptación en nuestros formularios, nos autorizas expresamente a tratar tus datos.</li>
            <li><strong>Ejecución de un contrato:</strong> En caso de contratar servicios de consultoría o formación.</li>
            <li><strong>Interés legítimo:</strong> Para la respuesta a consultas pre-contractuales.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-2">4. Conservación de los Datos</h3>
          <p>
            Los datos proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales. Los datos para el envío de newsletter se conservarán hasta que solicites tu baja.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">5. Destinatarios</h3>
          <p>
            Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal. Utilizamos proveedores de servicios (como plataformas de email marketing o hosting) que pueden tener acceso a datos, garantizando siempre el cumplimiento del RGPD.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">6. Derechos</h3>
          <p>Tienes derecho a obtener confirmación sobre si estamos tratando tus datos personales y, por tanto, tienes derecho a:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Acceder a tus datos personales.</li>
            <li>Rectificar los datos inexactos.</li>
            <li>Solicitar su supresión cuando los datos ya no sean necesarios.</li>
            <li>Limitar el tratamiento de tus datos.</li>
            <li>Oponerte al tratamiento.</li>
            <li>Portabilidad de tus datos.</li>
          </ul>
          <p>
            Puedes ejercer tus derechos enviando un email a <strong>epm@epmwellness.com</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;