import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { Enquiry } from '@/models/Enquiry';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  successResponse,
  notFoundError,
  unauthorizedError,
  errorResponse,
} from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/enquiries/:id
 * Delete an enquiry by ID (admin).
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return unauthorizedError('You must be logged in as an administrator');
    }

    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return notFoundError('Invalid ID format');
    }

    const enquiry = await Enquiry.findByIdAndDelete(id).lean();

    if (!enquiry) {
      return notFoundError('Enquiry not found');
    }

    return successResponse({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/enquiries/[id] error:', error);
    return errorResponse('Failed to delete enquiry');
  }
}
