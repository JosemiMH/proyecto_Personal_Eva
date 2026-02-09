/**
 * Ultra-minimal server - absolutely no complications
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

console.log('');
console.log('═══════════════════════════════════');
console.log('🎯 ULTRA-MINIMAL SERVER v2');
console.log('═══════════════════════════════════');
console.log(`Port: ${PORT}`);
console.log(`Node: ${process.version}`);
console.log(`Env: ${process.env.NODE_ENV || 'development'}`);
console.log('═══════════════════════════════════');
console.log('');

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos si existen
const publicPath = path.join(__dirname, 'public');
console.log(`📁 Serving static from: ${publicPath}`);
app.use(express.static(publicPath));

// Rutas de test
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        port: PORT,
        node: process.version,
        uptime: process.uptime(),
        env: process.env.NODE_ENV
    });
});

app.get('*', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PersonalBrandSpa - Running!</title>
      <style>
        body  { 
          font-family: system-ui, -apple-system, sans-serif; 
          margin: 0; 
          padding: 40px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { 
          background: rgba(255,255,255,0.1); 
          backdrop-filter: blur(10px);
          padding: 40px; 
          border-radius: 20px; 
          max-width: 600px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { 
          color: #fff; 
          margin: 0 0 20px 0;
          font-size: 2.5em;
        }
        .info { 
          background: rgba(255,255,255,0.15); 
          padding: 20px; 
          border-radius: 10px; 
          margin: 15px 0;
          backdrop-filter: blur(5px);
        }
        .success { color: #4ade80; font-weight: bold; }
        code { 
          background: rgba(0,0,0,0.3); 
          padding: 2px 8px; 
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ ¡Servidor Funcionando!</h1>
        <div class="info">
          <p><strong>Status:</strong> <span class="success">ONLINE</span></p>
          <p><strong>Puerto:</strong> <code>${PORT}</code></p>
          <p><strong>Node.js:</strong> <code>${process.version}</code></p>
          <p><strong>Entorno:</strong> <code>${process.env.NODE_ENV || 'development'}</code></p>
          <p><strong>Plataforma:</strong> <code>${process.platform}</code></p>
          <p><strong>Uptime:</strong> <code>${Math.floor(process.uptime())}s</code></p>
        </div>
        <div class="info">
          <p>✅ Si ves esto, el servidor está <strong>corriendo correctamente</strong> en Hostinger</p>
          <p>✅ El deployment funcionó</p>
          <p>✅ Ahora podemos activar gradualmente el resto de funcionalidad</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('✅ ═══════════════════════════════════');
    console.log('✅  SERVER LISTENING SUCCESSFULLY!');
    console.log(`✅  http://localhost:${PORT}`);
    console.log('✅ ═══════════════════════════════════');
    console.log('');
});

// Error handlers
process.on('uncaughtException', (err) => {
    console.error('');
    console.error('❌ Uncaught Exception:', err);
    console.error('');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('');
    console.error('❌ Unhandled Rejection:', reason);
    console.error('');
});
