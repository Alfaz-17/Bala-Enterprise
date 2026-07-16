import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a base64 string or file buffer to Cloudinary.
 *
 * @param fileUri - base64 data URI or file path string
 * @param folder - destination folder in Cloudinary
 */
export async function uploadToCloudinary(fileUri: string, folder = 'bala-enterprise') {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Deletes an asset from Cloudinary using its public ID.
 *
 * @param publicId - public ID of the asset to delete
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export default cloudinary;
