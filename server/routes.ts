import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import type { Express } from "express";
import OpenAI from "openai";

// Database and email services
import { storage } from "./storage";
import { emailService } from "./services/email";

// Schemas still needed for validation
import {
  contactSchema,
  newsletterSchema,
  appointmentSchema,
} from "@shared/schema";

import { z } from "zod";
import { ZodError } from "zod-validation-error"; // Keep this as it's used later
import { handleChatRequest } from "./api/chat"; // Keep this as it's used later
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later"
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts
  message: "Too many login attempts, please try again after an hour"
});

// Helper for sanitization
function sanitizeInput(text: string): string {
  if (!text) return "";
  return text.replace(/[<>]/g, "").trim();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.use('/resources', express.static('resources'));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  app.post('/api/contact', limiter, async (req, res) => {
    // Sanitize
    if (req.body) {
      if (typeof req.body.message === 'string') req.body.message = sanitizeInput(req.body.message);
      if (typeof req.body.name === 'string') req.body.name = sanitizeInput(req.body.name);
      if (typeof req.body.company === 'string') req.body.company = sanitizeInput(req.body.company);
    }
    try {
      const contactData = contactSchema.parse(req.body);
      const savedContact = await storage.createContact(contactData);

      // Send email notification
      const emailSent = await emailService.sendEmail({
        to: "epm@epmwellness.com",
        subject: `Nuevo mensaje de contacto: ${contactData.name}`,
        text: `
          Nombre: ${contactData.name}
          Email: ${contactData.email}
          Empresa: ${contactData.company || "N/A"}
          Servicio: ${contactData.service}
          Mensaje: ${contactData.message}
        `,
      });

      if (!emailSent) {
        console.error("Failed to send notification email");
        throw new Error("No se pudo enviar el correo de notificación. Por favor verifica los logs del servidor.");
      }

      // Send auto-response to user (fire and forget, don't fail if this fails?)
      // Actually, if the first one succeeded, we assume SMTP is fine. 
      // But let's log it.
      emailService.sendEmail({
        to: contactData.email,
        subject: "Hemos recibido tu mensaje - Eva Pérez",
        text: `
Hola ${contactData.name},

Gracias por contactar conmigo. He recibido tu mensaje correctamente.

Revisaré tu consulta sobre "${contactData.service}" y me pondré en contacto contigo lo antes posible, normalmente en un plazo de 24-48 horas laborables.

Atentamente,
Eva Pérez
Gerente de Proyectos SPA & Wellness
https://epmwellness.com
        `,
      });

      return res.status(200).json({
        success: true,
        message: "Mensaje enviado correctamente",
        data: savedContact
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos del formulario inválidos",
          errors: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud"
      });
    }
  });

  // Newsletter subscription endpoint
  app.post('/api/newsletter', limiter, async (req, res) => {
    try {
      const newsletterData = newsletterSchema.parse(req.body);
      const savedSubscription = await storage.createNewsletterSubscription(newsletterData);

      // Send email notification
      await emailService.sendEmail({
        to: "epm@epmwellness.com",
        subject: `Nueva suscripción a newsletter: ${newsletterData.email}`,
        text: `Se ha suscrito un nuevo usuario: ${newsletterData.email}`,
      });

      // Send welcome email to user with ebook
      await emailService.sendEmail({
        to: newsletterData.email,
        subject: "Estrategia de Rentabilidad (Guía Ejecutiva 2025)",
        text: `
Hola,

Bienvenido/a a la red profesional de Eva Pérez - EPM Wellness.

Aquí tienes acceso directo a la "Guía de Estrategia de Rentabilidad para Spas Hoteleros (Edición 2025)":

📥 Descargar Guía Ejecutiva: https://epmwellness.com/resources/guia-rentabilidad-spa.html

No es un documento teórico. Es la hoja de ruta exacta que utilizo en mis auditorías con cadenas como Paradores o Meliá para transformar centros de bienestar en activos de alto rendimiento.

Puntos clave que encontrarás:
1. El cálculo real de RevPATH (y por qué la ocupación es una métrica vanidosa).
2. Cómo estructurar tu menú de servicios para la rentabilidad.
3. El ratio crítico de venta retail que separa un buen spa de uno excelente.

Mi sugerencia:
Revisa el Punto 1 de la guía hoy mismo. Si tus métricas no están donde deberían, responde a este correo.

Me reservo unos huecos cada mes para sesiones de diagnóstico estratégico con propietarios y directores. Si hay encaje, podemos agendar una breve llamada.

Atentamente,

Eva Pérez
Gerente de Proyectos & Consultora Estratégica
https://epmwellness.com
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        
        <!-- HEADER SIMPLE & ELEGANT -->
        <tr><td style="background:#1F2937;padding:30px 40px;text-align:left;">
          <p style="color:#D4BFA3;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 5px;font-weight:600;">EPM Wellness</p>
          <h1 style="color:#ffffff;font-size:22px;font-weight:400;margin:0;letter-spacing:0.5px;font-family:Georgia,serif;">Estrategia & Rentabilidad</h1>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:40px 40px 30px;">
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">Hola,</p>
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">Bienvenido/a a mi red profesional. Gracias por tu interés en optimizar la gestión de tu centro wellness.</p>
          
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 25px;">Aquí tienes acceso directo a la <strong>Guía de Estrategia de Rentabilidad (Edición 2025)</strong>. No es teoría académica; es la metodología exacta que aplico en mis consultorías para cadenas de lujo.</p>

          <!-- CALLOUT -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-left:4px solid #D4BFA3;margin-bottom:25px;">
            <tr><td style="padding:20px;">
              <p style="color:#111827;font-size:15px;font-weight:600;margin:0 0 10px;font-family:Georgia,serif;">En esta guía ejecutiva:</p>
              <ul style="margin:0;padding-left:20px;color:#4B5563;font-size:14px;line-height:1.6;">
                <li style="margin-bottom:5px;">RevPATH: Por qué la ocupación es una métrica incompleta.</li>
                <li style="margin-bottom:5px;">Ingeniería de Menú para maximizar el margen.</li>
                <li>Productividad real del equipo terapéutico.</li>
              </ul>
            </td></tr>
          </table>

          <!-- BUTTON -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
            <tr><td align="center">
              <a href="https://epmwellness.com/resources/guia-rentabilidad-spa.html" style="background:#1F2937;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:2px;display:inline-block;letter-spacing:0.5px;text-transform:uppercase;">Descargar Guía Ejecutiva</a>
            </td></tr>
          </table>

          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;"><strong>Mi sugerencia personal:</strong><br>
          Revisa el <strong>Punto 01 (RevPATH)</strong> hoy mismo. Es donde encuentro el 80% de las fugas de rentabilidad en mis auditorías iniciales.</p>

          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 0;">Si al leerlo identificas que hay margen de mejora en tu spa, <strong>responde a este correo</strong>. Me reservo huecos específicos cada mes para sesiones de diagnóstico con propietarios y directores.</p>
        </td></tr>

        <!-- SIGNATURE -->
        <tr><td style="padding:0 40px 40px;">
          <div style="border-top:1px solid #E5E7EB;margin-top:10px;padding-top:20px;">
            <p style="color:#111827;font-size:16px;font-weight:600;margin:0;font-family:Georgia,serif;">Eva Pérez</p>
            <p style="color:#6B7280;font-size:13px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">Gerente de Proyectos & Consultora Estratégica</p>
            <p style="color:#D4BFA3;font-size:13px;margin:8px 0 0;">
              <a href="https://epmwellness.com" style="color:#D4BFA3;text-decoration:none;">epmwellness.com</a>
            </p>
          </div>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#F3F4F6;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
          <p style="color:#9CA3AF;font-size:11px;margin:0;line-height:1.5;">
            © 2025 Eva Pérez · EPM Wellness<br>
            Este correo se envió a ${newsletterData.email} porque solicitaste nuestra guía profesional.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "Suscripción completada correctamente",
        data: savedSubscription
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Email inválido",
          errors: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al procesar la suscripción"
      });
    }
  });

  // Chatbot API endpoint
  app.post("/api/chat", limiter, handleChatRequest);

  // Appointment endpoints
  // 1. Crear una nueva cita
  app.post('/api/appointments', async (req, res) => {
    try {
      const appointmentData = appointmentSchema.parse(req.body);
      const savedAppointment = await storage.createAppointment(appointmentData);

      // Send email notification
      await emailService.sendEmail({
        to: "epm@epmwellness.com",
        subject: `Nueva cita reservada: ${appointmentData.name}`,
        text: `
          Nombre: ${appointmentData.name}
          Email: ${appointmentData.email}
          Teléfono: ${appointmentData.phone || "N/A"}
          Empresa: ${appointmentData.company || "N/A"}
          Fecha: ${new Date(appointmentData.date).toLocaleString()}
          Servicio: ${appointmentData.service}
          Mensaje: ${appointmentData.message || "N/A"}
        `,
      });

      // Send auto-response to user
      await emailService.sendEmail({
        to: appointmentData.email,
        subject: "Solicitud de cita recibida - Eva Pérez",
        text: `
Hola ${appointmentData.name},

Gracias por solicitar una cita. He recibido tu petición para el día ${new Date(appointmentData.date).toLocaleDateString()} a las ${new Date(appointmentData.date).toLocaleTimeString()}.

Tu cita está actualmente en estado "Pendiente de confirmación". Revisaré mi agenda y te enviaré un correo de confirmación definitiva en breve.

Detalles de la solicitud:
- Servicio: ${appointmentData.service}
- Fecha: ${new Date(appointmentData.date).toLocaleString()}

Si necesitas modificar algo, por favor responde a este correo.

Atentamente,
Eva Pérez
Gerente de Proyectos SPA & Wellness
https://epmwellness.com
        `,
      });

      return res.status(201).json({
        success: true,
        message: "Cita reservada correctamente",
        data: savedAppointment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos de la cita inválidos",
          errors: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud de cita"
      });
    }
  });

  // 2. Obtener slots disponibles para una fecha
  app.get('/api/appointments/available', async (req, res) => {
    try {
      const dateParam = req.query.date;

      if (!dateParam || typeof dateParam !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Se requiere una fecha válida"
        });
      }

      const date = new Date(dateParam);

      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Formato de fecha inválido"
        });
      }

      const availableSlots = await storage.getAvailableSlots(date);

      return res.status(200).json({
        success: true,
        data: availableSlots
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los horarios disponibles"
      });
    }
  });

  // 3. Obtener todas las citas (protegido con autenticación en un entorno real)
  app.get('/api/appointments', async (_req, res) => {
    try {
      const appointments = await storage.getAllAppointments();

      return res.status(200).json({
        success: true,
        data: appointments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener las citas"
      });
    }
  });

  // 4. Actualizar estado de una cita
  app.patch('/api/appointments/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Estado de cita inválido"
        });
      }

      const updatedAppointment = await storage.updateAppointmentStatus(id, status);

      if (!updatedAppointment) {
        return res.status(404).json({
          success: false,
          message: "Cita no encontrada"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Estado de la cita actualizado correctamente",
        data: updatedAppointment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de la cita"
      });
    }
  });

  // Article endpoints
  app.post('/api/articles/generate', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }
    try {
      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ success: false, message: "El tema es requerido" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ success: false, message: "OpenAI API key no configurada" });
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Eres un experto redactor de contenido para un blog de wellness y hospitalidad de lujo. Genera un artículo en formato JSON con los siguientes campos: title, content (en markdown), excerpt, category, readTime (ej: '5 min read'). El contenido debe estar en ESPAÑOL. El tono debe ser profesional, sofisticado y persuasivo, enfocado en hoteles de lujo y estrategias de bienestar."
          },
          {
            role: "user",
            content: `Escribe un artículo sobre: ${topic}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = JSON.parse(completion.choices[0].message.content || "{}");

      // Generate a slug from the title
      const slug = content.title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Save to database
      const article = await storage.createArticle({
        slug,
        title: content.title,
        content: content.content,
        excerpt: content.excerpt,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", // Placeholder or use an image search API if available
        category: content.category,
        readTime: content.readTime,
        date: new Date().toISOString(),
        language: "es"
      });

      return res.status(201).json({ success: true, data: article });

    } catch (error) {
      console.error("Error generating article:", error);
      return res.status(500).json({ success: false, message: "Error generando el artículo" });
    }
  });

  app.get('/api/articles', async (_req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener artículos" });
    }
  });

  // Dynamic Sitemap
  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const articles = await storage.getAllArticles();

      const baseUrl = 'https://evaperez-wellness.com';
      const staticPages = [
        '',
        '#sobre-mi',
        '#servicios',
        '#ia-wellness',
        '#portfolio',
        '#testimonios',
        '#blog',
        '#contacto',
        'privacy',
        'terms'
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}

  <!-- Blog Posts -->
  ${articles.map(article => `
  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${new Date(article.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Sitemap generation error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  app.get('/api/articles/:slug', async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el artículo" });
    }
  });

  app.patch('/api/articles/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const updatedArticle = await storage.updateArticle(id, req.body);

      if (!updatedArticle) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el artículo" });
    }
  });



  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
