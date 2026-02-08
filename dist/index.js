var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";
import OpenAI2 from "openai";

// server/storage.ts
import session from "express-session";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appointmentSchema: () => appointmentSchema,
  appointments: () => appointments,
  articles: () => articles,
  contactSchema: () => contactSchema,
  contacts: () => contacts,
  insertArticleSchema: () => insertArticleSchema,
  insertUserSchema: () => insertUserSchema,
  newsletterSchema: () => newsletterSchema,
  newsletters: () => newsletters,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  privacy: boolean("privacy").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var contactSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor introduce un email v\xE1lido" }),
  company: z.string().optional(),
  service: z.string({ required_error: "Por favor selecciona un servicio" }),
  message: z.string().min(10, { message: "Tu mensaje debe tener al menos 10 caracteres" }),
  privacy: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la pol\xEDtica de privacidad"
  })
});
var newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var newsletterSchema = z.object({
  email: z.string().email({ message: "Por favor introduce un email v\xE1lido" })
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull().default(60),
  // duración en minutos
  service: text("service").notNull(),
  // tipo de servicio requerido
  message: text("message"),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var appointmentSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor introduce un email v\xE1lido" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  date: z.coerce.date({ required_error: "Por favor selecciona una fecha y hora" }),
  duration: z.number().int().positive().default(60),
  service: z.string({ required_error: "Por favor selecciona un servicio" }),
  message: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
  privacy: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la pol\xEDtica de privacidad"
  })
});
var articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  readTime: text("read_time").notNull(),
  date: text("date").notNull(),
  language: text("language").notNull().default("es"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertArticleSchema = createInsertSchema(articles).pick({
  slug: true,
  title: true,
  content: true,
  excerpt: true,
  image: true,
  category: true,
  readTime: true,
  date: true,
  language: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, sql } from "drizzle-orm";
import ConnectPgSimple from "connect-pg-simple";
var PgSessionStore = ConnectPgSimple(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PgSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  // ... rest of the class implementation remains the same, just need to make sure I don't delete it.
  // I will use replace_file_content carefully.
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Contact methods
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values({
      name: insertContact.name,
      email: insertContact.email,
      company: insertContact.company || null,
      service: insertContact.service,
      message: insertContact.message,
      privacy: insertContact.privacy
    }).returning();
    return contact;
  }
  async getAllContacts() {
    return await db.select().from(contacts);
  }
  // Newsletter methods
  async createNewsletterSubscription(insertNewsletter) {
    const [existingSubscription] = await db.select().from(newsletters).where(eq(newsletters.email, insertNewsletter.email));
    if (existingSubscription) {
      return existingSubscription;
    }
    const [subscription] = await db.insert(newsletters).values(insertNewsletter).returning();
    return subscription;
  }
  async getAllNewsletterSubscriptions() {
    return await db.select().from(newsletters);
  }
  // Appointment methods
  async createAppointment(insertAppointment) {
    const [appointment] = await db.insert(appointments).values({
      name: insertAppointment.name,
      email: insertAppointment.email,
      phone: insertAppointment.phone || null,
      company: insertAppointment.company || null,
      date: insertAppointment.date,
      duration: insertAppointment.duration,
      service: insertAppointment.service,
      message: insertAppointment.message || null,
      status: insertAppointment.status
    }).returning();
    this.invalidateAvailabilityCache(new Date(insertAppointment.date));
    return appointment;
  }
  async getAppointmentById(id) {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }
  async getAllAppointments() {
    return await db.select().from(appointments);
  }
  async getAppointmentsByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const result = await db.select().from(appointments).where(
      sql`${appointments.date} >= ${startOfDay} AND ${appointments.date} <= ${endOfDay}`
    );
    return result;
  }
  async updateAppointmentStatus(id, status) {
    const [appointment] = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
    if (appointment) {
      this.invalidateAvailabilityCache(new Date(appointment.date));
    }
    return appointment;
  }
  // Cache for availability
  availabilityCache = /* @__PURE__ */ new Map();
  CACHE_TTL = 5 * 60 * 1e3;
  // 5 minutes
  async getAvailableSlots(date) {
    const cacheKey = date.toISOString().split("T")[0];
    const cached = this.availabilityCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    const workStartHour = 9;
    const workEndHour = 18;
    const slotDuration = 60;
    const bookedAppointments = await this.getAppointmentsByDate(date);
    const allSlots = [];
    const startOfDay = new Date(date);
    startOfDay.setHours(workStartHour, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(workEndHour, 0, 0, 0);
    let currentSlotStart = new Date(startOfDay);
    while (currentSlotStart < endOfDay) {
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(currentSlotStart.getMinutes() + slotDuration);
      if (currentSlotEnd <= endOfDay) {
        allSlots.push({
          start: new Date(currentSlotStart),
          end: new Date(currentSlotEnd)
        });
      }
      currentSlotStart.setMinutes(currentSlotStart.getMinutes() + slotDuration);
    }
    const availableSlots = allSlots.filter((slot) => {
      return !bookedAppointments.some((appointment) => {
        const appointmentStartTime = new Date(appointment.date);
        const appointmentEndTime = new Date(appointment.date);
        appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + appointment.duration);
        return slot.start >= appointmentStartTime && slot.start < appointmentEndTime || slot.end > appointmentStartTime && slot.end <= appointmentEndTime || slot.start <= appointmentStartTime && slot.end >= appointmentEndTime;
      });
    });
    this.availabilityCache.set(cacheKey, { data: availableSlots, timestamp: Date.now() });
    return availableSlots;
  }
  invalidateAvailabilityCache(date) {
    const cacheKey = date.toISOString().split("T")[0];
    this.availabilityCache.delete(cacheKey);
  }
  // Article methods
  async createArticle(insertArticle) {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }
  async getArticleBySlug(slug) {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }
  async getAllArticles() {
    return await db.select().from(articles).orderBy(sql`${articles.createdAt} DESC`);
  }
  async updateArticle(id, articleUpdate) {
    const [updatedArticle] = await db.update(articles).set(articleUpdate).where(eq(articles.id, id)).returning();
    return updatedArticle;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";

// server/api/chat.ts
import OpenAI from "openai";
var openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}
var contextInfo = `
Eva P\xE9rez: Experta en Estrategia de Hospitalidad y Bienestar de Lujo (>20 a\xF1os exp).
Misi\xF3n: Transformar \xE1reas wellness de hoteles en motores de rentabilidad estrat\xE9gica.

Servicios:
1. Consultor\xEDa: Viabilidad, concepto, diferenciaci\xF3n.
2. Gesti\xF3n de Proyectos: Dise\xF1o, proveedores, ejecuci\xF3n.
3. Revenue Management: Pricing, fidelizaci\xF3n, KPIs.
4. Formaci\xF3n: Liderazgo, protocolos de excelencia.

Propuesta de Valor: Aumento RevPAR, gasto medio y satisfacci\xF3n del cliente. Hotel Wellness como activo financiero.

Instrucciones ESTRAT\xC9GICAS (Lead Generation):
- Rol: Asistente virtual experto y persuasivo.
- Objetivo Principal: CAPTAR LEADS (emails). No solo informes, \xA1vende el siguiente paso!
- T\xE1ctica: Si el usuario pregunta por precios, servicios espec\xEDficos o muestra inter\xE9s real, NO des toda la informaci\xF3n de golpe.
- Acci\xF3n Clave: Ofr\xE9cele enviarle un "Dossier Ejecutivo" o la "Gu\xEDa de Rentabilidad" por email.
- Ejemplo: "Para darte un presupuesto exacto, puedo enviarte nuestro Dossier de Servicios y un caso de \xE9xito similar al tuyo. \xBFMe facilitas tu correo electr\xF3nico?"
- Idioma: Responde en el idioma del usuario.
`;
async function handleChatRequest(req, res) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Se requiere un array de mensajes" });
    }
    const systemMessage = {
      role: "system",
      content: contextInfo
    };
    if (!openai) {
      return res.status(503).json({
        error: "El servicio de chat no est\xE1 disponible en este momento (Falta configuraci\xF3n de OpenAI)",
        details: "OPENAI_API_KEY no est\xE1 definida"
      });
    }
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      // El modelo más reciente de OpenAI
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7
    });
    res.json({
      response: chatCompletion.choices[0].message,
      usage: chatCompletion.usage
    });
  } catch (err) {
    const error = err;
    console.error("Error en la API de chat:", error);
    res.status(500).json({
      error: "Error al procesar la solicitud del chat",
      details: error.message || "Error desconocido"
    });
  }
}

// server/services/email.ts
import nodemailer from "nodemailer";
var EmailService = class {
  transporter;
  constructor() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      if (process.env.EMAIL_SERVICE) {
        this.transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      } else {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      }
    } else {
      this.transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }
  async sendEmail(options) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("---------------------------------------------------");
        console.log("\u{1F4E7} [MOCK EMAIL SERVICE] Email would be sent:");
        console.log(`From: ${process.env.EMAIL_FROM || "noreply@example.com"}`);
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text: ${options.text}`);
        console.log("---------------------------------------------------");
        return true;
      }
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      });
      console.log(`\u2705 Email sent successfully to ${options.to}`);
      console.log(`Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      console.error("\u274C Error sending email:", error);
      return false;
    }
  }
};
var emailService = new EmailService();

// server/routes.ts
import rateLimit from "express-rate-limit";
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later"
});
var authLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 5,
  // 5 failed attempts
  message: "Too many login attempts, please try again after an hour"
});
function sanitizeInput(text2) {
  if (!text2) return "";
  return text2.replace(/[<>]/g, "").trim();
}
async function registerRoutes(app2) {
  app2.use("/resources", express.static("resources"));
  app2.post("/api/contact", limiter, async (req, res) => {
    if (req.body) {
      if (typeof req.body.message === "string") req.body.message = sanitizeInput(req.body.message);
      if (typeof req.body.name === "string") req.body.name = sanitizeInput(req.body.name);
      if (typeof req.body.company === "string") req.body.company = sanitizeInput(req.body.company);
    }
    try {
      const contactData = contactSchema.parse(req.body);
      const savedContact = await storage.createContact(contactData);
      await emailService.sendEmail({
        to: "eva@evaperez-wellness.com",
        // Replace with actual admin email or env var
        subject: `Nuevo mensaje de contacto: ${contactData.name}`,
        text: `
          Nombre: ${contactData.name}
          Email: ${contactData.email}
          Empresa: ${contactData.company || "N/A"}
          Servicio: ${contactData.service}
          Mensaje: ${contactData.message}
        `
      });
      await emailService.sendEmail({
        to: contactData.email,
        subject: "Hemos recibido tu mensaje - Eva P\xE9rez",
        text: `
Hola ${contactData.name},

Gracias por contactar conmigo. He recibido tu mensaje correctamente.

Revisar\xE9 tu consulta sobre "${contactData.service}" y me pondr\xE9 en contacto contigo lo antes posible, normalmente en un plazo de 24-48 horas laborables.

Atentamente,
Eva P\xE9rez
Spa Manager & Wellness Consultant
https://evaperez-wellness.com
        `
      });
      return res.status(200).json({
        success: true,
        message: "Mensaje enviado correctamente",
        data: savedContact
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos del formulario inv\xE1lidos",
          errors: error.errors
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud"
      });
    }
  });
  app2.post("/api/newsletter", limiter, async (req, res) => {
    try {
      const newsletterData = newsletterSchema.parse(req.body);
      const savedSubscription = await storage.createNewsletterSubscription(newsletterData);
      await emailService.sendEmail({
        to: "eva@evaperez-wellness.com",
        subject: `Nueva suscripci\xF3n a newsletter: ${newsletterData.email}`,
        text: `Se ha suscrito un nuevo usuario: ${newsletterData.email}`
      });
      await emailService.sendEmail({
        to: newsletterData.email,
        subject: "\xA1Bienvenido/a a la comunidad de Eva P\xE9rez! + Tu E-Book gratuito",
        text: `
Hola,

Gracias por suscribirte a mi newsletter. Me alegra mucho tenerte aqu\xED.

Como regalo de bienvenida, aqu\xED tienes tu E-Book gratuito:
"C\xF3mo implementar IA en tu spa hotelero en 30 d\xEDas"

\u{1F4E5} Descarga aqu\xED: https://evaperez-wellness.com/resources/ebook-ia-spa-infographic.html

Este E-Book incluye:
\u2713 Pasos concretos para implementar IA en tu spa
\u2713 Plantilla de implementaci\xF3n lista para usar
\u2713 Casos de uso reales y aplicables

A partir de ahora recibir\xE1s consejos exclusivos sobre estrategia de hospitalidad, bienestar de lujo y gesti\xF3n de spas.

Si tienes alguna pregunta o tema que te gustar\xEDa que tratara, no dudes en responder a este correo.

Atentamente,
Eva P\xE9rez
Spa Manager & Wellness Consultant
https://evaperez-wellness.com
        `
      });
      return res.status(200).json({
        success: true,
        message: "Suscripci\xF3n completada correctamente",
        data: savedSubscription
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Email inv\xE1lido",
          errors: error.errors
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error al procesar la suscripci\xF3n"
      });
    }
  });
  app2.post("/api/chat", limiter, handleChatRequest);
  app2.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = appointmentSchema.parse(req.body);
      const savedAppointment = await storage.createAppointment(appointmentData);
      await emailService.sendEmail({
        to: "eva@evaperez-wellness.com",
        subject: `Nueva cita reservada: ${appointmentData.name}`,
        text: `
          Nombre: ${appointmentData.name}
          Email: ${appointmentData.email}
          Tel\xE9fono: ${appointmentData.phone || "N/A"}
          Empresa: ${appointmentData.company || "N/A"}
          Fecha: ${new Date(appointmentData.date).toLocaleString()}
          Servicio: ${appointmentData.service}
          Mensaje: ${appointmentData.message || "N/A"}
        `
      });
      await emailService.sendEmail({
        to: appointmentData.email,
        subject: "Solicitud de cita recibida - Eva P\xE9rez",
        text: `
Hola ${appointmentData.name},

Gracias por solicitar una cita. He recibido tu petici\xF3n para el d\xEDa ${new Date(appointmentData.date).toLocaleDateString()} a las ${new Date(appointmentData.date).toLocaleTimeString()}.

Tu cita est\xE1 actualmente en estado "Pendiente de confirmaci\xF3n". Revisar\xE9 mi agenda y te enviar\xE9 un correo de confirmaci\xF3n definitiva en breve.

Detalles de la solicitud:
- Servicio: ${appointmentData.service}
- Fecha: ${new Date(appointmentData.date).toLocaleString()}

Si necesitas modificar algo, por favor responde a este correo.

Atentamente,
Eva P\xE9rez
Spa Manager & Wellness Consultant
https://evaperez-wellness.com
        `
      });
      return res.status(201).json({
        success: true,
        message: "Cita reservada correctamente",
        data: savedAppointment
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos de la cita inv\xE1lidos",
          errors: error.errors
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud de cita"
      });
    }
  });
  app2.get("/api/appointments/available", async (req, res) => {
    try {
      const dateParam = req.query.date;
      if (!dateParam || typeof dateParam !== "string") {
        return res.status(400).json({
          success: false,
          message: "Se requiere una fecha v\xE1lida"
        });
      }
      const date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Formato de fecha inv\xE1lido"
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
  app2.get("/api/appointments", async (_req, res) => {
    try {
      const appointments2 = await storage.getAllAppointments();
      return res.status(200).json({
        success: true,
        data: appointments2
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener las citas"
      });
    }
  });
  app2.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Estado de cita inv\xE1lido"
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
  app2.post("/api/articles/generate", async (req, res) => {
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
      const openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai2.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Eres un experto redactor de contenido para un blog de wellness y hospitalidad de lujo. Genera un art\xEDculo en formato JSON con los siguientes campos: title, content (en markdown), excerpt, category, readTime (ej: '5 min read'). El contenido debe estar en ESPA\xD1OL. El tono debe ser profesional, sofisticado y persuasivo, enfocado en hoteles de lujo y estrategias de bienestar."
          },
          {
            role: "user",
            content: `Escribe un art\xEDculo sobre: ${topic}`
          }
        ],
        response_format: { type: "json_object" }
      });
      const content = JSON.parse(completion.choices[0].message.content || "{}");
      const slug = content.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const article = await storage.createArticle({
        slug,
        title: content.title,
        content: content.content,
        excerpt: content.excerpt,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        // Placeholder or use an image search API if available
        category: content.category,
        readTime: content.readTime,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        language: "es"
      });
      return res.status(201).json({ success: true, data: article });
    } catch (error) {
      console.error("Error generating article:", error);
      return res.status(500).json({ success: false, message: "Error generando el art\xEDculo" });
    }
  });
  app2.get("/api/articles", async (_req, res) => {
    try {
      const articles2 = await storage.getAllArticles();
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener art\xEDculos" });
    }
  });
  app2.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Art\xEDculo no encontrado" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el art\xEDculo" });
    }
  });
  app2.patch("/api/articles/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const updatedArticle = await storage.updateArticle(id, req.body);
      if (!updatedArticle) {
        return res.status(404).json({ message: "Art\xEDculo no encontrado" });
      }
      res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el art\xEDculo" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: ["esbuild"]
    // Force Vite to not try to optimize esbuild itself
  }
});

// server/vite.ts
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html: appHtml } = await render(url);
      const html = template.replace(
        /<div id="root">(\s*<!--app-html-->\s*)?<\/div>/,
        `<div id="root">${appHtml}</div>`
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.error(`[serveStatic] Error: Build directory not found at ${distPath}`);
    console.error(`[serveStatic] CWD: ${process.cwd()}`);
    try {
      const distRoot = path2.resolve(process.cwd(), "dist");
      if (fs.existsSync(distRoot)) {
        console.error(`[serveStatic] Contents of ${distRoot}:`, fs.readdirSync(distRoot));
      } else {
        console.error(`[serveStatic] ${distRoot} does not exist.`);
      }
    } catch (e) {
      console.error("[serveStatic] Error listing dist:", e);
    }
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", async (req, res, next) => {
    try {
      const template = fs.readFileSync(path2.resolve(distPath, "index.html"), "utf-8");
      const serverEntryPath = path2.resolve(process.cwd(), "dist", "server", "entry-server.js");
      if (!fs.existsSync(serverEntryPath)) {
        res.sendFile(path2.resolve(distPath, "index.html"));
        return;
      }
      const { render } = await import("file://" + serverEntryPath);
      const { html: appHtml } = await render(req.originalUrl);
      const html = template.replace(
        /<div id="root">(\s*<!--app-html-->\s*)?<\/div>/,
        `<div id="root">${appHtml}</div>`
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });
}

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "super_secret_key_change_in_prod",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  if (app2.get("env") === "production") {
    app2.set("trust proxy", 1);
  }
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/index.ts
import helmet from "helmet";
var app = express3();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://replit.com", "https://*.replit.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.replit.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://*.replit.com"]
    }
  }
}));
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  setupAuth(app);
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
