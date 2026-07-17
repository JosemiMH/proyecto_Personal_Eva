# Registro de transparencia y uso responsable de IA

Fecha de implantación: 17 de julio de 2026  
Próxima revisión: antes del 2 de agosto de 2026 y ante cualquier cambio de proveedor, modelo o finalidad

Este registro documenta los controles aplicados en EPM Wellness. No constituye una certificación jurídica y debe revisarse con asesoramiento profesional cuando cambie el uso de la IA.

## Sistemas y usos actuales

### Asistente virtual de la web

- Finalidad: responder consultas generales y orientar sobre los servicios de EPM Wellness.
- Proveedor tecnológico: OpenAI mediante la API `chat/completions`.
- Interacción: directa con personas usuarias.
- Decisiones automatizadas: ninguna con efectos jurídicos o de importancia similar.
- Datos: texto introducido por la persona, respuesta generada y datos técnicos necesarios para seguridad y comunicación.
- Persistencia de EPM Wellness: no se guarda el historial del chat en la base de datos de la aplicación.
- Supervisión: el asistente informa de sus limitaciones y deriva el asesoramiento profesional al equipo humano.

### Contenidos e imágenes

- Determinados materiales pueden elaborarse con asistencia de IA.
- EPM Wellness mantiene revisión humana y responsabilidad editorial sobre lo publicado.
- La web ofrece una declaración general visible y enlaza la política editorial mediante la propiedad Schema.org `publishingPrinciples`.
- Las imágenes sintéticas de los casos se identifican en el HTML como representaciones conceptuales y los avatares de testimonios como retratos ilustrativos, sin presentarlos como fotografías documentales.
- Una imagen, audio o vídeo que represente falsamente como auténtica a una persona, lugar, entidad o acontecimiento real debe revisarse individualmente como posible ultrasuplantación y etiquetarse en el propio contenido cuando resulte aplicable.
- La identificación técnica y en texto alternativo no sustituye una etiqueta visible si el contenido llegara a encajar en la definición legal de ultrasuplantación.

## Controles implantados

- Aviso claro antes de la primera interacción con el chatbot, disponible en español e inglés.
- Confirmación del aviso recordada mediante almacenamiento local estrictamente técnico.
- Acceso directo desde el aviso a privacidad y aviso legal.
- Información sobre finalidad, base jurídica, proveedor, transferencias, conservación y ausencia de decisiones automatizadas.
- Información sobre IA en el pie de página y en el aviso legal.
- Exclusión de cuerpos de respuestas de API en los registros del servidor para reducir datos personales en logs.
- Marcado estructurado válido que enlaza los principios editoriales, sin propiedades Schema.org inventadas.

## Controles operativos que debe mantener EPM Wellness

1. Mantener un inventario de herramientas, modelos, finalidades, responsables y fechas de revisión.
2. Formar a toda persona que opere o supervise IA con un nivel adecuado de alfabetización, conforme al artículo 4 del Reglamento de IA.
3. Revisar periódicamente el contrato de encargo, los subencargados, las transferencias internacionales y los ajustes de retención del proveedor.
4. No activar el uso de conversaciones para entrenamiento o mejora sin una evaluación y una base jurídica específicas, además de actualizar la información a las personas usuarias.
5. No introducir reconocimiento de emociones, categorización biométrica, perfilado o decisiones automatizadas sin una evaluación jurídica previa.
6. Conservar evidencia de las revisiones humanas de contenidos y retirar o corregir con rapidez materiales inexactos.
7. Revisar las directrices definitivas y futuras actualizaciones de la Comisión sobre el artículo 50.
8. Mantener publicados únicamente testimonios auténticos, autorizados y verificables; si un nombre, cargo, entidad o cita es ficticio o meramente demostrativo, retirarlo o identificarlo inequívocamente como ejemplo.

## Referencias oficiales

- Reglamento (UE) 2024/1689, artículos 4 y 50: https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689
- Calendario de aplicación del Reglamento de IA: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689
- Código de buenas prácticas sobre transparencia de contenidos generados por IA: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
- Reglamento (UE) 2016/679 (RGPD): https://eur-lex.europa.eu/eli/reg/2016/679/spa
- Controles de datos de la API de OpenAI: https://platform.openai.com/docs/models/default-usage-policies-by-endpoint
- Addendum de tratamiento de datos de OpenAI: https://openai.com/policies/data-processing-addendum/
