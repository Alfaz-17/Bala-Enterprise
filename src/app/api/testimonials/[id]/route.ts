import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { Testimonial } from '@/models/Testimonial';
import { updateTestimonialSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  successResponse,
  notFoundError,
  validationError,
  errorResponse,
} from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/testimonials/:id
 * Fetch a single testimonial by ID.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return notFoundError('Invalid ID format');
    }

    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return notFoundError('Testimonial not found');
    }

    return successResponse(testimonial);
  } catch (error) {
    console.error('GET /api/testimonials/[id] error:', error);
    return errorResponse('Failed to fetch testimonial');
  }
}

/**
 * PUT /api/testimonials/:id
 * Update a testimonial (admin).
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return notFoundError('Invalid ID format');
    }

    const body = await request.json();
    const parsed = updateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      parsed.data,
      { new: true }
    ).lean();

    if (!testimonial) {
      return notFoundError('Testimonial not found');
    }

    return successResponse(testimonial);
  } catch (error) {
    console.error('PUT /api/testimonials/[id] error:', error);
    return errorResponse('Failed to update testimonial');
  }
}

/**
 * DELETE /api/testimonials/:id
 * Soft-delete a testimonial (admin).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return notFoundError('Invalid ID format');
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    ).lean();

    if (!testimonial) {
      return notFoundError('Testimonial not found');
    }

    return successResponse({ message: 'Testimonial deactivated' });
  } catch (error) {
    console.error('DELETE /api/testimonials/[id] error:', error);
    return errorResponse('Failed to delete testimonial');
  }
}
