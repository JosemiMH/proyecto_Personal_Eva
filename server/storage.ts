import { users, type User, type InsertUser } from "@shared/schema";
import { contacts, type Contact, type InsertContact } from "@shared/schema";
import { newsletters, type Newsletter, type InsertNewsletter } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Define storage interface for CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  
  createNewsletterSubscription(subscription: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletterSubscriptions(): Promise<Newsletter[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

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
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();
