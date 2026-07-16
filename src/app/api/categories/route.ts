import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { createCategorySchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  successResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/categories
 * Returns all active categories sorted by sortOrder (or all if admin calls with all=true).
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    
    let filter: Record<string, any> = { status: 'active' };
    
    if (all) {
      const session = await getServerSession(authOptions);
      if (session) {
        filter = {};
      }
    }

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1 })
      .lean();
    return successResponse(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return errorResponse('Failed to fetch categories');
  }
}

/**
 * POST /api/categories
 * Create a new category (admin).
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const existing = await Category.findOne({ slug: parsed.data.slug });
    if (existing) {
      return validationError('A category with this slug already exists');
    }

    const category = await Category.create(parsed.data);
    return createdResponse(category);
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return errorResponse('Failed to create category');
  }
}
