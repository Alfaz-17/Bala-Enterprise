import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';

// Load .env.local variables for stand-alone execution
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bala-enterprise';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parsePriceNumber(priceStr: string | number | undefined): number | undefined {
  if (!priceStr) return undefined;
  if (typeof priceStr === 'number') return priceStr;
  const match = String(priceStr).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : undefined;
}

function formatPriceDisplay(priceNum?: number, rawPrice?: string): string {
  if (priceNum && !isNaN(priceNum)) {
    return `₹ ${priceNum.toLocaleString('en-IN')}`;
  }
  if (rawPrice && rawPrice.trim()) {
    return rawPrice.replace(/\s*INR.*$/i, '').replace(/INR/i, '₹').trim();
  }
  return 'Price on Request';
}

// Exact Core Categories with matching 3D visual assets
const CORE_CATEGORIES = [
  {
    name: 'Wire Rope Hoist',
    slug: 'wire-rope-hoist',
    description: 'Electric wire rope hoists and utility hoists built for heavy overhead lifting.',
    imageUrl: '/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.webp',
    sortOrder: 1,
  },
  {
    name: 'Chain Block',
    slug: 'chain-block',
    description: 'Manual and electric chain blocks and chain hoists for reliable vertical lifting.',
    imageUrl: '/Categories_3d/Chain_Block.webp',
    sortOrder: 2,
  },
  {
    name: 'Manual Stacker',
    slug: 'manual-stacker',
    description: 'Hydraulic manual stackers for efficient warehouse pallet stacking and loading.',
    imageUrl: '/Categories_3d/Stacker.webp',
    sortOrder: 3,
  },
  {
    name: 'Hand Pallet Truck',
    slug: 'hand-pallet-truck',
    description: 'Heavy-duty hydraulic hand pallet trucks for horizontal material handling.',
    imageUrl: '/Categories_3d/35e73dd5-60db-4891-8715-b6c2ed715917.webp',
    sortOrder: 4,
  },
  {
    name: 'Geared Trolley',
    slug: 'manual-geared-trolley',
    description: 'Geared traveling monorail trolleys for secure beam movement.',
    imageUrl: '/Categories_3d/Geared_Trolley.webp',
    sortOrder: 5,
  },
  {
    name: 'Scissor Lift Table',
    slug: 'hydraulic-scissor-lift-table',
    description: 'Hydraulic scissor lift tables for ergonomic height adjustment.',
    imageUrl: '/Categories_3d/Scissor Lift Table.webp',
    sortOrder: 6,
  },
  {
    name: 'Floor Crane',
    slug: 'hydraulic-floor-crane',
    description: 'Mobile hydraulic floor cranes for versatile shop floor hoisting.',
    imageUrl: '/Categories_3d/Floor crane.webp',
    sortOrder: 7,
  },
  {
    name: 'Electric Winch',
    slug: 'electric-winch',
    description: 'Electric winches, drum winches, and builder winches for heavy pulling.',
    imageUrl: '/Categories_3d/837efcf2-bdd8-4892-8868-267e6b22ca49.webp',
    sortOrder: 8,
  },
  {
    name: 'Hand Winch',
    slug: 'hand-winch',
    description: 'Self-locking and worm-gear manual hand winches for pulling and rigging.',
    imageUrl: '/Categories_3d/Hand_winch.webp',
    sortOrder: 9,
  },
  {
    name: 'Motors & Accessories',
    slug: 'motors-and-accessories',
    description: 'Motors, fans, and special heavy industrial machinery components by Bala Enterprise.',
    imageUrl: 'https://tiimg.tistatic.com/fp/10/010/213/crane-motor-989.jpg',
    sortOrder: 10,
  }
];

async function seedTradeIndiaProducts() {
  console.log('🌐 Fetching live catalog from TradeIndia...');
  const tradeIndiaUrl = 'https://www.tradeindia.com/bala-enterprise-24235777/';
  const res = await fetch(tradeIndiaUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });

  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (!match) {
    throw new Error('Could not find __NEXT_DATA__ in TradeIndia profile page.');
  }

  const nextData = JSON.parse(match[1]);
  const sellerRes = nextData.props?.pageProps?.initialState?.sellerProfile?.seller_profile?.seller_profile_res;
  if (!sellerRes) {
    throw new Error('Seller profile data not found in TradeIndia payload.');
  }

  const rawProducts: any[] = [];
  const productIdsSeen = new Set<string>();

  if (Array.isArray(sellerRes.buy_online_data)) {
    sellerRes.buy_online_data.forEach((p: any) => {
      const id = String(p.product_id || p.id || Math.random());
      if (!productIdsSeen.has(id)) {
        productIdsSeen.add(id);
        rawProducts.push(p);
      }
    });
  }

  if (Array.isArray(sellerRes.product_services_data)) {
    sellerRes.product_services_data.forEach((cat: any) => {
      if (Array.isArray(cat.products)) {
        cat.products.forEach((p: any) => {
          const id = String(p.product_id || p.id || Math.random());
          if (!productIdsSeen.has(id)) {
            productIdsSeen.add(id);
            rawProducts.push({ ...p, tradeIndiaCategoryName: cat.cat_name });
          }
        });
      }
    });
  }

  if (Array.isArray(sellerRes.view_more_products)) {
    sellerRes.view_more_products.forEach((p: any) => {
      const id = String(p.product_id || p.id || Math.random());
      if (!productIdsSeen.has(id)) {
        productIdsSeen.add(id);
        rawProducts.push(p);
      }
    });
  }

  console.log(`✅ Total unique TradeIndia products retrieved: ${rawProducts.length}`);

  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const coreMap = new Map<string, any>();

  for (const catDef of CORE_CATEGORIES) {
    // Delete any near-duplicate category entries with obsolete slug/name variations
    await Category.deleteMany({
      _id: { $nin: Array.from(coreMap.values()).map((c) => c._id) },
      $or: [
        { slug: { $regex: new RegExp(`^${catDef.slug}$`, 'i') } },
        { name: new RegExp(`^${catDef.name}$`, 'i') }
      ]
    });

    const createdCat = await Category.create({
      name: catDef.name,
      slug: catDef.slug,
      description: catDef.description,
      imageUrl: catDef.imageUrl,
      sortOrder: catDef.sortOrder,
      status: 'active',
    });

    coreMap.set(catDef.slug, createdCat);
    console.log(`✔️ Active Category: "${createdCat.name}" (${createdCat.slug})`);
  }

  function getTargetCategorySlug(productName: string, tiCatName?: string): string {
    const nameLower = productName.toLowerCase();
    const tiCatLower = (tiCatName || '').toLowerCase();

    // 1. Hand Winch
    if (
      nameLower.includes('hand winch') ||
      nameLower.includes('manual hand winch') ||
      nameLower.includes('jsw hand winch') ||
      nameLower.includes('1800 lbs') ||
      nameLower.includes('2600 lbs') ||
      tiCatLower === 'hand winch'
    ) {
      return 'hand-winch';
    }

    // 2. Electric Winch
    if (
      nameLower.includes('electric winch') ||
      nameLower.includes('kcd') ||
      nameLower.includes('k.c.d') ||
      nameLower.includes('jeep winch') ||
      nameLower.includes('clutch winch') ||
      tiCatLower === 'electric winch'
    ) {
      return 'electric-winch';
    }

    // 3. Wire Rope Hoist
    if (
      nameLower.includes('wire rope') ||
      nameLower.includes('cd1') ||
      nameLower.includes('mini hoist') ||
      nameLower.includes('pa-') ||
      nameLower.includes('pa -') ||
      tiCatLower.includes('mini electric hoist') ||
      tiCatLower.includes('wire rope')
    ) {
      return 'wire-rope-hoist';
    }

    // 4. Chain Block
    if (
      nameLower.includes('chain block') ||
      nameLower.includes('chain hoist') ||
      nameLower.includes('dhs') ||
      nameLower.includes('hhbb') ||
      nameLower.includes('v/t') ||
      tiCatLower.includes('chain block')
    ) {
      return 'chain-block';
    }

    // 5. Manual Stacker
    if (nameLower.includes('stacker') || tiCatLower.includes('manual stacker')) {
      return 'manual-stacker';
    }

    // 6. Hand Pallet Truck
    if (nameLower.includes('pallet truck') || tiCatLower.includes('pallet truck')) {
      return 'hand-pallet-truck';
    }

    // 7. Geared Trolley
    if (nameLower.includes('geared trolley') || nameLower.includes('trolley') || tiCatLower.includes('trolley')) {
      return 'manual-geared-trolley';
    }

    // 8. Scissor Lift Table
    if (nameLower.includes('scissor lift') || tiCatLower.includes('scissor lift')) {
      return 'hydraulic-scissor-lift-table';
    }

    // 9. Floor Crane
    if (nameLower.includes('floor crane') || tiCatLower.includes('floor crane')) {
      return 'hydraulic-floor-crane';
    }

    // Default fallback
    return 'motors-and-accessories';
  }

  // Clear existing products & product images
  console.log('🗑️ Clearing existing products and product images...');
  await Product.deleteMany({});
  await ProductImage.deleteMany({});

  console.log('🌱 Seeding products from TradeIndia...');
  let insertedCount = 0;

  for (const p of rawProducts) {
    const title = p.product_name || p.long_tail_prod_name || p.name || 'Industrial Material Handling Equipment';
    const prodId = p.product_id || p.id || Math.floor(Math.random() * 100000);
    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${prodId}`;

    const specs: Record<string, string> = {};
    if (p.custom_field_data_meta_info?.custom_fields?.Product_Specifications) {
      p.custom_field_data_meta_info.custom_fields.Product_Specifications.forEach((s: any) => {
        if (s.label_name && s.value) {
          specs[s.label_name] = String(s.value);
        }
      });
    }

    if (p.custom_field_data_meta_info?.custom_fields?.Trade_Information) {
      p.custom_field_data_meta_info.custom_fields.Trade_Information.forEach((s: any) => {
        if (s.label_name && s.value) {
          specs[s.label_name] = String(s.value);
        }
      });
    }

    const capacity = specs['Lifting Capacity'] || specs['Capacity'] || specs['Load Capacity'] || (title.match(/\d+\s*(ton|kg|lbs)/i) ? title.match(/\d+\s*(ton|kg|lbs)/i)![0] : undefined);
    const priceNum = parsePriceNumber(p.total_price || p.price || p.hstore_price_n_quantity_data?.Price);
    const priceDisplay = formatPriceDisplay(priceNum, p.price);
    const imageUrl = p.product_image || p.image_path || 'https://cpimg.tistatic.com/12456682/b/5/CD1-Electric-Wire-Rope-Hoist.jpg';

    const modelNumber = specs['Model No'] || specs['Model Number'] || `BE-${prodId}`;

    const shortDescription = p.product_description || p.long_tail_prod_name || `${title} engineered for industrial lifting and material handling.`;
    const fullDescription = `${title} manufactured and supplied by Bala Enterprise. Features high durability, safety mechanisms, heavy-duty build quality, and smooth performance under industrial operating conditions.`;

    const targetSlug = getTargetCategorySlug(title, p.tradeIndiaCategoryName);
    const targetCategory = coreMap.get(targetSlug);

    const createdProd = await Product.create({
      name: title,
      slug: uniqueSlug,
      modelNumber: modelNumber,
      capacity: capacity,
      priceMin: priceNum,
      priceDisplay: priceDisplay,
      shortDescription: shortDescription.replace(/<br\s*\/?>/gi, ' '),
      fullDescription: fullDescription,
      specifications: specs,
      featured: false,
      category: targetCategory._id,
      status: 'active',
    });

    await ProductImage.create({
      product: createdProd._id,
      url: imageUrl,
      isPrimary: true,
      sortOrder: 1,
    });

    insertedCount++;
    console.log(`  [${insertedCount}/${rawProducts.length}] Seeded: "${title}" -> Category: "${targetCategory.name}" (${targetCategory.slug})`);
  }

  // Delete any orphaned categories not in coreMap
  const validCategoryIds = Array.from(coreMap.values()).map((c) => c._id);
  const redundantCats = await Category.deleteMany({ _id: { $nin: validCategoryIds } });
  if (redundantCats.deletedCount > 0) {
    console.log(`🧹 Cleaned up ${redundantCats.deletedCount} old category records.`);
  }

  console.log(`\n🎉 Successfully seeded ${insertedCount} products from TradeIndia!`);

  const categoryCounts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  console.log('\n📊 Clean Category Distribution:');
  for (const item of categoryCounts) {
    const cat = await Category.findById(item._id);
    console.log(`   - "${cat?.name}" (${cat?.slug}) [Image: ${cat?.imageUrl}]: ${item.count} products`);
  }

  await mongoose.disconnect();
}

seedTradeIndiaProducts().catch((err) => {
  console.error('❌ Error seeding TradeIndia products:', err);
  process.exit(1);
});
