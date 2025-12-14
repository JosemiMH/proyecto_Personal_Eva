# PersonalBrandSpa - Eva Pérez Wellness

Sitio web profesional de marca personal para Eva Pérez, experta en Estrategia de Hospitalidad y Bienestar de Lujo.

## 🌟 Características

- 🌍 **Multiidioma**: Soporte completo para español e inglés
- 🤖 **Chatbot IA**: Asistente virtual potenciado por OpenAI GPT-4
- 📧 **Email Automatizado**: Sistema de newsletters y notificaciones
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- 🔍 **SEO Optimizado**: Metadatos completos, structured data y sitemap
- ⚡ **Alto Rendimiento**: Carga rápida y experiencia fluida
- 🎨 **UI Moderna**: Diseño elegante con animaciones suaves

## 🛠️ Tecnologías

### Frontend

- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- Framer Motion
- React Query
- Wouter (routing)

### Backend

- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon)
- Passport.js

### Integraciones

- OpenAI API (Chatbot)
- Brevo/Sendinblue (Email)
- Neon Database (PostgreSQL)

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta en Neon Database
- API Key de OpenAI
- Cuenta en Brevo/Sendinblue

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone [url-del-repositorio]
cd PersonalBrandSpa
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Session
SESSION_SECRET=your-random-secret-key

# Email (Brevo/Sendinblue)
EMAIL_USER=your-smtp-user@smtp-brevo.com
EMAIL_PASS=your-smtp-password
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM=eva@evaperez-wellness.com
```

### 4. Configurar la base de datos

```bash
npm run db:push
```

### 5. Iniciar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
PersonalBrandSpa/
├── client/                 # Frontend React
│   ├── public/            # Archivos estáticos
│   │   ├── robots.txt    # SEO
│   │   ├── sitemap.xml   # SEO
│   │   └── .htaccess     # Configuración Apache
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilidades y traducciones
│   │   └── contexts/     # Context providers
│   └── index.html        # HTML principal (SEO optimizado)
├── server/                # Backend Express
│   ├── api/              # Endpoints API
│   ├── services/         # Servicios (email, etc.)
│   ├── routes.ts         # Rutas
│   ├── db.ts             # Configuración DB
│   └── index.ts          # Servidor principal
├── shared/               # Código compartido
│   └── schema.ts         # Schema de DB
├── package.json
└── .env                  # Variables de entorno
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Build para producción
npm start                # Inicia servidor de producción

# Base de datos
npm run db:push          # Sincroniza schema con DB

# Verificación
npm run check            # Type checking
```

## 🌐 Deployment

### Opción 1: Render

1. Conectar repositorio en [Render.com](https://render.com)
2. Configurar:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Añadir variables de entorno
4. Deploy

### Opción 2: Vercel

```bash
npm install -g vercel
vercel
```

Ver [deployment_guide.md](./deployment_guide.md) para guía completa.

## 📊 SEO

La aplicación incluye optimizaciones SEO completas:

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ JSON-LD Structured Data (Schema.org)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Favicon y theme-color

**SEO Score: 9/10**

## 🤖 Chatbot IA

El chatbot utiliza OpenAI GPT-4 con un prompt personalizado que incluye:

- Contexto sobre Eva Pérez y sus servicios
- Información sobre gestión wellness
- Respuestas en español por defecto
- Tono profesional y cálido

## 📧 Sistema de Emails

Emails automáticos configurados:

- **Newsletter**: Confirmación al suscriptor + notificación a admin
- **Contacto**: Notificación de nuevo mensaje
- **Citas**: Confirmación de cita (si aplica)

Proveedor: Brevo (Sendinblue) SMTP

## 🔒 Seguridad

- Variables de entorno protegidas
- Session secret configurado
- Headers de seguridad (X-Frame-Options, XSS-Protection, etc.)
- Validación de entrada en formularios
- HTTPS recomendado en producción

## 🧪 Testing

Para probar funcionalidades localmente:

1. **Newsletter**: Usa un email real para recibir confirmación
2. **Chatbot**: Pregunta sobre servicios de spa/wellness
3. **Navegación**: Verifica smooth scroll entre secciones
4. **Responsive**: Prueba en diferentes tamaños de pantalla

## 📈 Monitoreo

Recomendado configurar:

- Google Analytics
- Google Search Console
- Sentry (errores)
- Uptime monitoring (UptimeRobot, Pingdom)

## 🐛 Troubleshooting

### El servidor no arranca

```bash
# Verificar que todas las dependencias estén instaladas
npm install

# Verificar variables de entorno
cat .env
```

### Chatbot no responde

- Verificar que `OPENAI_API_KEY` esté configurada
- Revisar logs del servidor
- Verificar límites de uso de OpenAI API

### Emails no se envían

- Verificar credenciales de Brevo
- Revisar logs del servidor
- Confirmar que SMTP_HOST y SMTP_PORT son correctos

### Error 401 en /api/user

- Esto es normal cuando no hay usuario autenticado
- No afecta la funcionalidad de la aplicación

## 📝 Mantenimiento

### Mensual

- Actualizar dependencias: `npm update`
- Revisar logs de errores
- Backup de base de datos

### Trimestral

- Actualizar contenido (blog, portfolio)
- Revisar y actualizar sitemap.xml
- Test completo de funcionalidades

## 🤝 Contribuir

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Eva Pérez - Todos los derechos reservados.

## 📞 Soporte

Para preguntas o soporte:

- Email: <eva@evaperez-wellness.com>
- Website: <https://evaperez-wellness.com>

## 📚 Documentación Adicional

- [Configuration Check](./documentation/configuration_check.md) - Variables de entorno
- [SEO Optimization](./documentation/seo_optimization.md) - Detalles de SEO
- [Deployment Guide](./documentation/deployment_guide.md) - Guía de deployment
- [Walkthrough](./documentation/walkthrough.md) - Resumen completo

---

**Desarrollado con ❤️ por el equipo de Eva Pérez Wellness**

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2025
