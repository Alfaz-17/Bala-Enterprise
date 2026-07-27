const mongoose = require('mongoose');
const fs = require('fs');
const pathModule = require('path');

function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  try {
    const envPath = pathModule.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/^MONGODB_URI\s*=\s*(.+)$/m);
      if (match) {
        return match[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) {
    console.error('Error reading .env.local:', e);
  }
  return null;
}

let productCache = null;

async function getProductCache() {
  if (productCache) return productCache;
  productCache = new Map();

  const uri = getMongoUri();
  if (!uri) {
    console.warn('MONGODB_URI not found. Skipping sitemap product data injection.');
    return productCache;
  }

  try {
    // Avoid connecting multiple times
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
    
    // Fetch active products
    const products = await mongoose.connection.db.collection('products')
      .find({ status: 'active' })
      .toArray();

    // Fetch all product images
    const images = await mongoose.connection.db.collection('productimages')
      .find()
      .toArray();

    // Map images by product ID
    for (const p of products) {
      const productImages = images
        .filter(img => String(img.product) === String(p._id))
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      const capacityInfo = p.capacity ? ` - ${p.capacity}` : '';
      productCache.set(`/products/${p.slug}`, {
        name: p.name,
        shortDescription: p.shortDescription || p.name,
        images: productImages.map(img => ({
          loc: img.url,
          title: `${p.name}${capacityInfo}`,
          caption: p.shortDescription || p.name,
        })),
      });
    }
  } catch (err) {
    console.error('Error loading product data for sitemap:', err);
  } finally {
    // Disconnect to ensure the Node process exits clean
    await mongoose.disconnect();
  }

  return productCache;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.balaenterprise.in',
  generateRobotsTxt: true,
  exclude: ['/admin*', '/api*', '/temp-gallery'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/temp-gallery'],
      },
    ],
  },
  additionalPaths: async (config) => {
    const cache = await getProductCache();
    const result = [];
    for (const [relPath, product] of cache.entries()) {
      result.push({
        loc: relPath, // next-sitemap will resolve it using siteUrl
        changefreq: 'weekly',
        priority: 0.8,
        images: product.images,
      });
    }
    return result;
  },
  transform: async (config, path) => {
    // Check if path is a product detail page (e.g. from static crawl)
    if (path.startsWith('/products/')) {
      const cache = await getProductCache();
      const product = cache.get(path);

      if (product) {
        return {
          loc: path,
          changefreq: 'weekly',
          priority: 0.8,
          images: product.images,
        };
      }
    }

    // Default transform
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
