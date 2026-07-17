import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const prerenderDir = path.join(root, "dist", "prerender");
const publicDir = path.join(root, "dist", "public");

const [manifest, articles, sitemap] = await Promise.all([
  fs.readFile(path.join(prerenderDir, "manifest.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(prerenderDir, "articles.json"), "utf8").then(JSON.parse),
  fs.readFile(path.join(publicDir, "sitemap.xml"), "utf8"),
]);

const validArticles = articles.filter((article) => article?.slug && /^[a-z0-9-]+$/i.test(article.slug));
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

assert.equal(sitemapUrls.length, validArticles.length + 7, "El sitemap debe contener 7 páginas estáticas y todos los artículos");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "El sitemap no debe contener URLs duplicadas");
assert.ok(sitemapUrls.includes("https://www.epmwellness.com/auditoria-spa-hoteles"), "Falta la landing SEM en el sitemap");
for (const article of validArticles) {
  assert.ok(
    sitemapUrls.includes(`https://www.epmwellness.com/blog/${article.slug}`),
    `Falta el artículo ${article.slug} en el sitemap`,
  );
}

const staticPages = {
  "/": "https://www.epmwellness.com/",
  "/privacy": "https://www.epmwellness.com/privacy",
  "/terms": "https://www.epmwellness.com/terms",
  "/cookies": "https://www.epmwellness.com/cookies",
  "/booking": "https://www.epmwellness.com/booking",
  "/resources": "https://www.epmwellness.com/resources",
  "/auditoria-spa-hoteles": "https://www.epmwellness.com/auditoria-spa-hoteles",
};

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

for (const [route, canonical] of Object.entries(staticPages)) {
  const filename = manifest.routes[route];
  assert.ok(filename, `Falta ${route} en el manifiesto prerenderizado`);
  const html = await fs.readFile(path.join(prerenderDir, filename), "utf8");
  assert.equal(count(html, /<h1(?:\s|>)/gi), 1, `${route} debe tener un único H1`);
  assert.equal(count(html, /<title(?:\s|>)[\s\S]*?<\/title>/gi), 1, `${route} debe tener un único title`);
  assert.equal(count(html, /<link[^>]+rel="canonical"[^>]*>/gi), 1, `${route} debe tener un único canonical`);
  assert.ok(html.includes(`href="${canonical}"`), `Canonical incorrecto en ${route}`);
  assert.match(html, /<meta[^>]+name="description"[^>]+content="[^"]+"[^>]*>/i, `Falta description en ${route}`);
}

assert.ok(validArticles.length > 0, "Debe existir al menos un artículo para validar");
const sample = validArticles[0];
const sampleFilename = manifest.blogs[sample.slug];
assert.ok(sampleFilename, "El artículo de muestra no aparece en el manifiesto");
const articleHtml = await fs.readFile(path.join(prerenderDir, sampleFilename), "utf8");

assert.equal(count(articleHtml, /<h1(?:\s|>)/gi), 1, "El artículo debe tener un único H1");
assert.match(articleHtml, /<time[^>]+dateTime="[^"]+"/i, "El artículo debe usar un elemento time con fecha legible por máquinas");
assert.match(articleHtml, /<a[^>]+rel="author"[^>]*>/i, "El artículo debe enlazar a su autora con rel=author");

const jsonLdBlocks = [...articleHtml.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1].trim())
  .map((value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const blogPosting = jsonLdBlocks.find((block) => block["@type"] === "BlogPosting");
assert.ok(blogPosting, "El artículo debe incluir JSON-LD BlogPosting válido");
assert.equal(blogPosting.headline, sample.title, "El headline estructurado debe coincidir con el artículo");
assert.ok(blogPosting.dateModified, "BlogPosting debe incluir dateModified");
assert.ok(blogPosting.mainEntityOfPage, "BlogPosting debe incluir mainEntityOfPage");
assert.equal(
  blogPosting.publishingPrinciples,
  "https://www.epmwellness.com/terms#uso-inteligencia-artificial",
  "BlogPosting debe enlazar la política editorial y de transparencia de IA",
);

const termsHtml = await fs.readFile(path.join(prerenderDir, manifest.routes["/terms"]), "utf8");
assert.match(termsHtml, /id="uso-inteligencia-artificial"/i, "Falta el apartado de transparencia de IA");

const privacyHtml = await fs.readFile(path.join(prerenderDir, manifest.routes["/privacy"]), "utf8");
assert.match(privacyHtml, /id="asistente-virtual-ia"/i, "Falta la información de privacidad del asistente de IA");

const relatedLinks = [...articleHtml.matchAll(/href="\/blog\/([^"]+)"/g)]
  .map((match) => match[1])
  .filter((slug) => slug !== sample.slug);
assert.ok(new Set(relatedLinks).size >= 3, "El artículo debe mostrar al menos tres enlaces internos relacionados");

const notFoundHtml = await fs.readFile(path.join(prerenderDir, manifest.notFound), "utf8");
assert.match(notFoundHtml, /name="robots" content="noindex,nofollow"/i, "La página 404 debe ser noindex");
assert.equal(count(notFoundHtml, /<link[^>]+rel="canonical"[^>]*>/gi), 0, "La página 404 no debe tener canonical");

console.log(`SEO smoke test passed: ${sitemapUrls.length} sitemap URLs, ${validArticles.length} articles, landing and static metadata verified.`);
