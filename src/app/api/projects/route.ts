import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Project } from '@/models/Project';
import { ProjectImage } from '@/models/ProjectImage';
import { createProjectSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  successResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/projects
 * Query params: page, limit, all
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    let filter: Record<string, any> = { status: 'active' };

    if (all) {
      const session = await getServerSession(authOptions);
      if (session) {
        filter = {};
      }
    }

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .sort({ completedDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Attach first image as thumbnail
    const projectIds = projects.map((p) => p._id);
    const images = await ProjectImage.find({
      project: { $in: projectIds },
    })
      .sort({ sortOrder: 1 })
      .lean();

    const thumbMap = new Map<string, string>();
    for (const img of images) {
      const key = String(img.project);
      if (!thumbMap.has(key)) thumbMap.set(key, img.url);
    }

    const data = projects.map((p) => ({
      ...p,
      thumbnail: thumbMap.get(String(p._id)) || null,
    }));

    return successResponse({ total, page, limit, data });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return errorResponse('Failed to fetch projects');
  }
}

/**
 * POST /api/projects
 * Create a new project (admin).
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { productId, completedDate, ...rest } = parsed.data;

    const project = await Project.create({
      ...rest,
      product: productId || undefined,
      completedDate: completedDate ? new Date(completedDate) : undefined,
    });

    if (body.images && Array.isArray(body.images)) {
      await ProjectImage.create(
        body.images.map((url: string, index: number) => ({
          url,
          sortOrder: index,
          project: project._id,
        }))
      );
    }

    return createdResponse(project);
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return errorResponse('Failed to create project');
  }
}
