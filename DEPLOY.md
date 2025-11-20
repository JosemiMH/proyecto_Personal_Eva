# Guía de Despliegue - Marca Personal Eva Pérez

Esta aplicación está lista para ser desplegada. La opción más sencilla y compatible para esta tecnología (Node.js + PostgreSQL) es **Render**.

## Requisitos Previos

1.  Una cuenta en [GitHub](https://github.com/).
2.  Una cuenta en [Render](https://render.com/).

## Paso 1: Subir el código a GitHub

1.  Crea un **nuevo repositorio** en GitHub (puedes llamarlo `marca-personal-eva`).
2.  No inicialices el repositorio con README, .gitignore ni licencia (déjalo vacío).
3.  Ejecuta los siguientes comandos en tu terminal (dentro de la carpeta del proyecto):

```bash
git remote add origin https://github.com/TU_USUARIO/marca-personal-eva.git
git branch -M main
git push -u origin main
```
*(Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub)*

## Paso 2: Crear el servicio en Render

1.  Entra a tu dashboard de [Render](https://dashboard.render.com/).
2.  Haz clic en **"New +"** y selecciona **"Web Service"**.
3.  Conecta tu cuenta de GitHub y selecciona el repositorio `marca-personal-eva`.
4.  Configura el servicio con los siguientes datos:
    *   **Name:** `marca-personal-eva` (o lo que prefieras)
    *   **Region:** Frankfurt (EU Central) - *para estar cerca de tu base de datos Neon*
    *   **Branch:** `main`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm run start`

## Paso 3: Configurar Variables de Entorno

En la misma pantalla de creación (o en la pestaña "Environment" después), añade las siguientes variables:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_KmnsDTAe3d4o@ep-divine-field-agqlxdgy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | *(Opcional) Tu clave de API de OpenAI si quieres activar el chat* |

## Paso 4: Finalizar

1.  Haz clic en **"Create Web Service"**.
2.  Render comenzará a construir y desplegar tu aplicación.
3.  En unos minutos, te dará una URL (ej. `https://marca-personal-eva.onrender.com`) donde tu aplicación estará pública en internet.
