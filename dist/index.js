"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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
var import_pg_core, import_drizzle_zod, import_zod, users, insertUserSchema, contacts, contactSchema, newsletters, newsletterSchema, appointments, appointmentSchema, articles, insertArticleSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    import_zod = require("zod");
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      username: (0, import_pg_core.text)("username").notNull().unique(),
      password: (0, import_pg_core.text)("password").notNull()
    });
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).pick({
      username: true,
      password: true
    });
    contacts = (0, import_pg_core.pgTable)("contacts", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      name: (0, import_pg_core.text)("name").notNull(),
      email: (0, import_pg_core.text)("email").notNull(),
      company: (0, import_pg_core.text)("company"),
      service: (0, import_pg_core.text)("service").notNull(),
      message: (0, import_pg_core.text)("message").notNull(),
      privacy: (0, import_pg_core.boolean)("privacy").notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    contactSchema = import_zod.z.object({
      name: import_zod.z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
      email: import_zod.z.string().email({ message: "Por favor introduce un email v\xE1lido" }),
      company: import_zod.z.string().optional(),
      service: import_zod.z.string({ required_error: "Por favor selecciona un servicio" }),
      message: import_zod.z.string().min(10, { message: "Tu mensaje debe tener al menos 10 caracteres" }),
      privacy: import_zod.z.boolean().refine((val) => val === true, {
        message: "Debes aceptar la pol\xEDtica de privacidad"
      })
    });
    newsletters = (0, import_pg_core.pgTable)("newsletters", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      email: (0, import_pg_core.text)("email").notNull().unique(),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    newsletterSchema = import_zod.z.object({
      email: import_zod.z.string().email({ message: "Por favor introduce un email v\xE1lido" })
    });
    appointments = (0, import_pg_core.pgTable)("appointments", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      name: (0, import_pg_core.text)("name").notNull(),
      email: (0, import_pg_core.text)("email").notNull(),
      phone: (0, import_pg_core.text)("phone"),
      company: (0, import_pg_core.text)("company"),
      date: (0, import_pg_core.timestamp)("date").notNull(),
      duration: (0, import_pg_core.integer)("duration").notNull().default(60),
      // duración en minutos
      service: (0, import_pg_core.text)("service").notNull(),
      // tipo de servicio requerido
      message: (0, import_pg_core.text)("message"),
      status: (0, import_pg_core.text)("status").notNull().default("pending"),
      // pending, confirmed, cancelled
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    appointmentSchema = import_zod.z.object({
      name: import_zod.z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
      email: import_zod.z.string().email({ message: "Por favor introduce un email v\xE1lido" }),
      phone: import_zod.z.string().optional(),
      company: import_zod.z.string().optional(),
      date: import_zod.z.coerce.date({ required_error: "Por favor selecciona una fecha y hora" }),
      duration: import_zod.z.number().int().positive().default(60),
      service: import_zod.z.string({ required_error: "Por favor selecciona un servicio" }),
      message: import_zod.z.string().optional(),
      status: import_zod.z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
      privacy: import_zod.z.boolean().refine((val) => val === true, {
        message: "Debes aceptar la pol\xEDtica de privacidad"
      })
    });
    articles = (0, import_pg_core.pgTable)("articles", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      slug: (0, import_pg_core.text)("slug").notNull().unique(),
      title: (0, import_pg_core.text)("title").notNull(),
      content: (0, import_pg_core.text)("content").notNull(),
      excerpt: (0, import_pg_core.text)("excerpt").notNull(),
      image: (0, import_pg_core.text)("image").notNull(),
      category: (0, import_pg_core.text)("category").notNull(),
      readTime: (0, import_pg_core.text)("read_time").notNull(),
      date: (0, import_pg_core.text)("date").notNull(),
      language: (0, import_pg_core.text)("language").notNull().default("es"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
    });
    insertArticleSchema = (0, import_drizzle_zod.createInsertSchema)(articles).pick({
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
  }
});

// server/db.ts
var import_serverless, import_neon_serverless, import_ws, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_serverless = require("@neondatabase/serverless");
    import_neon_serverless = require("drizzle-orm/neon-serverless");
    import_ws = __toESM(require("ws"), 1);
    init_schema();
    import_serverless.neonConfig.webSocketConstructor = import_ws.default;
    if (!process.env.DATABASE_URL) {
      console.warn("\u26A0\uFE0F DATABASE_URL not set - database features will be limited");
      console.warn("\u26A0\uFE0F Sessions will use memory store");
      pool = new import_serverless.Pool({ connectionString: "postgresql://dummy:dummy@localhost:5432/dummy" });
      db = (0, import_neon_serverless.drizzle)({ client: pool, schema: schema_exports });
    } else {
      pool = new import_serverless.Pool({ connectionString: process.env.DATABASE_URL });
      db = (0, import_neon_serverless.drizzle)({ client: pool, schema: schema_exports });
    }
  }
});

// server/test-db-connection.ts
var test_db_connection_exports = {};
__export(test_db_connection_exports, {
  testDatabaseConnection: () => testDatabaseConnection,
  validateDatabaseUrl: () => validateDatabaseUrl
});
async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.warn("\u26A0\uFE0F Skipping database test - DATABASE_URL not configured");
    return false;
  }
  try {
    console.log("Testing database connection...");
    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as current_time, version() as postgres_version");
    client.release();
    console.log("\u2713 Database connection successful");
    console.log(`  PostgreSQL version: ${result.rows[0].postgres_version.split(",")[0]}`);
    console.log(`  Server time: ${result.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error("\u2717 Database connection failed");
    console.error(`  Error: ${error.message}`);
    if (error.code === "ENOTFOUND") {
      console.error("  \u2192 Database host not found. Check DATABASE_URL hostname.");
    } else if (error.code === "ECONNREFUSED") {
      console.error("  \u2192 Connection refused. Check if database is running and port is correct.");
    } else if (error.code === "28P01") {
      console.error("  \u2192 Authentication failed. Check database username/password.");
    }
    console.error("  DATABASE_URL format should be: postgresql://user:pass@host:port/dbname?sslmode=require");
    return false;
  }
}
function validateDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("\u26A0\uFE0F DATABASE_URL environment variable is not set");
    return false;
  }
  if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
    console.error("\u274C DATABASE_URL must start with postgresql:// or postgres://");
    return false;
  }
  console.log("\u2713 DATABASE_URL format looks valid");
  return true;
}
var init_test_db_connection = __esm({
  "server/test-db-connection.ts"() {
    "use strict";
    init_db();
  }
});

// server/index.ts
var import_config = require("dotenv/config");
var import_express3 = __toESM(require("express"), 1);

// server/routes.ts
var import_express = __toESM(require("express"), 1);
var import_http = require("http");
var import_openai2 = __toESM(require("openai"), 1);

// server/storage.ts
var import_express_session = __toESM(require("express-session"), 1);
init_schema();
init_schema();
init_schema();
init_schema();
init_schema();
init_db();
var import_drizzle_orm = require("drizzle-orm");
var import_connect_pg_simple = __toESM(require("connect-pg-simple"), 1);
init_db();
var PgSessionStore = (0, import_connect_pg_simple.default)(import_express_session.default);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    try {
      this.sessionStore = new PgSessionStore({
        pool,
        createTableIfMissing: true
      });
      console.log("\u2713 Using PostgreSQL session store");
    } catch (error) {
      console.warn("\u26A0 PostgreSQL session store unavailable, using memory store:", error);
      console.warn("\u26A0 Sessions will be lost on server restart");
      try {
        const createMemoryStore = require("memorystore");
        const MemoryStore = createMemoryStore(import_express_session.default);
        this.sessionStore = new MemoryStore({
          checkPeriod: 864e5
          // prune expired entries every 24h
        });
      } catch (memError) {
        console.error("\u274C Cannot load memorystore, using default session store");
        this.sessionStore = new import_express_session.default.MemoryStore();
      }
    }
  }
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.id, id));
    return user;
  }
  // ... rest of the class implementation remains the same, just need to make sure I don't delete it.
  // I will use replace_file_content carefully.
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.username, username));
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
    const [existingSubscription] = await db.select().from(newsletters).where((0, import_drizzle_orm.eq)(newsletters.email, insertNewsletter.email));
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
    const [appointment] = await db.select().from(appointments).where((0, import_drizzle_orm.eq)(appointments.id, id));
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
      import_drizzle_orm.sql`${appointments.date} >= ${startOfDay} AND ${appointments.date} <= ${endOfDay}`
    );
    return result;
  }
  async updateAppointmentStatus(id, status) {
    const [appointment] = await db.update(appointments).set({ status }).where((0, import_drizzle_orm.eq)(appointments.id, id)).returning();
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
    const [article] = await db.select().from(articles).where((0, import_drizzle_orm.eq)(articles.slug, slug));
    return article;
  }
  async getAllArticles() {
    return await db.select().from(articles).orderBy(import_drizzle_orm.sql`${articles.createdAt} DESC`);
  }
  async updateArticle(id, articleUpdate) {
    const [updatedArticle] = await db.update(articles).set(articleUpdate).where((0, import_drizzle_orm.eq)(articles.id, id)).returning();
    return updatedArticle;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
init_schema();
var import_zod2 = require("zod");

// server/api/chat.ts
var import_openai = __toESM(require("openai"), 1);
var openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new import_openai.default({
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
var import_nodemailer = __toESM(require("nodemailer"), 1);
var EmailService = class {
  transporter;
  constructor() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      if (process.env.EMAIL_SERVICE) {
        this.transporter = import_nodemailer.default.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      } else {
        this.transporter = import_nodemailer.default.createTransport({
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
      this.transporter = import_nodemailer.default.createTransport({
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
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var limiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later"
});
var authLimiter = (0, import_express_rate_limit.default)({
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
  app2.use("/resources", import_express.default.static("resources"));
  app2.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });
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
      if (error instanceof import_zod2.z.ZodError) {
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
      if (error instanceof import_zod2.z.ZodError) {
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
      if (error instanceof import_zod2.z.ZodError) {
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
      const openai2 = new import_openai2.default({ apiKey: process.env.OPENAI_API_KEY });
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
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// server/vite.ts
var import_express2 = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_meta = {};
var viteLogger = (0, import_vite.createLogger)();
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
  const vite = await (0, import_vite.createServer)({
    server: serverOptions,
    appType: "custom",
    configFile: import_path.default.resolve(import_meta.dirname, "..", "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    }
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path.default.resolve(
        import_meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
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
  const distPath = import_path.default.resolve(process.cwd(), "dist", "public");
  if (!import_fs.default.existsSync(distPath)) {
    console.error(`[serveStatic] Error: Build directory not found at ${distPath}`);
    console.error(`[serveStatic] CWD: ${process.cwd()}`);
    try {
      const distRoot = import_path.default.resolve(process.cwd(), "dist");
      if (import_fs.default.existsSync(distRoot)) {
        console.error(`[serveStatic] Contents of ${distRoot}:`, import_fs.default.readdirSync(distRoot));
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
  app2.use(import_express2.default.static(distPath));
  app2.use("*", async (req, res, next) => {
    try {
      const template = import_fs.default.readFileSync(import_path.default.resolve(distPath, "index.html"), "utf-8");
      const serverEntryPath = import_path.default.resolve(process.cwd(), "dist", "server", "entry-server.js");
      if (!import_fs.default.existsSync(serverEntryPath)) {
        res.sendFile(import_path.default.resolve(distPath, "index.html"));
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
var import_passport = __toESM(require("passport"), 1);
var import_passport_local = require("passport-local");
var import_express_session2 = __toESM(require("express-session"), 1);
var import_crypto = require("crypto");
var import_util = require("util");
var scryptAsync = (0, import_util.promisify)(import_crypto.scrypt);
async function hashPassword(password) {
  const salt = (0, import_crypto.randomBytes)(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return (0, import_crypto.timingSafeEqual)(hashedBuf, suppliedBuf);
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
  app2.use((0, import_express_session2.default)(sessionSettings));
  app2.use(import_passport.default.initialize());
  app2.use(import_passport.default.session());
  import_passport.default.use(
    new import_passport_local.Strategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  import_passport.default.serializeUser((user, done) => done(null, user.id));
  import_passport.default.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/login", import_passport.default.authenticate("local"), (req, res) => {
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
var import_helmet = __toESM(require("helmet"), 1);
var app = (0, import_express3.default)();
app.use((0, import_helmet.default)({
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
app.use(import_express3.default.json());
app.use(import_express3.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
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
  try {
    console.log("\u{1F680} Starting PersonalBrandSpa server...");
    console.log(`Environment: ${app.get("env")}`);
    console.log(`Node version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    try {
      const { testDatabaseConnection: testDatabaseConnection2 } = await Promise.resolve().then(() => (init_test_db_connection(), test_db_connection_exports));
      const dbConnected = await testDatabaseConnection2();
      if (!dbConnected) {
        console.warn("\u26A0 Starting server without database connection");
        console.warn("\u26A0 Using memory store for sessions");
      }
    } catch (dbError) {
      console.warn("\u26A0 Database test failed, continuing anyway:", dbError.message);
    }
    setupAuth(app);
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("\u274C Error handler:", err);
    });
    const environment = app.get("env");
    if (environment === "development") {
      console.log("Setting up Vite dev server...");
      await setupVite(app, server);
      console.log("Vite dev server setup complete.");
    } else {
      console.log("\u{1F4C1} Serving static files from dist/public");
      serveStatic(app);
    }
    const port = parseInt(process.env.PORT || "5000", 10);
    console.log(`\u{1F3AF} Attempting to listen on port ${port}...`);
    server.listen(port, "0.0.0.0", () => {
      console.log("");
      console.log("\u2705 ================================");
      console.log(`\u2705 Server successfully started!`);
      console.log(`\u2705 Listening on port ${port}`);
      console.log(`\u2705 URL: http://localhost:${port}`);
      console.log("\u2705 ================================");
      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("\u274C ================================");
    console.error("\u274C FATAL ERROR DURING STARTUP");
    console.error("\u274C ================================");
    console.error(error);
    console.error("");
    process.exit(1);
  }
})();
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
//# sourceMappingURL=index.js.map
