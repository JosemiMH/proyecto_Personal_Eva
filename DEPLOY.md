# Guía de Despliegue - Marca Personal Eva Pérez

Esta aplicación está lista para ser desplegada en **Render**, una plataforma moderna compatible con aplicaciones Node.js + PostgreSQL.

## 📋 Requisitos Previos

1. Cuenta en [GitHub](https://github.com/)
2. Cuenta en [Render](https://render.com/)
3. Base de datos PostgreSQL (recomendado: [Neon](https://neon.tech/))

---

## 🚀 Paso 1: Preparar el Repositorio en GitHub

### 1.1 Crear el Repositorio

1. Ve a [GitHub](https://github.com/) y crea un **nuevo repositorio**
2. Nómbralo `marca-personal-eva` (o el nombre que prefieras)
3. **NO** inicialices con README, .gitignore ni licencia (déjalo vacío)

### 1.2 Subir el Código

Ejecuta los siguientes comandos en tu terminal desde la carpeta del proyecto:

```bash
# Si aún no has inicializado git
git init

# Añade todos los archivos
git add .

# Haz el primer commit
git commit -m "Initial commit: Personal Brand SPA"

# Conecta con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/marca-personal-eva.git

# Verifica que la rama principal sea 'main'
git branch -M main

# Sube el código
git push -u origin main
```

> **Nota:** Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## 🌐 Paso 2: Crear el Web Service en Render

### 2.1 Configuración Inicial

1. Accede a tu [Dashboard de Render](https://dashboard.render.com/)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu cuenta de GitHub (si aún no lo has hecho)
4. Selecciona el repositorio `marca-personal-eva`

### 2.2 Configuración del Servicio

Completa los campos con los siguientes valores:

| Campo | Valor |
|-------|-------|
| **Name** | `marca-personal-eva` |
| **Runtime** | `Node` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |

> **¿Por qué Frankfurt?** Si tu base de datos Neon está en EU Central, usar la misma región reduce la latencia.

### 2.3 Plan

- Selecciona el plan **Free** para empezar (puedes actualizarlo más tarde)

---

## 🔐 Paso 3: Configurar Variables de Entorno

En la sección **"Environment"** de Render, añade las siguientes variables:

| Key | Value | Descripción |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require` | URL de conexión a tu base de datos PostgreSQL |
| `NODE_ENV` | `production` | Modo de ejecución |
| `OPENAI_API_KEY` | *(Opcional)* Tu API key de OpenAI | Solo si quieres activar el chatbot con IA |

### 📝 Ejemplo de DATABASE_URL para Neon

```
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

> **⚠️ IMPORTANTE:** La URL de la base de datos debe incluir `sslmode=require` para Neon y otras bases de datos en la nube.

---

## ✅ Paso 4: Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a:
   - Clonar tu repositorio
   - Instalar dependencias (`npm install`)
   - Ejecutar el build (`npm run build`)
   - Iniciar la aplicación (`npm start`)

3. El proceso tarda entre 2-5 minutos
4. Una vez completado, recibirás una URL pública del tipo:

   ```
   https://marca-personal-eva.onrender.com
   ```

---

## 🗄️ Paso 5: Inicializar la Base de Datos

Después del despliegue inicial, necesitas crear las tablas en la base de datos.

### Opción 1: Usando Drizzle Kit (Recomendado)

1. En tu terminal local, asegúrate de tener la variable `DATABASE_URL` en tu archivo `.env`:

   ```
   DATABASE_URL=postgresql://...
   ```

2. Ejecuta:

   ```bash
   npm run db:push
   ```

Esto creará automáticamente todas las tablas necesarias.

### Opción 2: Ejecutar SQL Manualmente

Si prefieres hacerlo manualmente, consulta el archivo [`server/schema.sql`](./server/schema.sql) y ejecútalo en tu cliente PostgreSQL (ej. pgAdmin, psql, o la consola de Neon).

---

## 🔧 Solución de Problemas

### ❌ Error: "Port already in use"

**Causa:** Render asigna automáticamente un puerto dinámico mediante `process.env.PORT`.

**Solución:** El código ya está configurado para usar `process.env.PORT || 5000`. No requiere cambios.

### ❌ Error: "DATABASE_URL must be set"

**Causa:** La variable de entorno `DATABASE_URL` no está configurada en Render.

**Solución:**

1. Ve a tu servicio en Render
2. Selecciona la pestaña **"Environment"**
3. Añade la variable `DATABASE_URL` con la URL de tu base de datos

### ❌ Error: "Build failed"

**Posibles causas:**

- Dependencias faltantes en `package.json`
- Errores de TypeScript

**Solución:**

1. Revisa los logs de build en Render
2. Ejecuta `npm run build` localmente para ver el error exacto
3. Corrige los errores y haz push a GitHub

### ❌ La aplicación se despliega pero no responde

**Causa:** El servidor no está escuchando en `0.0.0.0` o el puerto correcto.

**Solución:** El código ya está configurado correctamente en `server/index.ts`:

```typescript
server.listen({
  port: process.env.PORT || 5000,
  host: "0.0.0.0",
}, () => {
  log(`serving on port ${port}`);
});
```

Si modificaste el server, asegúrate de incluir `host: "0.0.0.0"`.

---

## 🔄 Actualizaciones Futuras

Render tiene **auto-deploy** activado por defecto. Esto significa que:

1. Cada vez que hagas `git push` a la rama `main`
2. Render detectará los cambios automáticamente
3. Reconstruirá y redesplegar la aplicación

Para desactivar auto-deploy:

- Ve a **Settings** → **Build & Deploy** → Desactiva "Auto-Deploy"

---

## 📊 Verificación Post-Despliegue

### Checklist de Verificación

- [ ] La página principal carga correctamente
- [ ] El formulario de contacto funciona
- [ ] La suscripción al newsletter funciona
- [ ] El sistema de citas muestra horarios disponibles
- [ ] (Opcional) El chatbot responde si configuraste `OPENAI_API_KEY`

### Probar endpoints manualmente

```bash
# Salud del servidor
curl https://tu-app.onrender.com/

# Crear contacto
curl -X POST https://tu-app.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Prueba"}'

# Newsletter
curl -X POST https://tu-app.onrender.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Guía de Node.js en Render](https://render.com/docs/deploy-node-express-app)
- [Troubleshooting de Render](https://render.com/docs/troubleshooting)
- [Neon Database Docs](https://neon.tech/docs)

---

## 🎉 ¡Listo

Tu aplicación ahora está en producción y accesible desde cualquier lugar del mundo. 🌍

Para cualquier pregunta o problema, revisa los logs en Render:

- **Dashboard** → Tu servicio → **Logs**
