import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
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
            {language === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}
          </h1>

          <div className="prose prose-lg max-w-none">
            {language === 'es' ? (
              <>
                <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

                <h2>1. Aceptación de los Términos</h2>
                <p>Al acceder o utilizar el sitio web de Eva Pérez ("nosotros", "nos" o "nuestro"), usted acepta estar legalmente obligado por estos Términos y Condiciones. Si no está de acuerdo con estos términos, por favor no utilice nuestro sitio web.</p>

                <h2>2. Cambios en los Términos</h2>
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. Su uso continuado del sitio después de cualquier cambio constituye su aceptación de los nuevos términos.</p>

                <h2>3. Uso del Sitio</h2>
                <p>Usted acepta utilizar nuestro sitio web solo para fines legales y de una manera que no infrinja los derechos de terceros ni restrinja su uso del sitio. Están prohibidas las siguientes actividades:</p>
                <ul>
                  <li>Cualquier uso que pudiera dañar, deshabilitar o sobrecargar nuestro sitio</li>
                  <li>Uso no autorizado de nuestros sistemas informáticos</li>
                  <li>Recopilación no autorizada de información de usuarios</li>
                  <li>Publicación de contenido difamatorio, obsceno o ilegal</li>
                </ul>

                <h2>4. Propiedad Intelectual</h2>
                <p>Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y software, es propiedad de Eva Pérez o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual. La reproducción, distribución o uso no autorizado de cualquier material de nuestro sitio está estrictamente prohibido.</p>

                <h2>5. Enlaces a Terceros</h2>
                <p>Nuestro sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia. No tenemos control sobre el contenido de estos sitios y no somos responsables de ningún contenido, políticas de privacidad o prácticas de sitios web de terceros.</p>

                <h2>6. Limitación de Responsabilidad</h2>
                <p>En la máxima medida permitida por la ley, Eva Pérez no será responsable por daños directos, indirectos, incidentales, consecuentes o punitivos resultantes de su acceso o uso de nuestro sitio web.</p>

                <h2>7. Ley Aplicable</h2>
                <p>Estos términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus conflictos de principios legales.</p>

                <h2>8. Contacto</h2>
                <p>Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en epm@epmwellness.com.</p>
              </>
            ) : (
              <>
                <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

                <h2>1. Acceptance of Terms</h2>
                <p>By accessing or using Eva Pérez's website ("we," "us," or "our"), you agree to be legally bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>

                <h2>2. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. Changes will take effect immediately upon posting on the website. Your continued use of the site after any changes constitutes your acceptance of the new terms.</p>

                <h2>3. Use of the Site</h2>
                <p>You agree to use our website only for lawful purposes and in a manner that does not infringe on the rights of third parties or restrict their use of the site. The following activities are prohibited:</p>
                <ul>
                  <li>Any use that could damage, disable, or overburden our site</li>
                  <li>Unauthorized use of our computer systems</li>
                  <li>Unauthorized collection of user information</li>
                  <li>Posting defamatory, obscene, or illegal content</li>
                </ul>

                <h2>4. Intellectual Property</h2>
                <p>All content on this website, including text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of Eva Pérez or its content providers and is protected by intellectual property laws. Unauthorized reproduction, distribution, or use of any material from our site is strictly prohibited.</p>

                <h2>5. Third-Party Links</h2>
                <p>Our website may contain links to third-party websites. These links are provided solely for your convenience. We have no control over the content of these sites and are not responsible for any content, privacy policies, or practices of third-party websites.</p>

                <h2>6. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, Eva Pérez will not be liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your access to or use of our website.</p>

                <h2>7. Governing Law</h2>
                <p>These terms will be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law principles.</p>

                <h2>8. Contact</h2>
                <p>If you have questions about these Terms and Conditions, you can contact us at epm@epmwellness.com.</p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;