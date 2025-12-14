import { emailService } from './server/services/email.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testEmail() {
    console.log('🚀 Iniciando prueba de envío de email...\n');

    // Mostrar configuración (sin mostrar contraseñas)
    console.log('📋 Configuración actual:');
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || 'NO CONFIGURADO'}`);
    console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '***configurado***' : 'NO CONFIGURADO'}`);
    console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || 'smtp.gmail.com (default)'}`);
    console.log(`   SMTP_PORT: ${process.env.SMTP_PORT || '587 (default)'}`);
    console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM || 'noreply@example.com (default)'}`);
    console.log('\n');

    try {
        const result = await emailService.sendEmail({
            to: 'jmhernandez.naranjo@gmail.com',
            subject: '✅ Prueba de Servicio de Email - Eva Pérez Wellness',
            text: `
Hola,

Este es un email de prueba del sistema de newsletter de Eva Pérez Wellness.

Si recibes este mensaje, significa que el servicio de email está funcionando correctamente.

Detalles de la prueba:
- Fecha: ${new Date().toLocaleString('es-ES')}
- Servidor SMTP: ${process.env.SMTP_HOST || 'smtp.gmail.com'}
- Puerto: ${process.env.SMTP_PORT || '587'}

Saludos,
Sistema de Email de Eva Pérez Wellness
https://evaperez-wellness.com
      `,
            html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .details { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Prueba de Email Exitosa</h1>
      <p>Sistema de Newsletter - Eva Pérez Wellness</p>
    </div>
    <div class="content">
      <div class="success">
        <strong>¡Éxito!</strong> Si estás leyendo este mensaje, el servicio de email está funcionando correctamente.
      </div>
      
      <p>Hola,</p>
      
      <p>Este es un email de prueba del sistema de newsletter de <strong>Eva Pérez Wellness</strong>.</p>
      
      <div class="details">
        <h3>📊 Detalles de la Prueba</h3>
        <ul>
          <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
          <li><strong>Servidor SMTP:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</li>
          <li><strong>Puerto:</strong> ${process.env.SMTP_PORT || '587'}</li>
          <li><strong>Servicio:</strong> Brevo (Sendinblue)</li>
        </ul>
      </div>
      
      <p>El sistema está listo para enviar:</p>
      <ul>
        <li>✉️ Confirmaciones de suscripción al newsletter</li>
        <li>📅 Confirmaciones de citas</li>
        <li>💬 Respuestas automáticas a formularios de contacto</li>
      </ul>
      
      <div class="footer">
        <p>Eva Pérez - Spa Manager & Wellness Consultant</p>
        <p><a href="https://evaperez-wellness.com">evaperez-wellness.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
      `
        });

        if (result) {
            console.log('\n✅ ¡Email enviado exitosamente!');
            console.log('📧 Destinatario: jmhernandez.naranjo@gmail.com');
            console.log('\n💡 Revisa la bandeja de entrada (y la carpeta de spam por si acaso)');
        } else {
            console.log('\n❌ Error al enviar el email');
        }
    } catch (error) {
        console.error('\n❌ Error durante la prueba:', error);
    }
}

// Ejecutar la prueba
testEmail();
