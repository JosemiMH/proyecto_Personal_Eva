const { spawn } = require('child_process');
const path = require('path');

// Pass all arguments from the command line to Vite
const args = process.argv.slice(2);

// Use npx to execute vite, which handles ESM properly
const child = spawn('npx', ['vite', ...args], {
    stdio: 'inherit',
    shell: true
});

child.on('exit', (code) => {
    process.exit(code || 0);
});
