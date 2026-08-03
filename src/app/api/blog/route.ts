import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongoose';
import { BlogPost } from '@/models/BlogPost';
import { createBlogPostSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  successResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/blog
 * Query params: page, limit, all
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const all = searchParams.get('all') === 'true';

    let filter: Record<string, any> = { status: 'published' };

    if (all) {
      const session = await getServerSession(authOptions);
      if (session) {
        filter = {};
      }
    }

    const total = await BlogPost.countDocuments(filter);

    const posts = await BlogPost.find(filter)
      .select('title slug featuredImage metaDescription status publishedAt')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return successResponse({ total, page, limit, data: posts });
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return errorResponse('Failed to fetch blog posts');
  }
}

/**
 * POST /api/blog
 * Create a blog post (admin).
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createBlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { publishedAt, ...rest } = parsed.data;

    const post = await BlogPost.create({
      ...rest,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${post.slug}`);
    } catch (e) {
      console.error('Revalidation failed:', e);
    }

    return createdResponse(post);
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return errorResponse('Failed to create blog post');
  }
}
