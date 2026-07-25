import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { analyzeProductImage } from '@/lib/gemini';
import {
  successResponse,
  errorResponse,
  unauthorizedError,
  validationError,
} from '@/lib/api-response';

/**
 * POST /api/ai-analyze
 * Accepts an image file (multipart/form-data), sends it to Gemini AI,
 * and returns suggested product details.
 * Protected — admin only.
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return unauthorizedError('You must be logged in to use AI analysis');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return validationError('No image file was provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return validationError(
        'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.'
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get existing categories for better AI suggestions
    await connectToDatabase();
    const categories = await Category.find({ status: 'active' })
      .select('name')
      .lean();
    const categoryNames = categories.map((c) => c.name);

    // Analyze with Gemini
    const analysis = await analyzeProductImage(buffer, file.type, categoryNames);

    return successResponse(analysis);
  } catch (error: any) {
    console.error('POST /api/ai-analyze error:', error);
    return errorResponse(error.message || 'AI analysis failed', 'AI_ERROR', 500);
  }
}
