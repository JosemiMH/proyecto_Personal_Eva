const esbuild = require('esbuild-wasm');

console.log('Building backend with ESBuild WASM...');

esbuild.build({
    entryPoints: ['server/index.ts'],
    platform: 'node',
    packages: 'external',
    bundle: true,
    format: 'esm',
    outdir: 'dist',
    logLevel: 'info'
}).then(() => {
    console.log('Backend build complete.');
}).catch((e) => {
    console.error('Backend build failed:', e);
    process.exit(1);
});
