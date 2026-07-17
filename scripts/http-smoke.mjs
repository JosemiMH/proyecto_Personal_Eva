import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const port = 5010;
const origin = `http://localhost:${port}`;
const root = process.cwd();
const manifest = JSON.parse(await fs.readFile(path.join(root, "dist", "prerender", "manifest.json"), "utf8"));
const sampleSlug = Object.keys(manifest.blogs)[0];
assert.ok(sampleSlug, "Debe existir un artículo prerenderizado");

const output = [];
const server = spawn(process.execPath, ["dist/index.js"], {
  cwd: root,
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(port),
    SESSION_SECRET: "seo-http-smoke-test-only",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", (chunk) => output.push(chunk.toString()));
server.stderr.on("data", (chunk) => output.push(chunk.toString()));

async function waitUntilReady() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`El servidor terminó antes de arrancar:\n${output.join("")}`);
    }
    try {
      const response = await fetch(`${origin}/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`El servidor no arrancó a tiempo:\n${output.join("")}`);
}

function h1Count(html) {
  return [...html.matchAll(/<h1(?:\s|>)/gi)].length;
}

try {
  await waitUntilReady();

  const landingResponse = await fetch(`${origin}/auditoria-spa-hoteles`);
  const landingHtml = await landingResponse.text();
  assert.equal(landingResponse.status, 200, "La landing debe responder 200");
  assert.equal(h1Count(landingHtml), 1, "La landing debe tener un único H1");
  assert.ok(landingHtml.includes('href="https://www.epmwellness.com/auditoria-spa-hoteles"'), "Canonical de landing incorrecto");

  const articleResponse = await fetch(`${origin}/blog/${sampleSlug}`);
  const articleHtml = await articleResponse.text();
  assert.equal(articleResponse.status, 200, "El artículo debe responder 200");
  assert.equal(h1Count(articleHtml), 1, "El artículo debe tener un único H1");
  assert.match(articleHtml, /"@type":"BlogPosting"/, "El artículo debe contener BlogPosting");

  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200, "El sitemap debe responder 200");
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, Object.keys(manifest.blogs).length + 7, "Número inesperado de URLs en sitemap");

  const missingResponse = await fetch(`${origin}/ruta-que-no-existe`);
  const missingHtml = await missingResponse.text();
  assert.equal(missingResponse.status, 404, "Una ruta desconocida debe responder 404");
  assert.match(missingHtml, /name="robots" content="noindex,nofollow"/i, "La 404 debe ser noindex");
  assert.doesNotMatch(missingHtml, /<link[^>]+rel="canonical"/i, "La 404 no debe tener canonical");

  const privateResponse = await fetch(`${origin}/api/appointments`);
  assert.equal(privateResponse.status, 401, "La lista de citas debe requerir autenticación");

  const consentResponse = await fetch(`${origin}/api/newsletter`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "seo-smoke@example.com" }),
  });
  assert.equal(consentResponse.status, 400, "Newsletter debe rechazar peticiones sin consentimiento de privacidad");

  console.log("HTTP smoke test passed: landing, article, sitemap, 404, API security and consent verified.");
} finally {
  server.kill("SIGTERM");
  await new Promise((resolve) => {
    if (server.exitCode !== null) return resolve();
    server.once("exit", resolve);
    setTimeout(() => {
      server.kill("SIGKILL");
      resolve();
    }, 3_000).unref();
  });
}
