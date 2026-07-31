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

let sitemapCache = null;

async function getSitemapDataCache() {
  if (sitemapCache) return sitemapCache;
  sitemapCache = {
    products: new Map(),
    categories: []
  };

  const uri = getMongoUri();
  if (!uri) {
    console.warn('MONGODB_URI not found. Skipping sitemap product data injection.');
    return sitemapCache;
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

    // Fetch active categories
    const categories = await mongoose.connection.db.collection('categories')
      .find({ status: 'active' })
      .toArray();

    sitemapCache.categories = categories;

    // Map images by product ID
    for (const p of products) {
      const productImages = images
        .filter(img => String(img.product) === String(p._id))
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      const capacityInfo = p.capacity ? ` - ${p.capacity}` : '';
      sitemapCache.products.set(`/products/${p.slug}`, {
        name: p.name,
        shortDescription: p.shortDescription || p.name,
        images: productImages.map(img => {
          const imgUrl = img.url;
          if (!imgUrl) return null;
          
          // Ensure absolute URL
          const absoluteUrl = imgUrl.startsWith('http')
            ? imgUrl
            : `https://www.balaenterprise.in${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
          
          try {
            return {
              loc: new URL(absoluteUrl),
              title: `${p.name}${capacityInfo}`,
              caption: p.shortDescription || p.name,
            };
          } catch (e) {
            console.error(`Invalid URL for product image: ${absoluteUrl}`, e);
            return null;
          }
        }).filter(Boolean),
      });
    }
  } catch (err) {
    console.error('Error loading product data for sitemap:', err);
  } finally {
    // Disconnect to ensure the Node process exits clean
    await mongoose.disconnect();
  }

  return sitemapCache;
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
    const cache = await getSitemapDataCache();
    const result = [];
    
    // 1. Add product URLs
    for (const [relPath, product] of cache.products.entries()) {
      result.push({
        loc: relPath,
        changefreq: 'weekly',
        priority: 0.8,
        images: product.images,
      });
    }

    // 2. Add Category URLs
    for (const cat of cache.categories) {
      result.push({
        loc: `/products?category=${cat.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }

    return result;
  },
  transform: async (config, path) => {
    // Check if path is a product detail page (e.g. from static crawl)
    if (path.startsWith('/products/')) {
      const cache = await getSitemapDataCache();
      const product = cache.products.get(path);

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
