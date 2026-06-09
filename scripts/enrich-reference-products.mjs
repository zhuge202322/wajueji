import { readFile, writeFile } from "node:fs/promises";

const DATA_FILE = new URL("../prisma/reference-products.json", import.meta.url);
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36";

function decodeEntities(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value = "") {
  return decodeEntities(value)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(value = "") {
  return decodeEntities(value.trim()).replace(/-\d+x\d+(?=\.(webp|png|jpe?g))/i, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}=(["'])(.*?)\\1`, "i"));
  return match ? decodeEntities(match[2]) : "";
}

function extractSection(html, startPattern, endPattern) {
  const start = html.search(startPattern);
  if (start < 0) return "";
  const rest = html.slice(start);
  const end = rest.search(endPattern);
  return end > 0 ? rest.slice(0, end) : rest;
}

function extractImageTags(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
}

function extractImages(html) {
  return unique(
    extractImageTags(html)
      .map((tag) => normalizeUrl(getAttr(tag, "src")))
      .filter((src) => /^https?:\/\//i.test(src))
  );
}

function extractMainGallery(html) {
  const gallery = extractSection(
    html,
    /<div class="in_grid_show swiper">/i,
    /<div class="ingrid-pagination">/i
  );
  return extractImages(gallery).filter((src) => src.includes("/wp-content/uploads/YUYI/"));
}

function extractDetailArticle(html) {
  return extractSection(
    html,
    /<article class="productsDetail_otherContain_detailedDescription_contain">/i,
    /<\/article>/i
  );
}

function extractTables(html) {
  return [...html.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map((match) => match[0]);
}

function extractRows(tableHtml) {
  return [...tableHtml.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)]
    .map((rowMatch) => {
      const cells = [...rowMatch[0].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
        (cell) => stripHtml(cell[1]).replace(/:$/, "").trim()
      );
      return cells.length >= 2 ? { key: cells[0], value: cells.slice(1).join(" ") } : null;
    })
    .filter((row) => row && row.key && row.value);
}

function tableFromRows(rows) {
  if (!rows.length) return "";
  return `<table><tbody>${rows
    .map(
      (row) =>
        `<tr><th>${escapeHtml(row.key)}</th><td>${escapeHtml(row.value)}</td></tr>`
    )
    .join("")}</tbody></table>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function extractTitle(html, fallback) {
  const h1 = html.match(/<div class="single_grid_right">[\s\S]*?<h1>([\s\S]*?)<\/h1>/i);
  if (h1) return stripHtml(h1[1]);
  const og = html.match(/<meta property="og:title" content="([^"]+)"/i);
  return og ? stripHtml(og[1].replace(/\s+-\s+YuYi$/i, "")) : fallback;
}

function extractIntro(articleHtml, fallbackName) {
  const heading = articleHtml.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
  return heading ? stripHtml(heading[1]) : `${fallbackName} for export machinery buyers.`;
}

function buildDescription({ intro, detailImages, facts }) {
  const factTable = tableFromRows(facts);
  const imageHtml = detailImages
    .slice(0, 12)
    .map((src) => `<figure><img src="${escapeHtml(src)}" alt="" /></figure>`)
    .join("");
  return [
    intro ? `<h2>${escapeHtml(intro)}</h2>` : "",
    imageHtml ? `<div class="reference-detail-gallery">${imageHtml}</div>` : "",
    factTable ? `<h3>Product Parameters</h3>${factTable}` : "",
    `<h3>FAQ</h3><p>Payment terms, delivery time, warranty and pre-shipment inspection can be confirmed before order. Please send model, quantity and destination port for a current quotation.</p>`
  ]
    .filter(Boolean)
    .join("\n");
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml"
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function enrichProduct(product, index, total) {
  if (!product.sourceUrl) return product;
  const html = await fetchHtml(product.sourceUrl);
  const detailArticle = extractDetailArticle(html);
  const tables = extractTables(html);
  const summaryRows = extractRows(tables[0] || "");
  const detailRows = extractRows(tables[1] || "");
  const allFacts = [...summaryRows, ...detailRows];
  const mainGallery = extractMainGallery(html);
  const detailImages = extractImages(detailArticle).filter((src) =>
    src.includes("/wp-content/uploads/YUYI/")
  );
  const galleryImages = mainGallery.length ? mainGallery : detailImages;
  const title = extractTitle(html, product.name);
  const intro = extractIntro(detailArticle, title);
  const price = summaryRows.find((row) => /price/i.test(row.key))?.value || product.price;
  const minOrder =
    summaryRows.find((row) => /minimum|min order|moq/i.test(row.key))?.value ||
    product.minOrder ||
    "1 Unit";
  const facts = allFacts.length ? allFacts : product.facts || [];
  const specs = tableFromRows(summaryRows.length ? summaryRows : facts);

  console.log(
    `[${index + 1}/${total}] ${title} images=${galleryImages.length} facts=${facts.length}`
  );

  return {
    ...product,
    name: title,
    image: galleryImages[0] || product.image,
    galleryImages,
    detailImages: unique(detailImages),
    price: price || "Contact for quote",
    minOrder,
    facts,
    shortDescription: intro,
    description: buildDescription({
      intro,
      detailImages: unique(detailImages),
      facts
    }),
    specs: specs || product.specs
  };
}

async function main() {
  const data = JSON.parse(await readFile(DATA_FILE, "utf8"));
  const products = [];
  const total = data.products.length;

  for (let index = 0; index < total; index += 1) {
    const product = data.products[index];
    try {
      products.push(await enrichProduct(product, index, total));
    } catch (error) {
      console.warn(
        `[${index + 1}/${total}] ${product.name} failed: ${error.message}`
      );
      products.push(product);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const nextData = {
    ...data,
    enrichedAt: new Date().toISOString(),
    products
  };

  await writeFile(DATA_FILE, `${JSON.stringify(nextData, null, 2)}\n`);
  const enriched = products.filter((product) => product.galleryImages?.length).length;
  console.log(`Enriched ${enriched}/${total} products with gallery images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
