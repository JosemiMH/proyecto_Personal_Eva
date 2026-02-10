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
      await emailService.sendEmail({
        to: "epm@epmwellness.com", // Replace with actual admin email or env var
        subject: `Nuevo mensaje de contacto: ${contactData.name}`,
        text: `
          Nombre: ${contactData.name}
          Email: ${contactData.email}
          Empresa: ${contactData.company || "N/A"}
          Servicio: ${contactData.service}
          Mensaje: ${contactData.message}
        `,
      });

      // Send auto-response to user
      await emailService.sendEmail({
        to: contactData.email,
        subject: "Hemos recibido tu mensaje - Eva Pérez",
        text: `
Hola ${contactData.name},

Gracias por contactar conmigo. He recibido tu mensaje correctamente.

Revisaré tu consulta sobre "${contactData.service}" y me pondré en contacto contigo lo antes posible, normalmente en un plazo de 24-48 horas laborables.

Atentamente,
Eva Pérez
Spa Manager & Wellness Consultant
https://evaperez-wellness.com
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
        subject: "¡Bienvenido/a a la comunidad de Eva Pérez! + Tu E-Book gratuito",
        text: `
Hola,

Gracias por suscribirte a mi newsletter. Me alegra mucho tenerte aquí.

Como regalo de bienvenida, aquí tienes tu E-Book gratuito:
"Cómo implementar IA en tu spa hotelero en 30 días"

📥 Descarga aquí: https://evaperez-wellness.com/resources/ebook-ia-spa-infographic.html

Este E-Book incluye:
✓ Pasos concretos para implementar IA en tu spa
✓ Plantilla de implementación lista para usar
✓ Casos de uso reales y aplicables

A partir de ahora recibirás consejos exclusivos sobre estrategia de hospitalidad, bienestar de lujo y gestión de spas.

Si tienes alguna pregunta o tema que te gustaría que tratara, no dudes en responder a este correo.

Atentamente,
Eva Pérez
Spa Manager & Wellness Consultant
https://evaperez-wellness.com
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
Spa Manager & Wellness Consultant
https://evaperez-wellness.com
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
