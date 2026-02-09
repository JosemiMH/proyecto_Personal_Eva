import { Request, Response } from 'express';
import OpenAI from 'openai';

// Información contextual resumida sobre Eva Pérez y sus servicios
const contextInfo = `
Eva Pérez: Experta en Estrategia de Hospitalidad y Bienestar de Lujo (>20 años exp).
Misión: Transformar áreas wellness de hoteles en motores de rentabilidad estratégica.

Servicios:
1. Consultoría: Viabilidad, concepto, diferenciación.
2. Gestión de Proyectos: Diseño, proveedores, ejecución.
3. Revenue Management: Pricing, fidelización, KPIs.
4. Formación: Liderazgo, protocolos de excelencia.

Propuesta de Valor: Aumento RevPAR, gasto medio y satisfacción del cliente. Hotel Wellness como activo financiero.

Instrucciones ESTRATÉGICAS (Lead Generation):
- Rol: Asistente virtual experto y persuasivo.
- Objetivo Principal: CAPTAR LEADS (emails). No solo informes, ¡vende el siguiente paso!
- Táctica: Si el usuario pregunta por precios, servicios específicos o muestra interés real, NO des toda la información de golpe.
- Acción Clave: Ofrécele enviarle un "Dossier Ejecutivo" o la "Guía de Rentabilidad" por email.
- Ejemplo: "Para darte un presupuesto exacto, puedo enviarte nuestro Dossier de Servicios y un caso de éxito similar al tuyo. ¿Me facilitas tu correo electrónico?"
- Idioma: Responde en el idioma del usuario.
`;

export async function handleChatRequest(req: Request, res: Response) {
  try {
    const { messages } = req.body;

    // Validar que se recibieron los mensajes
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Se requiere un array de mensajes' });
    }

    // Verificar API Key en el momento de la petición
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: OPENAI_API_KEY missing in environment variables');
      // Debug: Log available keys (sanitized) to help diagnose
      console.error('Available Environment Keys:', Object.keys(process.env).join(', '));

      return res.status(503).json({
        error: 'El servicio de chat no está disponible en este momento (Falta configuración de OpenAI)',
        details: 'OPENAI_API_KEY no está definida en el entorno'
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Asegurar que el primer mensaje incluya el contexto
    const systemMessage = {
      role: 'system',
      content: contextInfo
    };

    // Obtener la respuesta de la API de OpenAI
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // El modelo más reciente de OpenAI
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Enviar la respuesta al cliente
    res.json({
      response: chatCompletion.choices[0].message,
      usage: chatCompletion.usage,
    });

  } catch (err) {
    const error = err as Error;
    console.error('Error en la API de chat:', error);
    res.status(500).json({
      error: 'Error al procesar la solicitud del chat',
      details: error.message || 'Error desconocido'
    });
  }
}