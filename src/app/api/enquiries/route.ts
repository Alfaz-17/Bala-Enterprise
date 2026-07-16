import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Enquiry } from '@/models/Enquiry';
import { createEnquirySchema, updateEnquiryStatusSchema } from '@/lib/validations';
import {
  successResponse,
  createdResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/enquiries
 * List all enquiries with optional status filter (admin).
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return successResponse({ total, page, limit, data: enquiries });
  } catch (error) {
    console.error('GET /api/enquiries error:', error);
    return errorResponse('Failed to fetch enquiries');
  }
}

/**
 * POST /api/enquiries
 * Public endpoint — contact form / "Enquire Now" submissions.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { productId, ...rest } = parsed.data;

    const enquiry = await Enquiry.create({
      ...rest,
      product: productId || undefined,
    });

    return createdResponse({
      message: 'Enquiry submitted successfully',
      enquiryId: enquiry._id,
    });
  } catch (error) {
    console.error('POST /api/enquiries error:', error);
    return errorResponse('Failed to submit enquiry');
  }
}

/**
 * PATCH /api/enquiries
 * Update enquiry status by id (admin). Pass { id, status } in body.
 */
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return validationError('Enquiry ID is required');
    }

    const parsed = updateEnquiryStatusSchema.safeParse(rest);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const enquiry = await Enquiry.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();

    if (!enquiry) {
      return errorResponse('Enquiry not found', 'NOT_FOUND', 404);
    }

    return successResponse(enquiry);
  } catch (error) {
    console.error('PATCH /api/enquiries error:', error);
    return errorResponse('Failed to update enquiry');
  }
}
