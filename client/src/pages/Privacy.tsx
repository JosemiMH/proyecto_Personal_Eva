import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
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
            {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
          </h1>

          <div className="prose prose-lg max-w-none">
            {language === 'es' ? (
              <>
                <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

                <h2>1. Información que recopilamos</h2>
                <p>Eva Pérez ("nosotros", "nos" o "nuestro") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información personal que usted proporciona a través de nuestro sitio web.</p>

                <p>Recopilamos los siguientes tipos de información:</p>
                <ul>
                  <li><strong>Información de contacto:</strong> Nombre, dirección de correo electrónico, número de teléfono, empresa y mensaje cuando utiliza nuestro formulario de contacto.</li>
                  <li><strong>Información de suscripción:</strong> Correo electrónico cuando se suscribe a nuestro boletín informativo.</li>
                  <li><strong>Información de uso:</strong> Datos sobre cómo interactúa con nuestro sitio, incluidas las páginas visitadas, el tiempo pasado en el sitio y otra información estadística.</li>
                </ul>

                <h2>2. Cómo utilizamos su información</h2>
                <p>Utilizamos su información personal para:</p>
                <ul>
                  <li>Responder a sus consultas y solicitudes</li>
                  <li>Enviarle nuestro boletín informativo si ha dado su consentimiento</li>
                  <li>Mejorar y personalizar su experiencia en nuestro sitio web</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>

                <h2>3. Compartición de datos</h2>
                <p>No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información con proveedores de servicios que nos ayudan a operar nuestro sitio web y prestar servicios, pero estos proveedores están obligados a mantener la confidencialidad de su información.</p>

                <h2>4. Seguridad de datos</h2>
                <p>Implementamos medidas de seguridad para proteger su información personal. Sin embargo, ninguna transmisión de Internet o método de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.</p>

                <h2>5. Sus derechos</h2>
                <p>Usted tiene derecho a:</p>
                <ul>
                  <li>Acceder a su información personal</li>
                  <li>Rectificar información inexacta</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Retirar su consentimiento en cualquier momento</li>
                  <li>Presentar una reclamación ante una autoridad de protección de datos</li>
                </ul>

                <h2>6. Cambios a esta política</h2>
                <p>Podemos actualizar esta política periódicamente. Le notificaremos cualquier cambio publicando la nueva política de privacidad en esta página.</p>

                <h2>7. Contacto</h2>
                <p>Si tiene preguntas sobre esta Política de Privacidad, puede contactarnos en epm@epmwellness.com.</p>
              </>
            ) : (
              <>
                <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

                <h2>1. Information We Collect</h2>
                <p>Eva Pérez ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect the personal information you provide through our website.</p>

                <p>We collect the following types of information:</p>
                <ul>
                  <li><strong>Contact Information:</strong> Name, email address, phone number, company, and message when you use our contact form.</li>
                  <li><strong>Subscription Information:</strong> Email when you subscribe to our newsletter.</li>
                  <li><strong>Usage Information:</strong> Data about how you interact with our site, including pages visited, time spent on the site, and other statistical information.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use your personal information to:</p>
                <ul>
                  <li>Respond to your inquiries and requests</li>
                  <li>Send you our newsletter if you have consented</li>
                  <li>Improve and personalize your experience on our website</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>3. Data Sharing</h2>
                <p>We do not sell or rent your personal information to third parties. We may share your information with service providers who help us operate our website and deliver services, but these providers are required to keep your information confidential.</p>

                <h2>4. Data Security</h2>
                <p>We implement security measures to protect your personal information. However, no Internet transmission or electronic storage method is 100% secure, so we cannot guarantee its absolute security.</p>

                <h2>5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Rectify inaccurate information</li>
                  <li>Request the deletion of your data</li>
                  <li>Withdraw your consent at any time</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>

                <h2>6. Changes to This Policy</h2>
                <p>We may update this policy periodically. We will notify you of any changes by posting the new privacy policy on this page.</p>

                <h2>7. Contact</h2>
                <p>If you have questions about this Privacy Policy, you can contact us at epm@epmwellness.com.</p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;