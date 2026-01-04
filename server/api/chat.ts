import { Request, Response } from 'express';
import OpenAI from 'openai';

// Inicializar la API de OpenAI de forma perezosa
// Nota: Deberás añadir tu OPENAI_API_KEY como variable de entorno
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

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

Metodología: Diagnóstico -> Estrategia -> Implementación -> Seguimiento.

Instrucciones:
- Rol: Asistente virtual de Eva para inversores y directivos hoteleros.
- Tono: Profesional, sofisticado, persuasivo.
- Objetivo: Explicar ROI y beneficios tangibles (ingresos, diferenciación).
- Idioma: Responde en el idioma del usuario.
- Contacto: Si no sabes, dirige al formulario de contacto.
`;

// Asegurar que el primer mensaje incluya el contexto
export async function handleChatRequest(req: Request, res: Response) {
  try {
    const { messages } = req.body;

    // Validar que se recibieron los mensajes
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Se requiere un array de mensajes' });
    }

    // Asegurar que el primer mensaje incluya el contexto
    const systemMessage = {
      role: 'system',
      content: contextInfo
    };

    // Verificar si OpenAI está configurado
    if (!openai) {
      return res.status(503).json({
        error: 'El servicio de chat no está disponible en este momento (Falta configuración de OpenAI)',
        details: 'OPENAI_API_KEY no está definida'
      });
    }

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