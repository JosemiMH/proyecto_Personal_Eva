const esbuild = require('esbuild');

console.log('Building backend with ESBuild...');

esbuild.build({
    entryPoints: ['server/index.ts'],
    packages: 'external',
    bundle: true,
    format: 'cjs',
    outfile: 'dist/index.cjs',
    logLevel: 'info',
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production'
}).then(() => {
    console.log('Backend build complete - dist/index.cjs created');
}).catch((e) => {
    console.error('Backend build failed:', e);
    process.exit(1);
});
