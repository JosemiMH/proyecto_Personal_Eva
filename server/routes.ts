import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, newsletterSchema, appointmentSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";
import { handleChatRequest } from "./api/chat";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const savedContact = await storage.createContact(contactData);
      
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
  app.post('/api/newsletter', async (req, res) => {
    try {
      const newsletterData = newsletterSchema.parse(req.body);
      const savedSubscription = await storage.createNewsletterSubscription(newsletterData);
      
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
  app.post('/api/chat', handleChatRequest);

  // Appointment endpoints
  // 1. Crear una nueva cita
  app.post('/api/appointments', async (req, res) => {
    try {
      const appointmentData = appointmentSchema.parse(req.body);
      const savedAppointment = await storage.createAppointment(appointmentData);
      
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
