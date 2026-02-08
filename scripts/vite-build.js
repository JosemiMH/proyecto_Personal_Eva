const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

// Dynamically resolve vite's binary JS file
// This walks up the directory tree to find node_modules/vite, handling Hostinger's nested structure
let viteBinPath;
try {
    viteBinPath = require.resolve('vite/bin/vite.js');
} catch (e) {
    console.error('Initial resolve failed, trying manual paths...');
    // Fallback for weird structures
    const potentialPaths = [
        path.resolve(__dirname, '../node_modules/vite/bin/vite.js'),
        path.resolve(__dirname, '../../node_modules/vite/bin/vite.js'),
        path.resolve(process.cwd(), 'node_modules/vite/bin/vite.js')
    ];

    for (const p of potentialPaths) {
        if (fs.existsSync(p)) {
            viteBinPath = p;
            break;
        }
    }
}

if (!viteBinPath) {
    console.error("CRITICAL: Cannot find vite/bin/vite.js");
    process.exit(1);
}

console.log(`Using Vite at: ${viteBinPath}`);

// Pass all arguments from the command line to Vite
// process.argv[2] onwards are the args passed to this script
const args = process.argv.slice(2);

const child = fork(viteBinPath, args, { stdio: 'inherit' });

child.on('exit', (code) => {
    process.exit(code || 0);
});
