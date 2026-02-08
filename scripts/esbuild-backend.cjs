const esbuild = require('esbuild');

console.log('Building backend with ESBuild WASM...');

esbuild.build({
    entryPoints: ['server/index.ts'],
    platform: 'node',
    packages: 'external',
    bundle: true,
    format: 'cjs',
    outfile: 'dist/index.cjs',
    logLevel: 'info'
}).then(() => {
    console.log('Backend build complete (CJS).');
}).catch((e) => {
    console.error('Backend build failed:', e);
    process.exit(1);
});
