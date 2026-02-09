const esbuild = require('esbuild');

console.log('Building backend with ESBuild WASM...');

esbuild.build({
    entryPoints: ['server/index.ts'],
    platform: 'node',
    packages: 'external',
    bundle: true,
    format: 'cjs',
    outfile: 'dist/index.js',
    logLevel: 'info',
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production'
}).then(() => {
    console.log('Backend build complete - dist/index.js created');
}).catch((e) => {
    console.error('Backend build failed:', e);
    process.exit(1);
});
