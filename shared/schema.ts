import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contacts table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  privacy: boolean("privacy").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Por favor introduce un email válido' }),
  company: z.string().optional(),
  service: z.string({ required_error: 'Por favor selecciona un servicio' }),
  message: z.string().min(5, { message: 'Tu mensaje debe tener al menos 5 caracteres' }),
  privacy: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

export type InsertContact = z.infer<typeof contactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Newsletter subscription table
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSchema = z.object({
  email: z.string().email({ message: 'Por favor introduce un email válido' }),
});

export type InsertNewsletter = z.infer<typeof newsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;

// Schema para las citas con Eva
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull().default(60), // duración en minutos
  service: text("service").notNull(), // tipo de servicio requerido
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointmentSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Por favor introduce un email válido' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  date: z.coerce.date({ required_error: 'Por favor selecciona una fecha y hora' }),
  duration: z.number().int().positive().default(60),
  service: z.string({ required_error: 'Por favor selecciona un servicio' }),
  message: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
  privacy: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

export type InsertAppointment = z.infer<typeof appointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Articles table
export const articles = pgTable("articles", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  slug: true,
  title: true,
  content: true,
  excerpt: true,
  image: true,
  category: true,
  readTime: true,
  date: true,
  language: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
