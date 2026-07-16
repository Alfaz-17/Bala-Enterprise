import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Testimonial } from '@/models/Testimonial';
import { createTestimonialSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  successResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/testimonials
 * Returns all active testimonials (or all if admin calls with all=true).
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

    const testimonials = await Testimonial.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    return successResponse(testimonials);
  } catch (error) {
    console.error('GET /api/testimonials error:', error);
    return errorResponse('Failed to fetch testimonials');
  }
}

/**
 * POST /api/testimonials
 * Create a testimonial (admin).
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const testimonial = await Testimonial.create(parsed.data);
    return createdResponse(testimonial);
  } catch (error) {
    console.error('POST /api/testimonials error:', error);
    return errorResponse('Failed to create testimonial');
  }
}
