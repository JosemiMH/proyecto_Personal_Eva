// Minimal test server for Hostinger diagnostics
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ Server is running! Port: ' + PORT);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        port: PORT,
        env: process.env.NODE_ENV,
        nodeVersion: process.version
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Minimal test server listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Node: ${process.version}`);
});
