const esbuild = require('esbuild');

console.log('Building backend with ESBuild API...');

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
}).catch(() => {
    console.error('Backend build failed.');
    process.exit(1);
});
