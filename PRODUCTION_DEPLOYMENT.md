# Despliegue seguro a producción

## Configuración actual

- Proveedor: Hostinger, aplicación Node.js/Express.
- Repositorio: `JosemiMH/proyecto_Personal_Eva`.
- Rama de producción: `main`.
- Node.js: 22.x.
- Directorio raíz: `./`.
- Entrada: `dist/index.js`.
- Inicio: `npm start`.
- Hostinger redespliega automáticamente al actualizar `main`.

## Variables obligatorias en Hostinger

Configura los valores reales únicamente en **Hostinger → Variables de entorno**. No los añadas a GitHub, archivos `.env`, documentación, capturas ni mensajes.

- `NODE_ENV=production`
- `PORT=3000`
- `SESSION_SECRET` con un valor aleatorio de 64 caracteres o más.
- `DATABASE_URL` con la conexión PostgreSQL de producción.
- `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT` y `SMTP_SECURE`.
- `OPENAI_API_KEY` solo si el chatbot debe estar activo.

Todas las credenciales que hayan aparecido alguna vez en el repositorio deben revocarse y sustituirse antes del siguiente despliegue.

## Flujo de publicación

1. Crear una rama `agent/<cambio>` desde `main`.
2. Aplicar el cambio y regenerar `dist` con `npm run build`.
3. Ejecutar `npm run test:secrets`, `npm run check`, `npm run test:seo` y `npm run test:http`.
4. Abrir una pull request hacia `main` y esperar a que pase **Production readiness**.
5. Revisar el alcance y obtener autorización expresa para producción.
6. Fusionar la pull request en `main`; Hostinger iniciará el despliegue automático.
7. Confirmar el despliegue en Hostinger y verificar `/health`, la portada y las funciones afectadas.

## Recuperación

Si la verificación posterior falla, vuelve a desplegar el último commit estable desde Hostinger. No reescribas el historial de `main` ni fuerces referencias.
