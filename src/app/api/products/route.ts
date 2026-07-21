import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { ProductImage } from '@/models/ProductImage';
import { createProductSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import {
  successResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/products
 * Query params: category, featured, page, limit, all
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');
    const all = searchParams.get('all') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    // Build filter
    const filter: Record<string, unknown> = {};

    let includeInactive = false;
    if (all) {
      const session = await getServerSession(authOptions);
      if (session) {
        includeInactive = true;
      }
    }

    if (!includeInactive) {
      filter.status = 'active';
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) filter.category = category._id;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .select('name slug capacity priceDisplay shortDescription featured status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Attach primary thumbnail to each product
    const productIds = products.map((p) => p._id);
    const thumbnails = await ProductImage.find({
      product: { $in: productIds },
      isPrimary: true,
    })
      .select('product url')
      .lean();

    const thumbMap = new Map(thumbnails.map((t) => [String(t.product), t.url]));

    const data = products.map((p) => ({
      ...p,
      thumbnail: thumbMap.get(String(p._id)) || null,
    }));

    return successResponse({ total, page, limit, data });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return errorResponse('Failed to fetch products');
  }
}

/**
 * POST /api/products
 * Create a new product (admin).
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { categoryId, ...rest } = parsed.data;

    const product = await Product.create({
      ...rest,
      category: categoryId,
    });

    if (body.images && Array.isArray(body.images)) {
      await ProductImage.create(
        body.images.map((url: string, index: number) => ({
          url,
          altText: parsed.data.name,
          isPrimary: index === 0,
          sortOrder: index,
          product: product._id,
        }))
      );
    }

    // Trigger on-demand revalidation of catalog and detail page
    try {
      revalidatePath('/products');
      revalidatePath(`/products/${product.slug}`);
    } catch (revalError) {
      console.error('Revalidation error after product creation:', revalError);
    }

    return createdResponse(product);
  } catch (error) {
    console.error('POST /api/products error:', error);
    return errorResponse('Failed to create product');
  }
}
