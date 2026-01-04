import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins text-charcoal bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="font-playfair text-4xl font-bold mb-8 text-turquoise-dark">Política de Cookies</h1>

          <p className="lead">
            Este sitio web utiliza cookies propias y de terceros para mejorar tu experiencia de usuario, analizar el tráfico y personalizar el contenido.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">¿Qué son las cookies?</h3>
          <p>
            Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">Cookies que utilizamos</h3>

          <h4 className="font-bold mt-4">1. Cookies Técnicas (Necesarias)</h4>
          <p>
            Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existan. Por ejemplo, controlar el tráfico, identificar la sesión o recordar elementos de un pedido.
          </p>

          <h4 className="font-bold mt-4">2. Cookies de Análisis</h4>
          <p>
            Son aquellas que nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio. Para ello se analiza tu navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que te ofrecemos.
          </p>

          <h4 className="font-bold mt-4">3. Cookies de Preferencias</h4>
          <p>
            Permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios, como, por ejemplo, el idioma o la configuración regional.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">Gestión de Cookies</h3>
          <p>
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Google Chrome:</strong> Configuración &rarr; Privacidad y seguridad &rarr; Cookies y otros datos de sitios.</li>
            <li><strong>Mozilla Firefox:</strong> Opciones &rarr; Privacidad y Seguridad.</li>
            <li><strong>Safari:</strong> Preferencias &rarr; Privacidad.</li>
          </ul>
          <p>
            Ten en cuenta que, si desactivas las cookies, es posible que algunas funciones del sitio web no funcionen correctamente.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;