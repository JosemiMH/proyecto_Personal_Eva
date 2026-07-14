import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "dist", "public");
const serverEntry = path.join(projectRoot, "dist", "server", "entry-server.mjs");
const outputDir = path.join(projectRoot, "dist", "prerender");
const articlesSnapshot = path.join(outputDir, "articles.json");
const articlesUrl = process.env.PRERENDER_ARTICLES_URL
  || "https://www.epmwellness.com/api/articles";

const staticRoutes = {
  "/": "home.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
  "/cookies": "cookies.html",
  "/booking": "booking.html",
  "/resources": "resources.html",
};

function serializeForInlineScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function applyHelmet(template, helmetContext) {
  const helmet = helmetContext?.helmet;
  if (!helmet) return template;

  const headMarkup = [
    helmet.title?.toString?.(),
    helmet.meta?.toString?.(),
    helmet.link?.toString?.(),
    helmet.script?.toString?.(),
    helmet.style?.toString?.(),
    helmet.noscript?.toString?.(),
  ].filter(Boolean).join("\n");

  let html = template;
  if (headMarkup) {
    html = html
      .replace(/<title\b[^>]*\bdata-rh="true"[^>]*>[\s\S]*?<\/title>\s*/gi, "")
      .replace(/<meta\b[^>]*\bdata-rh="true"[^>]*\/?>(?:\s*)/gi, "")
      .replace(/<link\b[^>]*\bdata-rh="true"[^>]*\/?>(?:\s*)/gi, "");
  }

  const htmlAttributes = helmet.htmlAttributes?.toString?.() || "";
  if (htmlAttributes) {
    html = html.replace(/<html\b[^>]*>/i, `<html ${htmlAttributes}>`);
  }

  return headMarkup
    ? html.replace("</head>", `${headMarkup}\n</head>`)
    : html;
}

function renderDocument(template, rendered, initialData) {
  let html = template.replace(
    /<div id="root">([\s\S]*?)<\/div>/,
    `<div id="root">${rendered.html}</div>`,
  );

  html = applyHelmet(html, rendered.helmetContext);

  if (Object.keys(initialData).length > 0) {
    const dataScript = `<script id="__INITIAL_QUERY_DATA__">window.__INITIAL_QUERY_DATA__=${serializeForInlineScript(initialData)};</script>`;
    html = html.replace("</head>", `${dataScript}\n</head>`);
  }

  return html;
}

async function loadArticles() {
  try {
    const response = await fetch(articlesUrl, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`Article API returned ${response.status}`);
    }

    const articles = await response.json();
    if (!Array.isArray(articles)) {
      throw new Error("Article API did not return an array");
    }
    return articles;
  } catch (error) {
    try {
      const fallback = JSON.parse(await fs.readFile(articlesSnapshot, "utf8"));
      if (Array.isArray(fallback)) {
        console.warn(`Using the previous article snapshot: ${error.message}`);
        return fallback;
      }
    } catch {
      // The original fetch error below is more useful than the fallback error.
    }
    throw error;
  }
}

async function writePage(relativePath, html) {
  const destination = path.join(outputDir, relativePath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, html, "utf8");
}

await fs.mkdir(outputDir, { recursive: true });

const [template, rendererModule, articles] = await Promise.all([
  fs.readFile(path.join(publicDir, "index.html"), "utf8"),
  import(serverEntry),
  loadArticles(),
]);

const { render } = rendererModule;
const blogRoutes = {};

for (const [route, filename] of Object.entries(staticRoutes)) {
  const initialData = route === "/" ? { articles } : {};
  const rendered = await render(route, initialData);
  await writePage(filename, renderDocument(template, rendered, initialData));
}

for (const article of articles) {
  if (!article?.slug || !/^[a-z0-9-]+$/i.test(article.slug)) {
    console.warn(`Skipping an invalid article slug: ${article?.slug}`);
    continue;
  }

  const route = `/blog/${article.slug}`;
  const filename = `blog/${article.slug}.html`;
  const initialData = { article, articleSlug: article.slug };
  const rendered = await render(route, initialData);
  await writePage(filename, renderDocument(template, rendered, initialData));
  blogRoutes[article.slug] = filename;
}

const notFound = await render("/__not_found__", {});
await writePage("404.html", renderDocument(template, notFound, {}));
await fs.writeFile(articlesSnapshot, `${JSON.stringify(articles, null, 2)}\n`, "utf8");
await fs.writeFile(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify({ routes: staticRoutes, blogs: blogRoutes, notFound: "404.html" }, null, 2)}\n`,
  "utf8",
);

console.log(`Prerendered ${Object.keys(staticRoutes).length} pages, ${Object.keys(blogRoutes).length} articles, and the 404 page.`);
