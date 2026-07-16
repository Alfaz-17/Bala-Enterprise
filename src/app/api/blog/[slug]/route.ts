import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { BlogPost } from '@/models/BlogPost';
import { updateBlogPostSchema } from '@/lib/validations';
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
 * GET /api/blog/:slug
 * Full blog post content (by slug or _id).
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const session = await getServerSession(authOptions);
    if (!session) {
      query.status = 'published';
    }

    const post = await BlogPost.findOne(query).lean();

    if (!post) {
      return notFoundError('Blog post not found');
    }

    return successResponse(post);
  } catch (error) {
    console.error('GET /api/blog/[slug] error:', error);
    return errorResponse('Failed to fetch blog post');
  }
}

/**
 * PUT /api/blog/:slug
 * Update a blog post (admin).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const body = await request.json();
    const parsed = updateBlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { publishedAt, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (publishedAt) updateData.publishedAt = new Date(publishedAt);

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const post = await BlogPost.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).lean();

    if (!post) {
      return notFoundError('Blog post not found');
    }

    return successResponse(post);
  } catch (error) {
    console.error('PUT /api/blog/[slug] error:', error);
    return errorResponse('Failed to update blog post');
  }
}

/**
 * DELETE /api/blog/:slug
 * Hard-delete a blog post (admin).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const post = await BlogPost.findOneAndDelete(query).lean();

    if (!post) {
      return notFoundError('Blog post not found');
    }

    return successResponse({ message: 'Blog post deleted' });
  } catch (error) {
    console.error('DELETE /api/blog/[slug] error:', error);
    return errorResponse('Failed to delete blog post');
  }
}
