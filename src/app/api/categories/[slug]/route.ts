import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { updateCategorySchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
 * GET /api/categories/:slug
 * Returns a single category (by slug or _id).
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

    const category = await Category.findOne(query).lean();

    if (!category) {
      return notFoundError('Category not found');
    }

    return successResponse(category);
  } catch (error) {
    console.error('GET /api/categories/[slug] error:', error);
    return errorResponse('Failed to fetch category');
  }
}

/**
 * PUT /api/categories/:slug
 * Update a category (admin).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const category = await Category.findOneAndUpdate(
      query,
      parsed.data,
      { new: true }
    ).lean();

    if (!category) {
      return notFoundError('Category not found');
    }

    return successResponse(category);
  } catch (error) {
    console.error('PUT /api/categories/[slug] error:', error);
    return errorResponse('Failed to update category');
  }
}

/**
 * DELETE /api/categories/:slug
 * Soft-delete a category by setting status to inactive (admin).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const category = await Category.findOneAndUpdate(
      query,
      { status: 'inactive' },
      { new: true }
    ).lean();

    if (!category) {
      return notFoundError('Category not found');
    }

    return successResponse({ message: 'Category deactivated' });
  } catch (error) {
    console.error('DELETE /api/categories/[slug] error:', error);
    return errorResponse('Failed to delete category');
  }
}
