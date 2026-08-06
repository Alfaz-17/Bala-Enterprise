import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import { updateProductSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import {
  successResponse,
  notFoundError,
  validationError,
  errorResponse,
} from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/products/:slug
 * Full product detail with images and category (by slug or _id).
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const session = await getServerSession(authOptions);
    if (!session) {
      query.status = 'active';
    }

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return notFoundError('Product not found');
    }

    const images = await ProductImage.find({ product: product._id })
      .sort({ sortOrder: 1 })
      .select('url altText isPrimary sortOrder')
      .lean();

    return successResponse({ ...product, images });
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return errorResponse('Failed to fetch product');
  }
}

/**
 * PUT /api/products/:slug
 * Update a product (admin).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { categoryId, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (categoryId) updateData.category = categoryId;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const product = await Product.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).lean();

    if (!product) {
      return notFoundError('Product not found');
    }

    if (body.images && Array.isArray(body.images)) {
      // Sync images: delete existing and create new ones
      await ProductImage.deleteMany({ product: product._id });
      await ProductImage.create(
        body.images.map((url: string, index: number) => ({
          url,
          altText: product.name,
          isPrimary: index === 0,
          sortOrder: index,
          product: product._id,
        }))
      );
    }

    // Trigger on-demand revalidation of catalog and detail page
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath(`/products/${product.slug}`);
    } catch (revalError) {
      console.error('Revalidation error after product update:', revalError);
    }

    return successResponse(product);
  } catch (error) {
    console.error('PUT /api/products/[slug] error:', error);
    return errorResponse('Failed to update product');
  }
}

/**
 * DELETE /api/products/:slug
 * Soft-delete a product (admin).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const product = await Product.findOneAndDelete(query).lean();

    if (!product) {
      return notFoundError('Product not found');
    }

    // Delete associated images
    await ProductImage.deleteMany({ product: product._id });

    // Trigger on-demand revalidation of catalog and detail page
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath(`/products/${product.slug}`);
    } catch (revalError) {
      console.error('Revalidation error after product deletion:', revalError);
    }

    return successResponse({ message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE /api/products/[slug] error:', error);
    return errorResponse('Failed to delete product');
  }
}
