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

// Información contextual sobre Eva Pérez y sus servicios
const contextInfo = `
Eva Pérez es una Experta en Estrategia de Hospitalidad y Bienestar de Lujo, 
especializada en la transformación de áreas de Wellness en hoteles para 
convertirlas en motores de crecimiento estratégico.

Sus servicios principales incluyen:
1. Consultoría estratégica para áreas wellness en hoteles:
   - Análisis de viabilidad y desarrollo de concepto
   - Estrategias de posicionamiento y diferenciación
   - Creación de experiencias wellness exclusivas
   - Análisis de competencia y oportunidades de mercado

2. Gestión de proyectos de SPA:
   - Planificación y diseño de espacios wellness
   - Selección de equipamiento y proveedores
   - Desarrollo de menús de tratamientos y servicios
   - Supervisión de la ejecución y puesta en marcha

3. Optimización de ingresos para centros wellness:
   - Estrategias de pricing y yield management
   - Programas de fidelización y captación de clientes
   - Análisis de KPIs y métricas de rendimiento
   - Implementación de sistemas de gestión y reservas

4. Formación y desarrollo de equipos:
   - Selección y capacitación de personal especializado
   - Desarrollo de protocolos de servicio y atención al cliente
   - Liderazgo y gestión de talento
   - Formación continua y actualización de conocimientos

Eva cuenta con más de 20 años de experiencia en el sector, 
optimizando operaciones, formando equipos excepcionales 
y elevando la satisfacción del cliente.

INFORMACIÓN ADICIONAL SOBRE GESTIÓN WELLNESS EN HOTELES:

La gestión wellness en hoteles es un área especializada del sector hotelero centrada en crear experiencias de bienestar para los huéspedes. Esto incluye la administración de spas, programas de fitness, nutrición y actividades de bienestar.

Importancia de la gestión wellness:
- Genera una nueva fuente de ingresos para el hotel
- Aumenta el valor percibido por los clientes
- Diferencia al hotel de la competencia
- Mejora la satisfacción y fidelización de los huéspedes
- Atrae a un segmento premium con mayor poder adquisitivo

Componentes clave de la gestión wellness en hoteles:
1. Diseño y conceptualización de espacios wellness (spa, gimnasio, áreas de relajación)
2. Creación de experiencias y tratamientos exclusivos
3. Selección y formación de personal especializado
4. Desarrollo de estrategias de precios y paquetes
5. Marketing específico para servicios wellness
6. Gestión operativa eficiente de las instalaciones
7. Control de calidad y evaluación de la experiencia del cliente
8. Análisis financiero y optimización de ingresos

Tendencias actuales en gestión wellness hotelera:
- Integración de tecnología (apps de bienestar, dispositivos de seguimiento)
- Programas personalizados según las necesidades de cada huésped
- Experiencias wellness inmersivas y transformadoras
- Sostenibilidad y productos naturales/orgánicos
- Bienestar mental y emocional, no solo físico
- Programas de bienestar corporativo para empresas

Para una gestión wellness exitosa se requiere combinar conocimientos de:
- Operaciones hoteleras
- Gestión de spa y bienestar
- Marketing y ventas en el sector de lujo
- Gestión financiera y análisis de datos
- Desarrollo de recursos humanos
- Tendencias del mercado de bienestar

El retorno de inversión (ROI) de una adecuada gestión wellness se refleja en:
- Incremento del RevPAR (Revenue Per Available Room)
- Mayor gasto medio por huésped
- Aumento de la estancia media
- Mejor posicionamiento del hotel
- Generación de ingresos adicionales por venta de productos y membresías
- Mayor atractivo para segmentos premium
`;

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
      content: `Eres el asistente virtual de Eva Pérez, experta en Estrategia de Hospitalidad y Bienestar de Lujo. ${contextInfo}

                INFORMACIÓN ESPECÍFICA SOBRE INVERSIÓN EN PROYECTOS WELLNESS:
                
                Para hoteles considerando invertir en áreas wellness (spa, fitness, bienestar), Eva ofrece:
                - Estudios de viabilidad y retorno de inversión
                - Proyecciones financieras a 3-5 años
                - Análisis comparativo con benchmarks del sector
                - Estrategias de inversión escalonada para minimizar riesgos
                - Optimización de espacios existentes vs. nueva construcción
                
                METODOLOGÍA DE TRABAJO DE EVA PÉREZ:
                
                1. Fase de diagnóstico:
                   - Análisis de la propiedad y su posicionamiento actual
                   - Estudio de mercado y competencia
                   - Identificación de oportunidades y desafíos
                
                2. Fase de estrategia:
                   - Desarrollo de concepto wellness adaptado al hotel
                   - Definición de objetivos comerciales y operativos
                   - Planificación de recursos necesarios
                
                3. Fase de implementación:
                   - Acompañamiento en la ejecución del proyecto
                   - Formación del equipo
                   - Desarrollo de protocolos y estándares
                
                4. Fase de seguimiento:
                   - Medición de resultados
                   - Ajustes y optimización continua
                   - Planes de desarrollo a medio-largo plazo
                
                INSTRUCCIONES PARA RESPONDER:
                - Responde de manera profesional, cálida y concisa.
                - Enfócate en ayudar a potenciales clientes a entender cómo Eva puede transformar sus áreas wellness en motores de crecimiento.
                - Destaca los beneficios tangibles que Eva aporta: aumento de ingresos, diferenciación, satisfacción del cliente.
                - Adapta el lenguaje al perfil de quien pregunta (directivos de hotel, inversores, gerentes de spa).
                - Incluye siempre datos concretos y ejemplos prácticos cuando sea posible.
                - Si no sabes la respuesta específica, sugiere contactar directamente con Eva a través del formulario de contacto.
                - Responde siempre en el mismo idioma en que te preguntan (español o inglés).`
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