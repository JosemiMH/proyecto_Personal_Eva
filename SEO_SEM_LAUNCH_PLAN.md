# Plan de lanzamiento SEO y SEM — EPM Wellness

Fecha: 17 de julio de 2026

## Estado técnico

- Landing específica para tráfico de pago: `/auditoria-spa-hoteles`.
- Medición en `dataLayer` de visitas, formularios, reservas, teléfono, email, chat y descargas.
- Persistencia durante la sesión de UTM, `gclid`, `gbraid`, `wbraid` y `msclkid`.
- Google Tag Manager se carga solo después del consentimiento de cookies.
- Formularios de captación con aceptación explícita de privacidad, validada también en servidor.
- Sitemap de producción con páginas estratégicas y todos los artículos publicados.
- Artículos prerenderizados con datos estructurados `BlogPosting`, enlaces internos y un único H1.

## Campaña recomendada

**Nombre:** `ES | Search | Consultoría Spa Hoteles | Leads`

- Red: solo Búsqueda. Desactivar Display y partners al inicio.
- Ubicación: España, opción de presencia física en la zona objetivo.
- Idioma: español.
- Horario inicial: lunes a viernes, de 08:00 a 20:00.
- Estrategia inicial: maximizar clics con límite de CPC hasta reunir datos; pasar a maximizar conversiones cuando exista volumen suficiente y la medición esté validada.

### Presupuesto

| Escenario | Presupuesto diario | Aproximación mensual |
| --- | ---: | ---: |
| Validación mínima | 10 € | 300 € |
| Recomendado | 20 € | 600 € |
| Acelerado | 35 € | 1.050 € |

No activar inversión ni introducir datos de pago sin aprobación expresa de Eva.

## Conversiones

### Principales

- `generate_lead`: envío del formulario de auditoría o contacto.
- `book_appointment`: reserva confirmada de una consulta.

### Secundarias

- `click_to_call`
- `click_email`
- `chat_start`
- `sign_up`
- `ebook_download`

Importar en Google Ads únicamente las principales como objetivos de puja. Mantener las secundarias en observación para no inflar artificialmente el rendimiento.

## Grupos de anuncios y palabras clave

Usar concordancia exacta y de frase al inicio.

### 1. Consultoría spa hoteles

- "consultoría spa hoteles"
- [consultoría spa hoteles]
- "consultor spa hotelero"
- [consultor spa hotelero]
- "consultoría wellness hoteles"

### 2. Auditoría y rentabilidad spa

- "auditoría spa hotel"
- [auditoría spa hotel]
- "rentabilidad spa hotelero"
- [rentabilidad spa]
- "mejorar rentabilidad spa"

### 3. Gestión y operaciones spa

- "gestión spa hotelero"
- [gestión spa hotelero]
- "optimización operaciones spa"
- "mejorar gestión spa"
- [operaciones spa hotel]

### Negativas iniciales

`empleo`, `trabajo`, `oferta de empleo`, `curso`, `máster`, `formación gratis`, `masaje`, `spa cerca`, `spa barato`, `circuito`, `balneario`, `bono`, `oferta`, `descuento`, `regalo`, `DIY`, `plantilla gratis`.

Revisar el informe de términos de búsqueda dos veces por semana durante el primer mes.

## Anuncio de búsqueda adaptable

### Títulos (máximo 30 caracteres)

1. Consultoría Spa para Hoteles
2. Auditoría Estratégica de Spa
3. Mejora la Rentabilidad Spa
4. Optimiza tu Spa Hotelero
5. Plan de Acción para tu Spa
6. Eva Pérez, Consultora Spa
7. Más de 20 Años en Wellness
8. 40+ Proyectos Wellness
9. Diagnóstico Inicial Gratis
10. Estrategia para Spas de Lujo
11. Mejora Operaciones y Equipo
12. Convierte Datos en Decisiones
13. Consultoría Spa en España
14. Proyectos Spa Internacionales
15. Solicita una Evaluación

### Descripciones (máximo 90 caracteres)

1. Detecta fugas de margen y oportunidades en tu spa hotelero con un diagnóstico experto.
2. Mejora KPIs, procesos, equipo y experiencia del huésped con un plan de acción claro.
3. Más de 20 años de experiencia y 40+ proyectos en hoteles, resorts y centros wellness.
4. Primera conversación gratuita. Expón el reto de tu spa y define el siguiente paso.

Crear al menos dos variantes, sin fijar títulos salvo necesidad legal o de marca.

## URLs y etiquetado

Landing final:

`https://www.epmwellness.com/auditoria-spa-hoteles`

Variantes de seguimiento:

- `https://www.epmwellness.com/auditoria-spa-hoteles?utm_source=google&utm_medium=cpc&utm_campaign=consultoria_spa_hoteles_es&utm_term={keyword}&utm_content=rsa_a`
- `https://www.epmwellness.com/auditoria-spa-hoteles?utm_source=google&utm_medium=cpc&utm_campaign=consultoria_spa_hoteles_es&utm_term={keyword}&utm_content=rsa_b`

Extensiones recomendadas: Servicios, Casos de éxito, Blog y Reservar consulta. Añadir recurso de llamada solo dentro del horario de atención.

## Lista de comprobación antes de activar

1. Confirmar que GTM tiene un identificador de contenedor válido en producción.
2. Crear o revisar GA4 y enlazarlo con Google Ads.
3. Configurar eventos principales como conversiones y probarlos en modo depuración.
4. Verificar que el banner bloquea analítica y publicidad antes del consentimiento.
5. Registrar el sitemap en Google Search Console y revisar la indexación.
6. Validar teléfono, email, formularios, reserva y página de agradecimiento o confirmación.
7. Confirmar presupuesto, ubicación, horario, datos fiscales y medio de pago con Eva.
8. Validar documentalmente los logotipos, nombres de clientes, cifras y testimonios antes de utilizarlos en anuncios.

## Pendientes externos

- Acceso a Google Ads, GTM, GA4 y Search Console.
- Decisión final sobre presupuesto y segmentación geográfica.
- Consentimiento para usar marcas, proyectos y testimonios como prueba social.
- Activación manual de la campaña: este repositorio prepara la landing y la medición, pero no autoriza gasto publicitario.

## Referencias oficiales

- Google Ads, anuncios de búsqueda adaptables: https://support.google.com/google-ads/answer/7684791?hl=es
- Google Ads, seguimiento de conversiones: https://support.google.com/google-ads/answer/10000067?hl=es
- Google Ads, consentimiento y medición: https://support.google.com/google-ads/answer/9888656?hl=es
- Google Analytics, evento recomendado `generate_lead`: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?hl=es#generate_lead
