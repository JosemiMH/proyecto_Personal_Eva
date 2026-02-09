import session from "express-session";
import createMemoryStore from "memorystore";
import { users, type User, type InsertUser } from "@shared/schema";
import { contacts, type Contact, type InsertContact } from "@shared/schema";
import { newsletters, type Newsletter, type InsertNewsletter } from "@shared/schema";
import { appointments, type Appointment, type InsertAppointment } from "@shared/schema";
import { articles, type Article, type InsertArticle } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSessionStore = ConnectPgSimple(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  createNewsletterSubscription(subscription: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletterSubscriptions(): Promise<Newsletter[]>;

  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  getAvailableSlots(date: Date): Promise<{ start: Date; end: Date; }[]>;

  createArticle(article: InsertArticle): Promise<Article>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getAllArticles(): Promise<Article[]>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    try {
      // Try PostgreSQL session store first
      this.sessionStore = new PgSessionStore({
        pool,
        createTableIfMissing: true,
      });
      console.log('✓ Using PostgreSQL session store');
    } catch (error) {
      // Fallback to memory store if PostgreSQL fails
      console.warn('⚠ PostgreSQL session store unavailable, using memory store:', error);
      console.warn('⚠ Sessions will be lost on server restart');

      // Dynamically import memorystore only if needed
      try {
        const createMemoryStore = require('memorystore');
        const MemoryStore = createMemoryStore(session);
        this.sessionStore = new MemoryStore({
          checkPeriod: 86400000 // prune expired entries every 24h
        });
      } catch (memError) {
        // If memorystore is not available, use default
        console.error('❌ Cannot load memorystore, using default session store');
        this.sessionStore = new session.MemoryStore();
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  // ... rest of the class implementation remains the same, just need to make sure I don't delete it.
  // I will use replace_file_content carefully.


  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values({
      name: insertContact.name,
      email: insertContact.email,
      company: insertContact.company || null,
      service: insertContact.service,
      message: insertContact.message,
      privacy: insertContact.privacy,
    }).returning();

    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  // Newsletter methods
  async createNewsletterSubscription(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const [existingSubscription] = await db.select()
      .from(newsletters)
      .where(eq(newsletters.email, insertNewsletter.email));

    if (existingSubscription) {
      return existingSubscription;
    }

    const [subscription] = await db.insert(newsletters)
      .values(insertNewsletter)
      .returning();

    return subscription;
  }

  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    return await db.select().from(newsletters);
  }

  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values({
      name: insertAppointment.name,
      email: insertAppointment.email,
      phone: insertAppointment.phone || null,
      company: insertAppointment.company || null,
      date: insertAppointment.date,
      duration: insertAppointment.duration,
      service: insertAppointment.service,
      message: insertAppointment.message || null,
      status: insertAppointment.status,
    }).returning();

    this.invalidateAvailabilityCache(new Date(insertAppointment.date));

    return appointment;
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    // Obtener todas las citas para una fecha específica (ignora la hora)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await db.select()
      .from(appointments)
      .where(
        sql`${appointments.date} >= ${startOfDay} AND ${appointments.date} <= ${endOfDay}`
      );

    return result;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();

    if (appointment) {
      this.invalidateAvailabilityCache(new Date(appointment.date));
    }

    return appointment;
  }


  // Cache for availability
  private availabilityCache: Map<string, { data: { start: Date; end: Date; }[], timestamp: number }> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getAvailableSlots(date: Date): Promise<{ start: Date; end: Date; }[]> {
    const cacheKey = date.toISOString().split('T')[0];
    const cached = this.availabilityCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL)) {
      return cached.data;
    }

    // Horario de trabajo: 9:00 AM a 6:00 PM
    const workStartHour = 9;
    const workEndHour = 18;

    // Duración de cada cita en minutos
    const slotDuration = 60;

    // Obtener todas las citas para esta fecha
    const bookedAppointments = await this.getAppointmentsByDate(date);

    // Crear array con todos los slots posibles para ese día
    const allSlots: { start: Date; end: Date; }[] = [];

    const startOfDay = new Date(date);
    startOfDay.setHours(workStartHour, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(workEndHour, 0, 0, 0);

    // Generar todos los slots posibles del día
    let currentSlotStart = new Date(startOfDay);

    while (currentSlotStart < endOfDay) {
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(currentSlotStart.getMinutes() + slotDuration);

      // Solo añadir si el slot termina antes del fin del día laboral
      if (currentSlotEnd <= endOfDay) {
        allSlots.push({
          start: new Date(currentSlotStart),
          end: new Date(currentSlotEnd)
        });
      }

      // Avanzar al siguiente slot
      currentSlotStart.setMinutes(currentSlotStart.getMinutes() + slotDuration);
    }

    // Filtrar los slots que ya están reservados
    const availableSlots = allSlots.filter(slot => {
      return !bookedAppointments.some(appointment => {
        const appointmentStartTime = new Date(appointment.date);
        const appointmentEndTime = new Date(appointment.date);
        appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + appointment.duration);

        // Un slot está ocupado si se superpone con una cita existente
        return (
          (slot.start >= appointmentStartTime && slot.start < appointmentEndTime) ||
          (slot.end > appointmentStartTime && slot.end <= appointmentEndTime) ||
          (slot.start <= appointmentStartTime && slot.end >= appointmentEndTime)
        );
      });
    });

    this.availabilityCache.set(cacheKey, { data: availableSlots, timestamp: Date.now() });
    return availableSlots;
  }

  private invalidateAvailabilityCache(date: Date) {
    const cacheKey = date.toISOString().split('T')[0];
    this.availabilityCache.delete(cacheKey);
  }

  // Article methods
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async getAllArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(sql`${articles.createdAt} DESC`);
  }

  async updateArticle(id: number, articleUpdate: Partial<InsertArticle>): Promise<Article | undefined> {
    const [updatedArticle] = await db.update(articles)
      .set(articleUpdate)
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();
