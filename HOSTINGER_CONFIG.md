# Configuración Final para Hostinger

## ✅ Problemas Solucionados

1. **Error "Cannot find module 'vite'"** - Resuelto mediante imports dinámicos
2. **Build compilado exitosamente** - Carpeta dist/ creada con todos los archivos
3. **Servidor probado localmente** - Funciona correctamente en producción

---

## 📦 Pasos para Desplegar en Hostinger

### 1. Subir el Código a GitHub

Ahora que el build está funcionando, sube todos los archivos incluyendo la carpeta `dist/`:

```powershell
# En el directorio del proyecto
git add .
git commit -m "Fix: Vite imports condicionales para producción + build exitoso"
git push origin main
```

### 2. Configuración en Hostinger

Ve a tu panel de Hostinger y configura la aplicación Node.js con estos valores:

#### Configuración de la Aplicación

| Campo | Valor |
|-------|-------|
| **Preajuste del marco** | Express |
| **Versión de Node** | 22.x |
| **Rama** | main |
| **Directorio raíz** | `/` |
| **Archivo de entrada** | `dist/index.js` |
| **Gestor de paquetes** | npm |

#### Variables de Entorno Obligatorias

```bash
# Configuración básica
NODE_ENV=production
PORT=3000

# Seguridad
SESSION_SECRET=<genera-una-cadena-aleatoria-32-caracteres>
```

#### Variables de Entorno Opcionales (Base de Datos)

Si quieres usar base de datos PostgreSQL (recomendado):

```bash
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database?sslmode=require
```

#### Variables de Entorno Opcionales (Email)

Si quieres habilitar el envío de emails con Brevo:

```bash
EMAIL_USER=tu-usuario@smtp-brevo.com
EMAIL_PASS=tu-api-key
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM=eva@evaperez-wellness.com
```

#### Variables de Entorno Opcionales (OpenAI)

Si quieres habilitar el chatbot con IA:

```bash
OPENAI_API_KEY=sk-proj-...
```

### 3. Generar SESSION_SECRET Seguro

Ejecuta este comando en PowerShell para generar una clave segura:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo como valor de `SESSION_SECRET`.

### 4. Desplegar

1. En Hostinger, haz clic en **Guardar**
2. La aplicación se desplegará automáticamente desde GitHub
3. El proceso tardará 2-3 minutos
4. Hostinger ejecutará:
   - `npm install --production` (solo dependencias de producción)
   - `npm start` (ejecutará `node dist/index.js`)

### 5. Verificar Deployment

Una vez completado:

1. Accede a la URL proporcionada por Hostinger (ej: `https://tu-app.hostinger.com`)
2. Verifica que la página carga correctamente
3. Revisa los **Application Logs** en el panel de Hostinger
4. Deberías ver:

   ```
   🚀 PersonalBrandSpa MINIMAL VERSION
   ✅ SERVER STARTED SUCCESSFULLY!
   ✅ Port: 3000
   ```

---

## 🔧 Troubleshooting

### Si ves error en los logs

#### Error: "Cannot find dist/index.js"

- **Causa**: El directorio dist/ no se subió a GitHub
- **Solución**: Verifica que dist/ NO está en .gitignore y haz push de nuevo

#### Error: "Port already in use"

- **Causa**: Configuración incorrecta de PORT
- **Solución**: Verifica que `PORT=3000` en variables de entorno

#### Error: "Cannot find module 'X'"

- **Causa**: Dependencia no instalada
- **Solución**: Asegúrate de que la dependencia está en `dependencies` (no en `devDependencies`) en package.json

#### La aplicación carga pero no se ven imágenes

- **Causa**: Archivos estáticos no se están sirviendo
- **Solución**: Verifica que dist/public contiene la carpeta assets e index.html

### Revisar Logs

Para ver qué está pasando:

1. Panel de Hostinger → **Node.js**
2. Click en tu aplicación
3. Pestaña **Logs**
4. Revisa tanto **Build Logs** como **Application Logs**

---

## ✨ Funcionalidades

### Funcionando en Versión Minimal

✅ Interfaz completa (Home, About, Services, Portfolio, Blog, Contact, etc.)
✅ Navegación y routing
✅ Formularios (Contact, Newsletter, Booking)
✅ Recursos estáticos (imágenes, CSS, JavaScript)

### Requiere Configuración de Variables de Entorno

⚠️ Base de datos (se usa memoria temporal sin DATABASE_URL)
⚠️ Envío de emails (se loguea en consola sin credenciales SMTP)
⚠️ Chatbot con IA (desactivado sin OPENAI_API_KEY)

---

## 🎯 Siguiente Paso Recomendado

Una vez que la aplicación funcione en Hostinger con la configuración básica:

1. **Añadir base de datos PostgreSQL** (ej: [Neon](https://neon.tech/) - gratuito)
2. **Configurar email con Brevo** (300 emails/día gratis)
3. **Opcional: Configurar dominio personalizado** (ej: evaperez-wellness.com)

---

## 📝 Comandos de Desarrollo Local

Para desarrollo futuro:

```powershell
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Probar build en local
$env:NODE_ENV='production'; npm start

# Limpiar build anterior
npm run clean
```

---

## ✅ Checklist Final

Antes de considerar el deployment exitoso:

- [ ] Código subido a GitHub (incluyendo dist/)
- [ ] Configuración de Node.js creada en Hostinger
- [ ] Variables de entorno configuradas (mínimo NODE_ENV, PORT, SESSION_SECRET)
- [ ] Deployment completado sin errores
- [ ] URL de Hostinger accesible
- [ ] Logs muestran "SERVER STARTED SUCCESSFULLY"
- [ ] Página home carga correctamente
- [ ] Imágenes y estilos se muestran

---

**¿Problemas?** Revisa los Application Logs en Hostinger o contacta soporte.
