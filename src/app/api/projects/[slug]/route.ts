import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { Project } from '@/models/Project';
import { ProjectImage } from '@/models/ProjectImage';
import { updateProjectSchema } from '@/lib/validations';
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
 * GET /api/projects/:slug
 * Full project detail with images and linked product (by slug or _id).
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

    const project = await Project.findOne(query)
      .populate('product', 'name slug')
      .lean();

    if (!project) {
      return notFoundError('Project not found');
    }

    const images = await ProjectImage.find({ project: project._id })
      .sort({ sortOrder: 1 })
      .select('url sortOrder')
      .lean();

    return successResponse({ ...project, images });
  } catch (error) {
    console.error('GET /api/projects/[slug] error:', error);
    return errorResponse('Failed to fetch project');
  }
}

/**
 * PUT /api/projects/:slug
 * Update a project (admin).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { productId, completedDate, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (productId) updateData.product = productId;
    if (completedDate) updateData.completedDate = new Date(completedDate);

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const project = await Project.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).lean();

    if (!project) {
      return notFoundError('Project not found');
    }

    if (body.images && Array.isArray(body.images)) {
      // Sync images: delete existing and create new ones
      await ProjectImage.deleteMany({ project: project._id });
      await ProjectImage.create(
        body.images.map((url: string, index: number) => ({
          url,
          sortOrder: index,
          project: project._id,
        }))
      );
    }

    return successResponse(project);
  } catch (error) {
    console.error('PUT /api/projects/[slug] error:', error);
    return errorResponse('Failed to update project');
  }
}

/**
 * DELETE /api/projects/:slug
 * Soft-delete a project (admin).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const isId = mongoose.Types.ObjectId.isValid(slug);
    const query: Record<string, any> = isId ? { _id: slug } : { slug };

    const project = await Project.findOneAndUpdate(
      query,
      { status: 'inactive' },
      { new: true }
    ).lean();

    if (!project) {
      return notFoundError('Project not found');
    }

    return successResponse({ message: 'Project deactivated' });
  } catch (error) {
    console.error('DELETE /api/projects/[slug] error:', error);
    return errorResponse('Failed to delete project');
  }
}
