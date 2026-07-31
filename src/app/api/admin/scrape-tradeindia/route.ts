import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { ProductImage } from '@/models/ProductImage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import * as cheerio from 'cheerio';

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

// Category keyword mapping helper
function getTargetCategorySlug(productName: string, tiCatName?: string): string {
  const nameLower = productName.toLowerCase();
  const tiCatLower = (tiCatName || '').toLowerCase();

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

  if (nameLower.includes('stacker') || tiCatLower.includes('manual stacker')) {
    return 'manual-stacker';
  }

  if (nameLower.includes('pallet truck') || tiCatLower.includes('pallet truck')) {
    return 'hand-pallet-truck';
  }

  if (nameLower.includes('geared trolley') || nameLower.includes('trolley') || tiCatLower.includes('trolley')) {
    return 'manual-geared-trolley';
  }

  if (nameLower.includes('scissor lift') || tiCatLower.includes('scissor lift')) {
    return 'hydraulic-scissor-lift-table';
  }

  if (nameLower.includes('floor crane') || tiCatLower.includes('floor crane')) {
    return 'hydraulic-floor-crane';
  }

  return 'motors-and-accessories';
}

/**
 * POST /api/admin/scrape-tradeindia
 * Body: { type: 'profile' | 'product', url: string }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const session = await getServerSession(authOptions);
    if (!session) {
      return unauthorizedResponse('You must be logged in as an administrator');
    }

    const body = await request.json();
    const { type, url } = body;

    if (!url) {
      return errorResponse('Missing tradeindia URL parameter', 400);
    }

    await connectToDatabase();

    // MODE A: BULK PROFILE SYNC
    if (type === 'profile') {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });

      if (!res.ok) {
        return errorResponse(`Failed to fetch TradeIndia profile page: ${res.statusText}`, 500);
      }

      const html = await res.text();
      const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
      if (!match) {
        return errorResponse('Could not parse Next.js state structure from TradeIndia profile.', 500);
      }

      const nextData = JSON.parse(match[1]);
      const sellerRes = nextData.props?.pageProps?.initialState?.sellerProfile?.seller_profile?.seller_profile_res;
      if (!sellerRes) {
        return errorResponse('Seller catalog details not found in TradeIndia response.', 500);
      }

      const rawProducts: any[] = [];
      const productIdsSeen = new Set<string>();

      const addRawProduct = (p: any, catName?: string) => {
        const id = String(p.product_id || p.id || Math.random());
        if (!productIdsSeen.has(id)) {
          productIdsSeen.add(id);
          rawProducts.push(catName ? { ...p, tradeIndiaCategoryName: catName } : p);
        }
      };

      if (Array.isArray(sellerRes.buy_online_data)) {
        sellerRes.buy_online_data.forEach(p => addRawProduct(p));
      }
      if (Array.isArray(sellerRes.product_services_data)) {
        sellerRes.product_services_data.forEach((cat: any) => {
          if (Array.isArray(cat.products)) {
            cat.products.forEach((p: any) => addRawProduct(p, cat.cat_name));
          }
        });
      }
      if (Array.isArray(sellerRes.view_more_products)) {
        sellerRes.view_more_products.forEach(p => addRawProduct(p));
      }

      // Load active categories map
      const categories = await Category.find({ status: 'active' }).lean();
      const categoryMap = new Map(categories.map(c => [c.slug, c]));

      let addedCount = 0;
      let updatedCount = 0;

      for (const p of rawProducts) {
        const title = p.product_name || p.long_tail_prod_name || p.name || 'Industrial lifting gear';
        const prodId = p.product_id || p.id || String(Math.floor(Math.random() * 100000));
        const baseSlug = slugify(title);
        const uniqueSlug = `${baseSlug}-${prodId}`;

        // Parse specifications
        const specs: Record<string, string> = {};
        if (p.custom_field_data_meta_info?.custom_fields?.Product_Specifications) {
          p.custom_field_data_meta_info.custom_fields.Product_Specifications.forEach((s: any) => {
            if (s.label_name && s.value) specs[s.label_name] = String(s.value);
          });
        }
        if (p.custom_field_data_meta_info?.custom_fields?.Trade_Information) {
          p.custom_field_data_meta_info.custom_fields.Trade_Information.forEach((s: any) => {
            if (s.label_name && s.value) specs[s.label_name] = String(s.value);
          });
        }

        const capacity = specs['Lifting Capacity'] || specs['Capacity'] || specs['Load Capacity'] || 
                         (title.match(/\d+\s*(ton|kg|lbs)/i) ? title.match(/\d+\s*(ton|kg|lbs)/i)![0] : undefined);
        const priceNum = parsePriceNumber(p.total_price || p.price || p.hstore_price_n_quantity_data?.Price);
        const priceDisplay = formatPriceDisplay(priceNum, p.price);
        const imageUrl = p.product_image || p.image_path || 'https://cpimg.tistatic.com/12456682/b/5/CD1-Electric-Wire-Rope-Hoist.jpg';
        const modelNumber = specs['Model No'] || specs['Model Number'] || `BE-${prodId}`;

        const shortDescription = p.product_description || p.long_tail_prod_name || `${title} engineered for industrial lifting.`;
        const fullDescription = `${title} manufactured by Bala Enterprise. Heavy-duty build quality, safety mechanisms, and smooth performance under industrial operating conditions.`;

        const targetSlug = getTargetCategorySlug(title, p.tradeIndiaCategoryName);
        const targetCategory = categoryMap.get(targetSlug) || categoryMap.get('motors-and-accessories');

        if (!targetCategory) continue;

        // Check if product already exists by title
        let existingProd = await Product.findOne({ name: title });

        if (existingProd) {
          // Update details
          existingProd.modelNumber = modelNumber;
          existingProd.capacity = capacity;
          existingProd.priceMin = priceNum;
          existingProd.priceDisplay = priceDisplay;
          existingProd.specifications = { ...existingProd.specifications, ...specs };
          await existingProd.save();
          updatedCount++;
        } else {
          // Create product
          const createdProd = await Product.create({
            name: title,
            slug: uniqueSlug,
            modelNumber,
            capacity,
            priceMin: priceNum,
            priceDisplay,
            shortDescription: shortDescription.replace(/<br\s*\/?>/gi, ' '),
            fullDescription,
            specifications: specs,
            featured: true,
            category: targetCategory._id,
            status: 'active',
          });

          await ProductImage.create({
            product: createdProd._id,
            url: imageUrl,
            isPrimary: true,
            sortOrder: 1,
          });

          addedCount++;
        }
      }

      return successResponse({
        message: `Successfully synchronized products from TradeIndia profile`,
        importedTotal: rawProducts.length,
        addedCount,
        updatedCount
      });
    }

    // MODE B: SINGLE PRODUCT PAGE AUTOFILL
    if (type === 'product') {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });

      if (!res.ok) {
        return errorResponse(`Failed to fetch TradeIndia product page: ${res.statusText}`, 500);
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // Default values
      let name = '';
      let shortDescription = '';
      let fullDescription = '';
      let image = '';
      let specifications: Record<string, string> = {};

      // Try Next.js __NEXT_DATA__ state first
      const nextMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
      let parsedFromNext = false;

      if (nextMatch) {
        try {
          const nextData = JSON.parse(nextMatch[1]);
          const stateProd = nextData.props?.pageProps?.initialState?.productDetail?.product_details || 
                            nextData.props?.pageProps?.productDetail || 
                            nextData.props?.pageProps?.initialState?.productDetail;
          
          if (stateProd) {
            name = stateProd.product_name || stateProd.name || '';
            shortDescription = stateProd.product_description || stateProd.description || '';
            image = stateProd.product_image || stateProd.image_path || '';
            
            // Specifications
            if (stateProd.custom_field_data_meta_info?.custom_fields?.Product_Specifications) {
              stateProd.custom_field_data_meta_info.custom_fields.Product_Specifications.forEach((s: any) => {
                if (s.label_name && s.value) specifications[s.label_name] = String(s.value);
              });
            }
            parsedFromNext = true;
          }
        } catch (e) {
          console.warn('Next data parsing failed, falling back to HTML scraping:', e);
        }
      }

      // Scraping Fallback
      if (!parsedFromNext || !name) {
        name = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
        shortDescription = $('meta[property="og:description"]').attr('content') || '';
        image = $('meta[property="og:image"]').attr('content') || '';

        // Scrape table specs
        $('table tr').each((_, el) => {
          const cells = $(el).find('td, th');
          if (cells.length >= 2) {
            const key = $(cells[0]).text().trim().replace(/:$/, '');
            const value = $(cells[1]).text().trim();
            if (key && value) {
              specifications[key] = value;
            }
          }
        });

        // Scrape description text if metadata is short
        const descriptionNode = $('.product-description, .product-desc, [itemprop="description"]').first();
        if (descriptionNode.length > 0) {
          fullDescription = descriptionNode.text().trim();
        }
      }

      const capacity = specifications['Lifting Capacity'] || specifications['Capacity'] || specifications['Load Capacity'] ||
                       (name.match(/\d+\s*(ton|kg|lbs)/i) ? name.match(/\d+\s*(ton|kg|lbs)/i)![0] : '');

      const modelNumber = specifications['Model No'] || specifications['Model Number'] || '';

      const targetSlug = getTargetCategorySlug(name);
      const categoryDoc = await Category.findOne({ slug: targetSlug }).lean();

      return successResponse({
        data: {
          name,
          modelNumber,
          capacity,
          shortDescription,
          fullDescription: fullDescription || shortDescription,
          specifications,
          categoryId: categoryDoc ? String(categoryDoc._id) : '',
          image: image || 'https://cpimg.tistatic.com/12456682/b/5/CD1-Electric-Wire-Rope-Hoist.jpg'
        }
      });
    }

    return errorResponse('Invalid scrape type specified', 400);
  } catch (err: any) {
    console.error('Error during scraping operation:', err);
    return errorResponse(err.message || 'Scraping operation failed', 500);
  }
}
