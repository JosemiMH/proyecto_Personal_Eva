import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cookies = () => {
  const { language } = useLanguage();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins text-charcoal bg-white">
      <Header />

      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-12">
            {language === 'es' ? 'Política de Cookies' : 'Cookie Policy'}
          </h1>

          <div className="prose prose-lg max-w-none">
            {language === 'es' ? (
              <>
                <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

                <h2>1. ¿Qué son las cookies?</h2>
                <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tableta, teléfono móvil) cuando visita un sitio web. Las cookies ayudan a recordar sus preferencias y a mejorar su experiencia de navegación.</p>

                <h2>2. Tipos de cookies que utilizamos</h2>
                <p>Nuestro sitio web utiliza los siguientes tipos de cookies:</p>

                <h3>Cookies esenciales</h3>
                <p>Estas cookies son necesarias para el funcionamiento básico de nuestro sitio web. Le permiten navegar por nuestro sitio y utilizar sus funciones. Sin estas cookies, no podríamos proporcionar los servicios que ha solicitado.</p>

                <h3>Cookies de preferencias</h3>
                <p>Estas cookies recuerdan sus elecciones y preferencias para mejorar su experiencia cuando vuelva a visitar nuestro sitio web.</p>

                <h3>Cookies analíticas</h3>
                <p>Utilizamos cookies analíticas para entender cómo los visitantes interactúan con nuestro sitio web. Estas cookies nos ayudan a reconocer y contar el número de visitantes y a ver cómo se mueven por nuestro sitio cuando lo están utilizando.</p>

                <h2>3. Control de cookies</h2>
                <p>La mayoría de los navegadores web permiten controlar la mayoría de las cookies a través de sus ajustes. Puede configurar su navegador para que rechace las cookies o le avise cuando se envíen cookies a su dispositivo.</p>
                <p>Si desea saber más sobre las cookies o cómo gestionarlas o eliminarlas, visite <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>.</p>

                <h2>4. Cambios en nuestra política de cookies</h2>
                <p>Podemos actualizar nuestra política de cookies de vez en cuando. Cualquier cambio será publicado en esta página.</p>

                <h2>5. Contacto</h2>
                <p>Si tiene preguntas sobre nuestra política de cookies, puede contactarnos en epm@epmwellness.com.</p>
              </>
            ) : (
              <>
                <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

                <h2>1. What are cookies?</h2>
                <p>Cookies are small text files that are stored on your device (computer, tablet, mobile phone) when you visit a website. Cookies help remember your preferences and improve your browsing experience.</p>

                <h2>2. Types of cookies we use</h2>
                <p>Our website uses the following types of cookies:</p>

                <h3>Essential cookies</h3>
                <p>These cookies are necessary for the basic functioning of our website. They allow you to navigate our site and use its features. Without these cookies, we could not provide the services you have requested.</p>

                <h3>Preference cookies</h3>
                <p>These cookies remember your choices and preferences to enhance your experience when you return to our website.</p>

                <h3>Analytical cookies</h3>
                <p>We use analytical cookies to understand how visitors interact with our website. These cookies help us recognize and count the number of visitors and see how they move around our site when they are using it.</p>

                <h2>3. Cookie control</h2>
                <p>Most web browsers allow you to control most cookies through their settings. You can set your browser to refuse cookies or to alert you when cookies are being sent to your device.</p>
                <p>If you want to learn more about cookies or how to manage or delete them, visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>.</p>

                <h2>4. Changes to our cookie policy</h2>
                <p>We may update our cookie policy from time to time. Any changes will be posted on this page.</p>

                <h2>5. Contact</h2>
                <p>If you have questions about our cookie policy, you can contact us at epm@epmwellness.com.</p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;