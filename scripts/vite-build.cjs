const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("Current working directory:", process.cwd());
console.log("Directory listing of .:", fs.readdirSync('.'));
try {
    console.log("Directory listing of node_modules:", fs.readdirSync('node_modules').slice(0, 10));
} catch (e) {
    console.log("Could not list node_modules:", e.message);
}

// Try to find vite package.json to locate the binary
let viteBinPath;
try {
    const vitePkgPath = require.resolve('vite/package.json');
    console.log("Resolved vite package.json at:", vitePkgPath);
    const viteRoot = path.dirname(vitePkgPath);
    viteBinPath = path.join(viteRoot, 'bin/vite.js');
} catch (e) {
    console.error('require.resolve("vite/package.json") failed:', e.message);

    // Fallback search
    const candidates = [
        'node_modules/vite/bin/vite.js',
        '../node_modules/vite/bin/vite.js',
        '/home/u919982339/domains/epmwellness.com/public_html/node_modules/vite/bin/vite.js' // Absolute path guess
    ];

    for (const c of candidates) {
        const p = path.resolve(c);
        console.log(`Checking candidate: ${p}`);
        if (fs.existsSync(p)) {
            viteBinPath = p;
            break;
        }
    }
}

if (!viteBinPath || !fs.existsSync(viteBinPath)) {
    console.error("CRITICAL: Cannot find vite/bin/vite.js");
    // List node_modules to see what IS there
    if (fs.existsSync('node_modules')) {
        console.log("Modules in node_modules starting with v:", fs.readdirSync('node_modules').filter(f => f.startsWith('v')));
    }
    process.exit(1);
}

console.log(`Using Vite at: ${viteBinPath}`);

// Pass all arguments from the command line to Vite
const args = process.argv.slice(2);

const child = fork(viteBinPath, args, { stdio: 'inherit' });

child.on('exit', (code) => {
    process.exit(code || 0);
});
