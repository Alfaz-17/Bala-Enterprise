/**
 * Bala Enterprise — Product Image Scraper
 * Downloads product images from the old site (balaenterprise.com) for re-upload to Cloudinary.
 * This is your client's own site/content — safe to reuse for their new build.
 *
 * Setup:
 *   npm install axios cheerio fs-extra
 *
 * Usage:
 *   node scrape-images.js
 */



const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");







// Map each category page to a folder name for organizing downloads
const CATEGORY_PAGES = [
  { url: "https://www.balaenterprise.com/wire-rope-hoist.html", folder: "wire-rope-hoist" },
  { url: "https://www.balaenterprise.com/chain-block.html", folder: "chain-block" },
  { url: "https://www.balaenterprise.com/manual-stacker.html", folder: "manual-stacker" },
  { url: "https://www.balaenterprise.com/hand-pallet-truck-12456716.html", folder: "hand-pallet-truck" },
  { url: "https://www.balaenterprise.com/manual-geared-trolley-12456731.html", folder: "geared-trolley" },
  { url: "https://www.balaenterprise.com/hydraulic-scissor-lift-table-12456738.html", folder: "scissor-lift-table" },
  { url: "https://www.balaenterprise.com/hydraulic-floor-crane-12456724.html", folder: "floor-crane" },
  { url: "https://www.balaenterprise.com/electric-winch.html", folder: "electric-winch" },
  { url: "https://www.balaenterprise.com/hand-winch.html", folder: "hand-winch" },
];

const OUTPUT_DIR = path.join(__dirname, "scraped-images");

async function downloadImage(imageUrl, filepath) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await fs.writeFile(filepath, response.data);
    console.log(`✅ Downloaded: ${filepath}`);
  } catch (err) {
    console.error(`❌ Failed: ${imageUrl} — ${err.message}`);
  }
}








// Turns "Electric Winch 1 Ton" into "electric-winch-1-ton" for clean SEO filenames
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function scrapeCategory({ url, folder }) {
  console.log(`\n📂 Scraping category: ${folder}`);
  const categoryDir = path.join(OUTPUT_DIR, folder);
  await fs.ensureDir(categoryDir);

  try {
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(html);

    let count = 0;

    // Product cards on this type of site typically use <img> tags inside
    // product listing blocks. Adjust the selector below after inspecting
    // the actual page structure in your browser dev tools if needed.
    $("img").each((i, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      const alt = $(el).attr("alt") || `product-${i}`;

      // Skip logos, icons, banners — only keep likely product images
      // (the old site's product images are hosted on cpimg.tistatic.com)
      if (src && src.includes("cpimg.tistatic.com")) {
        const filename = `${slugify(alt)}.jpg`;
        const filepath = path.join(categoryDir, filename);
        downloadImage(src, filepath);
        count++;
      }
    });

    console.log(`   Found ${count} product images in ${folder}`);
  } catch (err) {
    console.error(`❌ Failed to scrape ${url}: ${err.message}`);
  }
}

async function main() {
  await fs.ensureDir(OUTPUT_DIR);
  for (const category of CATEGORY_PAGES) {
    await scrapeCategory(category);
    // Small delay between requests — polite scraping, avoids hammering the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  console.log("\n🎉 Done. Check the /scraped-images folder.");
}

main();
