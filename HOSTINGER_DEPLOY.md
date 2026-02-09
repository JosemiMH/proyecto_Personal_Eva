# Guía de Despliegue en Hostinger - Marca Personal Eva Pérez

Esta guía proporciona instrucciones paso a paso para desplegar la aplicación PersonalBrandSpa en Hostinger usando la integración con GitHub.

## 📋 Requisitos Previos

1. ✅ Cuenta activa en [Hostinger](https://www.hostinger.com/) con Node.js hosting
2. ✅ Repositorio en [GitHub](https://github.com/) con el código de la aplicación
3. ✅ Base de datos PostgreSQL (puede ser externa, por ejemplo [Neon](https://neon.tech/))
4. ✅ Cuenta de email SMTP (Brevo/Sendinblue configurado)

---

## 🚀 Configuración en Hostinger

### Paso 1: Preparar el Repositorio GitHub

1. **Asegúrate de que todos los cambios estén en GitHub:**

   ```bash
   git add .
   git commit -m "Preparar para deployment en Hostinger"
   git push origin main
   ```

2. **Verifica que el repositorio tenga estos archivos clave:**
   - `package.json` con scripts de build correctos
   - `dist/` en `.gitignore` (el build se hará en Hostinger)
   - `.env.example` como referencia

### Paso 2: Configurar Node.js en Hostinger

1. Accede al panel de control de Hostinger (hPanel)
2. Ve a **Avanzado** → **Node.js**
3. Haz clic en **Crear aplicación**

### Paso 3: Configuración de Compilación

Completa la configuración según la siguiente tabla:

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Preajuste del marco** | Express | Framework backend |
| **Versión de Node** | 22.x | Versión más reciente |
| **Rama** | main | Rama principal del repositorio |
| **Directorio raíz** | `/` | Raíz del proyecto |
| **Archivo de entrada** | `dist/index.js` | Punto de entrada del servidor |
| **Gestor de paquetes** | npm | Gestor de dependencias |

### Paso 4: Variables de Entorno

En la sección **Variables de entorno**, añade todas las siguientes variables:

#### Base de Datos

```
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database?sslmode=require
```

#### Configuración de Producción

```
NODE_ENV=production
PORT=3000
```

> [!IMPORTANT]
> Hostinger usa el puerto 3000 por defecto. No cambies este valor.

#### Email (Brevo/Sendinblue)

```
EMAIL_USER=tu-usuario@smtp-brevo.com
EMAIL_PASS=tu-api-key-o-password
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM=eva@evaperez-wellness.com
```

#### OpenAI (Opcional - para chatbot)

```
OPENAI_API_KEY=sk-proj-...
```

#### Session Secret (Importante para seguridad)

```
SESSION_SECRET=genera-una-cadena-aleatoria-muy-larga-minimo-32-caracteres
```

> [!TIP]
> Para generar un SESSION_SECRET seguro, usa:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Paso 5: Conectar GitHub

1. Haz clic en **Conectar con GitHub**
2. Autoriza a Hostinger para acceder a tus repositorios
3. Selecciona el repositorio de tu aplicación
4. Selecciona la rama `main`

### Paso 6: Desplegar

1. **Guarda la configuración** haciendo clic en el botón de guardar
2. Hostinger comenzará automáticamente el proceso de deployment:
   - Clona el repositorio desde GitHub
   - Ejecuta `npm install` para instalar dependencias
   - Ejecuta `npm run build` para construir la aplicación
   - Inicia el servidor con `npm start`

3. El proceso tarda aproximadamente **3-5 minutos**

4. Una vez completado, recibirás una URL del tipo:

   ```
   https://tu-app.hostinger.com
   ```

---

## 🔍 Verificación Post-Despliegue

### Checklist de Verificación

Abre tu aplicación y verifica:

- [ ] La página principal carga correctamente
- [ ] Las imágenes y recursos estáticos se muestran
- [ ] El formulario de contacto funciona
- [ ] La suscripción al newsletter funciona
- [ ] El sistema de citas muestra horarios disponibles
- [ ] (Si configuraste OpenAI) El chatbot responde

### Ver Logs de la Aplicación

Para revisar los logs del servidor:

1. En hPanel, ve a **Node.js**
2. Haz clic en tu aplicación
3. Ve a la pestaña **Logs**
4. Revisa:
   - **Build logs**: Logs del proceso de construcción
   - **Application logs**: Logs del servidor en ejecución

### Comandos de Prueba

Desde tu terminal local, prueba los endpoints:

```bash
# Health check (si existe)
curl https://tu-app.hostinger.com/

# Test de contacto
curl -X POST https://tu-app.hostinger.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","service":"consulting","message":"Prueba","privacy":true}'

# Test de newsletter
curl -X POST https://tu-app.hostinger.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 🔄 Actualizaciones Futuras

### Auto-Deploy desde GitHub

Hostinger tiene **auto-deploy** activado por defecto:

1. Cada vez que hagas `git push` a la rama `main`
2. Hostinger detectará los cambios automáticamente
3. Reconstruirá y redesplegar la aplicación

Para actualizar tu aplicación:

```bash
# Hacer cambios en el código local
git add .
git commit -m "Descripción de los cambios"
git push origin main

# Hostinger detecta el push y redespliega automáticamente
```

### Despliegue Manual

Si necesitas forzar un redespliegue:

1. Ve a **Node.js** en hPanel
2. Selecciona tu aplicación
3. Haz clic en **Redesplegar**

---

## 🛠️ Solución de Problemas

### ❌ Error: "Build failed"

**Síntomas:** El deployment falla durante el build.

**Solución:**

1. Revisa los **Build logs** en Hostinger
2. El error más común es falta de memoria:

   ```
   FATAL ERROR: Reached heap limit
   ```

3. Si ves este error, contacta a soporte de Hostinger para aumentar la memoria asignada

**Alternativa:** Build local y commit de archivos compilados:

```bash
# En tu máquina local
npm run build

# Añade dist/ al repositorio temporalmente
git add dist/
git commit -m "Add pre-built files for Hostinger"
git push origin main
```

### ❌ Error: "Cannot connect to database"

**Síntomas:** La aplicación inicia pero muestra errores de base de datos.

**Solución:**

1. Verifica que `DATABASE_URL` esté correctamente configurada
2. Asegúrate de que incluye `?sslmode=require` al final
3. Verifica que la IP de Hostinger esté permitida en tu base de datos (si es externa)

**La aplicación usará memory store para sesiones si falla la conexión PostgreSQL** (las sesiones se perderán al reiniciar).

### ❌ Error: "Application crashed"

**Síntomas:** La aplicación se inicia pero se detiene inmediatamente.

**Diagnóstico:**

1. Revisa los **Application logs**
2. Busca errores de TypeScript o módulos Node.js
3. Verifica que todas las variables de entorno estén configuradas

**Soluciones comunes:**

- Asegúrate de que `dist/index.js` existe después del build
- Verifica que todas las dependencias de `package.json` estén instaladas
- Revisa que no haya errores de sintaxis JavaScript

### ❌ Error: "503 Service Unavailable"

**Síntomas:** La URL de Hostinger muestra error 503.

**Causas posibles:**

1. La aplicación no se inició correctamente
2. El puerto configurado no coincide (debe ser 3000)
3. El archivo de entrada es incorrecto

**Solución:**

1. Verifica que `PORT=3000` en las variables de entorno
2. Confirma que `dist/index.js` es el punto de entrada
3. Revisa los logs de la aplicación

### ❌ Los emails no se envían

**Síntomas:** El formulario de contacto o newsletter no envía emails.

**Solución:**

1. Verifica las credenciales de Brevo en las variables de entorno
2. Confirma que `SMTP_HOST=smtp-relay.brevo.com`
3. Verifica que `SMTP_PORT=587`
4. Revisa los logs para ver errores SMTP específicos

---

## 📊 Monitoreo y Mantenimiento

### Logs en Tiempo Real

Para ver los logs en tiempo real:

1. Ve a **Node.js** → Tu aplicación → **Logs**
2. Los logs se actualizan automáticamente
3. Busca mensajes de error o advertencias

### Reiniciar la Aplicación

Si necesitas reiniciar manualmente:

1. Ve a **Node.js** → Tu aplicación
2. Haz clic en **Reiniciar**
3. La aplicación se reiniciará en unos segundos

### Backup Regular

Recomendaciones:

- **Código:** Siempre en GitHub (ya cubierto)
- **Base de datos:** Configura backups automáticos en Neon o tu proveedor de PostgreSQL
- **Variables de entorno:** Guarda una copia segura local (encriptada)

---

## 🎯 Optimizaciones Recomendadas

### 1. Dominio Personalizado

Conecta tu propio dominio (ej: evaperez-wellness.com):

1. Ve a **Dominios** en hPanel
2. Apunta tu dominio a la aplicación Node.js
3. Configura SSL/TLS automático (gratuito con Hostinger)

### 2. CDN para Recursos Estáticos

Para mejorar la velocidad de carga global:

- Considera usar Cloudflare CDN (gratuito)
- Configura cache de recursos estáticos

### 3. Monitoreo Uptime

Configura monitoreo externo:

- [UptimeRobot](https://uptimerobot.com/) (gratuito)
- [Pingdom](https://www.pingdom.com/)
- Configura alertas por email si la app cae

### 4. Analytics

Añade Google Analytics para monitorear tráfico:

- Crea una cuenta en Google Analytics
- Añade el código de tracking al `index.html`

---

## 🆘 Soporte

### Soporte de Hostinger

- **Chat en vivo:** Disponible 24/7 en hPanel
- **Email:** <support@hostinger.com>
- **Documentación:** <https://support.hostinger.com/>

### Documentación Técnica

- [Node.js en Hostinger](https://support.hostinger.com/en/articles/5742149-how-to-deploy-a-node-js-application)
- [Variables de entorno](https://support.hostinger.com/en/articles/6464786-how-to-add-environment-variables-to-node-js-application)
- [Conectar GitHub](https://support.hostinger.com/en/articles/6464787-how-to-deploy-node-js-application-from-github)

---

## ✅ Checklist Final de Deployment

Antes de considerar el deployment completo, verifica:

- [x] Build exitoso en Hostinger
- [x] Aplicación accesible vía URL de Hostinger
- [x] Base de datos conectada correctamente
- [x] Emails funcionando (test de contacto/newsletter)
- [x] SSL/HTTPS activo
- [ ] Dominio personalizado configurado (opcional)
- [ ] Monitoreo uptime configurado (opcional)
- [ ] Analytics configurado (opcional)

---

## 🎉 ¡Deployment Exitoso

Tu aplicación ahora está en producción en Hostinger. Cada push a `main` se desplegará automáticamente.

**Próximos pasos recomendados:**

1. Configura tu dominio personalizado
2. Activa el monitoreo uptime
3. Realiza pruebas completas de todas las funcionalidades
4. Comparte la URL con tus usuarios

---

**¿Problemas?** Revisa la sección de Solución de Problemas o contacta al soporte de Hostinger.
