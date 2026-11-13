#!/usr/bin/env node
/**
 * Generates static, indexable product and category pages plus sitemap.xml
 * from shared/products.js. Does not change prices, names or descriptions.
 * Run from the site root: node scripts/generate-seo-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://beautyplug.tienda";
const LASTMOD = new Date().toISOString().slice(0, 10);

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "shared/products.js"), "utf8"), ctx);
const CFG = ctx.window.BP_CONFIG;
const PRODUCTS = ctx.window.BP_PRODUCTS;
const CATS = ctx.window.BP_CATEGORIES;

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
function escAttr(s) { return esc(s); }
function fullName(p) { return p.name + (p.variant && !p.kit ? " – " + p.variant : ""); }
function fmt(n) { return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
function productUrl(p) { return `/producto/${p.id}/`; }
function catUrl(id) { return `/categoria/${id}/`; }
function abs(u) { return ORIGIN + u; }
function imgAbs(file) { return `${ORIGIN}/images/${file}`; }
function catOf(p) { return p.kit ? "kits" : p.cat; }
function catLabel(id) {
  const c = CATS.find((x) => x.id === id);
  return c ? c.label : id;
}
function productsInCat(id) {
  return PRODUCTS.filter((p) => (id === "kits" ? !!p.kit : p.cat === id && !p.kit));
}
function trunc(s, n) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > 40 ? cut.slice(0, sp) : cut).trim() + "…";
}
function productTitle(p) {
  const core = [p.brand, fullName(p)].filter(Boolean).join(" ");
  return `${core} | Beauty Plug Bogotá`;
}
function productMeta(p) {
  const head = `${p.brand} ${fullName(p)} original en Bogotá. ${p.desc}`.replace(/\s+/g, " ").trim();
  const size = p.size ? ` ${p.size}.` : "";
  const tail = " Pídelo por WhatsApp. Envío a toda Colombia.";
  if ((head + size + tail).length <= 160) return head + size + tail;
  if ((head + tail).length <= 160) return head + tail;
  return trunc(head, 160 - tail.length) + tail;
}
function jsonLd(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Cormorant+Garamond:ital,wght@0,600;1,500;1,600&family=DM+Sans:wght@400;500;700&family=Allura&display=swap" rel="stylesheet">`;

function head({ title, description, url, image, type, jsonld }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(description)}">
<meta name="theme-color" content="#faf4ee">
<link rel="icon" type="image/png" sizes="32x32" href="/images/brand/bp-favicon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="/images/brand/bp-icon-512.png">
<link rel="apple-touch-icon" sizes="180x180" href="/images/brand/bp-apple-touch-icon-180.png">
<link rel="canonical" href="${escAttr(url)}">
<meta property="og:type" content="${escAttr(type || "website")}">
<meta property="og:locale" content="es_CO">
<meta property="og:site_name" content="The Beauty Plug Collective">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(description)}">
<meta property="og:image" content="${escAttr(image)}">
<meta property="og:url" content="${escAttr(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(description)}">
${FONTS}
<link rel="stylesheet" href="/shared/base.css">
<link rel="stylesheet" href="/shared/theme.css">
<link rel="stylesheet" href="/shared/product-page.css">
${jsonld}
</head>`;
}

function chromeNav() {
  return `<div class="announce">Envíos a <b>toda Colombia</b><span class="sep">•</span>Pide por <b>WhatsApp</b></div>
<header class="nav"><div class="wrap">
  <a class="brand" href="/"><img class="mark" src="/images/brand/bp-mark.webp" alt="The Beauty Plug Collective" width="38" height="56"><span>Beauty Plug<small>COLLECTIVE</small></span></a>
  <div class="nav-right"><div data-social></div><button class="navcart" data-open-cart aria-label="Ver carrito"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>Carrito <i data-cart-count class="is-zero">0</i></button></div>
</div></header>`;
}

function chromeFooter() {
  const catLinks = CATS.filter((c) => c.id !== "todos")
    .map((c) => `<a href="${catUrl(c.id)}">${esc(c.label)}</a>`)
    .join('<span class="sep" aria-hidden="true"> · </span>');
  return `<footer>
  <img class="flogo" src="/images/brand/bp-logo-full-light.webp" alt="The Beauty Plug Collective" width="640" height="575">
  <p class="script">Más que belleza, es confianza</p>
  <div class="links" data-social></div>
  <p class="fnav fnav-cats">${catLinks}</p>
  <p class="fnav"><a href="/#pagos">Métodos de pago</a><span aria-hidden="true"> · </span><a href="/#catalogo">Catálogo</a></p>
  <p style="margin:0 0 14px;font-size:14px">WhatsApp 311 546 1244 · @tiendabeautyplug</p>
  <small>© 2026 The Beauty Plug Collective · Bogotá, Colombia</small>
</footer>
<script src="/shared/products.js"></script>
<script src="/shared/store.js"></script>
<script>BP.init({layout:"rows",addLabel:"Agregar"});</script>
</body>
</html>`;
}

function cardHtml(p, i) {
  const name = fullName(p);
  const href = productUrl(p);
  const variant = p.variant
    ? `<p class="bp-variant">${esc(p.variant)}${p.size && !p.kit ? " · " + esc(p.size) : ""}</p>`
    : (p.size ? `<p class="bp-variant">${esc(p.size)}</p>` : "");
  return `<article class="bp-card${p.kit ? " is-kit" : ""}" data-id="${esc(p.id)}" style="--i:${i % 12}">` +
    `<div class="bp-media"><a href="${href}"><img src="/images/${esc(p.img)}" alt="${escAttr(p.brand + " " + name)}" width="480" height="600"></a>` +
    (p.kit ? '<span class="bp-badge">Kit completo</span>' : "") +
    `</div><div class="bp-info"><p class="bp-brand">${esc(p.brand)}</p><h3 class="bp-name"><a href="${href}">${esc(p.name)}</a></h3>` +
    variant +
    `<p class="bp-desc">${esc(p.desc)}</p>` +
    `<div class="bp-row"><span class="bp-price">${fmt(p.price)}</span><span class="bp-ctrl" data-ctrl="${esc(p.id)}"><button class="bp-add" data-add="${esc(p.id)}" aria-label="Agregar ${escAttr(name)}"><span>Agregar</span></button></span></div></div></article>`;
}

const CAT_INTRO = {
  cuerpo: "Lociones, cremas batidas y splashes originales de Victoria's Secret. Tienda de belleza en Bogotá, con envío a toda Colombia.",
  skincare: "Skincare original en Bogotá: Beauty Creations, Anua y más. Arma tu pedido y confírmalo por WhatsApp, con envío a toda Colombia.",
  maquillaje: "Maquillaje importado original en Bogotá: Haus Labs, Morphe, MIK, Beauty Creations, Kara Beauty y más. Pide por WhatsApp.",
  kits: "Kits de skincare originales en Bogotá. Rutinas completas de Beauty Creations para pedir por WhatsApp, con envío a toda Colombia.",
  otros: "Otros productos de The Beauty Plug Collective, tienda de belleza en Bogotá. Pide por WhatsApp, con envío a toda Colombia.",
};

const CAT_TITLE = {
  cuerpo: "Cuerpo y fragancias originales en Bogotá | Beauty Plug",
  skincare: "Skincare original en Bogotá | Beauty Plug",
  maquillaje: "Maquillaje importado original en Bogotá | Beauty Plug",
  kits: "Kits de skincare originales en Bogotá | Beauty Plug",
  otros: "Otros productos | Beauty Plug Bogotá",
};

function writeFile(rel, html) {
  const dest = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}

function relatedOf(p) {
  const cat = catOf(p);
  return productsInCat(cat).filter((x) => x.id !== p.id).slice(0, 4);
}

function productJsonLd(p) {
  const name = `${p.brand} ${fullName(p)}`.trim();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: [imgAbs(p.img)],
    description: p.desc,
    brand: { "@type": "Brand", "name": p.brand },
    sku: p.id,
    offers: {
      "@type": "Offer",
      url: abs(productUrl(p)),
      priceCurrency: "COP",
      price: String(p.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: CFG.STORE_NAME, url: ORIGIN + "/" },
    },
  };
}

function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function productPage(p) {
  const title = productTitle(p);
  const description = productMeta(p);
  const url = abs(productUrl(p));
  const image = imgAbs(p.img);
  const cat = catOf(p);
  const name = fullName(p);
  const related = relatedOf(p);
  const crumbs = [
    { name: "Inicio", url: ORIGIN + "/" },
    { name: catLabel(cat), url: abs(catUrl(cat)) },
    { name: name, url },
  ];
  const variantLine = p.variant
    ? `${esc(p.variant)}${p.size ? " · " + esc(p.size) : ""}`
    : (p.size ? esc(p.size) : "");
  const html = `${head({
    title, description, url, image, type: "product",
    jsonld: jsonLd(productJsonLd(p)) + "\n" + jsonLd(breadcrumbJsonLd(crumbs)),
  })}
<body>
${chromeNav()}
<main class="pdp"><div class="wrap">
  <nav class="pdp-crumb" aria-label="Miga de pan"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="${catUrl(cat)}">${esc(catLabel(cat))}</a><span aria-hidden="true">/</span>${esc(name)}</nav>
  <div class="pdp-grid">
    <div class="pdp-media">${p.kit ? '<span class="pdp-badge">Kit completo</span>' : ""}<img src="/images/${esc(p.img)}" alt="${escAttr(p.brand + " " + name)}" width="800" height="800"></div>
    <div class="pdp-info">
      <p class="pdp-brand">${esc(p.brand)}</p>
      <h1>${esc(p.name)}</h1>
      ${variantLine ? `<p class="pdp-variant">${variantLine}</p>` : ""}
      <p class="pdp-desc">${esc(p.desc)}</p>
      <span class="pdp-price">${fmt(p.price)} <span style="font-size:14px;font-weight:700;color:var(--muted)">COP</span></span>
      <div class="pdp-actions">
        <span class="bp-ctrl" data-ctrl="${esc(p.id)}"><button class="bp-add" data-add="${esc(p.id)}" aria-label="Agregar ${escAttr(name)}"><span>Agregar</span></button></span>
        <span class="pdp-add-label">Agregar al carrito</span>
        <a class="b b-line" data-wa-link href="#" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
      </div>
      <p class="pdp-note">Producto original. Arma tu pedido aquí, confírmalo por WhatsApp y coordinamos el pago y el envío. Envíos a toda Colombia desde Bogotá.</p>
    </div>
  </div>
</div></main>
${related.length ? `<section class="pdp-related"><div class="wrap"><h2>También te puede <em>gustar</em></h2><p class="lead">Más ${esc(catLabel(cat).toLowerCase())} de la tienda.</p><div class="bp-grid">${related.map(cardHtml).join("")}</div></div></section>` : ""}
${chromeFooter()}`;
  writeFile(`producto/${p.id}/index.html`, html);
}

function categoryPage(cat) {
  const items = productsInCat(cat.id);
  const title = CAT_TITLE[cat.id];
  const description = trunc(CAT_INTRO[cat.id] + " The Beauty Plug Collective.", 160);
  const url = abs(catUrl(cat.id));
  const image = items[0] ? imgAbs(items[0].img) : `${ORIGIN}/images/brand/og-image.jpg`;
  const crumbs = [
    { name: "Inicio", url: ORIGIN + "/" },
    { name: cat.label, url },
  ];
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: CFG.STORE_NAME, url: ORIGIN + "/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(productUrl(p)),
        name: `${p.brand} ${fullName(p)}`.trim(),
      })),
    },
  };
  const html = `${head({
    title, description, url, image, type: "website",
    jsonld: jsonLd(listLd) + "\n" + jsonLd(breadcrumbJsonLd(crumbs)),
  })}
<body>
${chromeNav()}
<main class="catpage"><div class="wrap">
  <nav class="pdp-crumb" aria-label="Miga de pan"><a href="/">Inicio</a><span aria-hidden="true">/</span>${esc(cat.label)}</nav>
  <div class="sechead">
    <h1>${esc(cat.label)}</h1>
    <p>${esc(CAT_INTRO[cat.id])} ${items.length} ${items.length === 1 ? "producto" : "productos"}.</p>
  </div>
  <div class="bp-grid">${items.map(cardHtml).join("")}</div>
</div></main>
${chromeFooter()}`;
  writeFile(`categoria/${cat.id}/index.html`, html);
}

function sitemap() {
  const urls = [
    { loc: ORIGIN + "/", pri: "1.0" },
    ...CATS.filter((c) => c.id !== "todos").map((c) => ({ loc: abs(catUrl(c.id)), pri: "0.8" })),
    ...PRODUCTS.map((p) => ({ loc: abs(productUrl(p)), pri: "0.7" })),
  ];
  const body = urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
  return urls.length;
}

// Clean previously generated folders so removed products disappear
for (const dir of ["producto", "categoria"]) {
  const absDir = path.join(ROOT, dir);
  if (fs.existsSync(absDir)) fs.rmSync(absDir, { recursive: true });
}

PRODUCTS.forEach(productPage);
CATS.filter((c) => c.id !== "todos").forEach(categoryPage);
const n = sitemap();
console.log(`Generated ${PRODUCTS.length} product pages, ${CATS.length - 1} category pages, sitemap ${n} URLs.`);

function updateHomeItemList() {
  const indexPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo The Beauty Plug Collective",
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(productUrl(p)),
      name: `${p.brand} ${fullName(p)}`.trim(),
    })),
  };
  const block = `<!--bp-itemlist-->\n<script type="application/ld+json">\n${JSON.stringify(list, null, 2)}\n</script>\n<!--/bp-itemlist-->`;
  if (html.includes("<!--bp-itemlist-->")) {
    html = html.replace(/<!--bp-itemlist-->[\s\S]*?<!--\/bp-itemlist-->/, block);
  } else {
    html = html.replace("</head>", block + "\n</head>");
  }
  fs.writeFileSync(indexPath, html);
}

updateHomeItemList();
