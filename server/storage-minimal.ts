import express from "express-session";

/**
 * Minimal storage implementation using memory only
 * No database dependencies
 */
export class MinimalStorage {
    sessionStore: express.Store;

    // In-memory storage
    private contacts: any[] = [];
    private newsletters: any[] = [];
    private appointments: any[] = [];

    constructor() {
        // Always use memory store
        this.sessionStore = new express.MemoryStore();
        console.log('✓ Using memory session store (no database)');
    }

    // Contact methods (in-memory)
    async createContact(data: any) {
        const contact = { id: this.contacts.length + 1, ...data, createdAt: new Date() };
        this.contacts.push(contact);
        console.log('📝 Contact saved to memory:', contact.email);
        return contact;
    }

    async getAllContacts() {
        return this.contacts;
    }

    // Newsletter methods (in-memory)
    async createNewsletterSubscription(data: any) {
        const existing = this.newsletters.find(n => n.email === data.email);
        if (existing) {
            console.log('📧 Newsletter subscription already exists:', data.email);
            return existing;
        }
        const subscription = { id: this.newsletters.length + 1, ...data, createdAt: new Date() };
        this.newsletters.push(subscription);
        console.log('📧 Newsletter subscription saved to memory:', data.email);
        return subscription;
    }

    async getAllNewsletterSubscriptions() {
        return this.newsletters;
    }

    // Appointment methods (in-memory)
    async createAppointment(data: any) {
        const appointment = { id: this.appointments.length + 1, ...data, createdAt: new Date() };
        this.appointments.push(appointment);
        console.log('📅 Appointment saved to memory:', appointment.email);
        return appointment;
    }

    async getAppointmentById(id: number) {
        return this.appointments.find(a => a.id === id);
    }

    async getAllAppointments() {
        return this.appointments;
    }

    async getAvailableSlots(date: Date) {
        // Simple mock: return 9am-6pm slots
        const slots = [];
        for (let hour = 9; hour < 18; hour++) {
            const start = new Date(date);
            start.setHours(hour, 0, 0, 0);
            const end = new Date(date);
            end.setHours(hour + 1, 0, 0, 0);
            slots.push({ start, end });
        }
        return slots;
    }

    async updateAppointmentStatus(id: number, status: string) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            appointment.status = status;
            console.log('📅 Appointment status updated:', id, status);
        }
        return appointment;
    }

    // Article methods (mock - return empty for now)
    async createArticle(data: any) {
        console.log('📄 Article creation not available (no database)');
        return data;
    }

    async getArticleBySlug(slug: string) {
        return null;
    }

    async getAllArticles() {
        return [];
    }
}

export const storage = new MinimalStorage();
