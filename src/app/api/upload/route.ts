import { NextRequest } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { successResponse, errorResponse, validationError } from '@/lib/api-response';

export const maxDuration = 60; // 60 seconds (max default on Vercel Hobby)

/**
 * POST /api/upload
 * Accepts an image file (multipart/form-data) and uploads it to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return validationError('No file was provided');
    }

    // Convert file to buffer and then to base64 Data URI for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type;
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(fileUri, 'bala-enterprise-uploads');

    return successResponse({
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return errorResponse('Failed to upload image file');
  }
}
