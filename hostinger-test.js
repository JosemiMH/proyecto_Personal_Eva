// SERVIDOR ULTRA-MÍNIMO PARA HOSTINGER
// Solo para confirmar que Node.js funciona

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

console.log('');
console.log('========================================');
console.log('ULTRA-MINIMAL TEST SERVER');
console.log('========================================');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Node version:', process.version);
console.log('Port:', PORT);
console.log('========================================');
console.log('');

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Server</title>
      <style>
        body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { color: #2ecc71; }
        .info { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>✅ ¡Servidor funcionando!</h1>
      <div class="info">
        <p><strong>Port:</strong> ${PORT}</p>
        <p><strong>Node:</strong> ${process.version}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>Platform:</strong> ${process.platform}</p>
      </div>
      <p>Si ves esto, Hostinger está ejecutando Node.js correctamente.</p>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        port: PORT,
        node: process.version,
        uptime: process.uptime()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('✅ ========================================');
    console.log('✅ SERVER LISTENING SUCCESSFULLY!');
    console.log('✅ Port:', PORT);
    console.log('✅ ========================================');
    console.log('');
});

// Log any errors
app.on('error', (error) => {
    console.error('');
    console.error('❌ ========================================');
    console.error('❌ SERVER ERROR');
    console.error('❌ ========================================');
    console.error(error);
    console.error('');
});

process.on('uncaughtException', (error) => {
    console.error('');
    console.error('❌ UNCAUGHT EXCEPTION:', error);
    console.error('');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('');
    console.error('❌ UNHANDLED REJECTION:', reason);
    console.error('');
});
