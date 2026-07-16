import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary', () => {
  return {
    v2: {
      config: jest.fn(),
      uploader: {
        upload: jest.fn().mockResolvedValue({
          secure_url: 'https://res.cloudinary.com/test/image/upload/v1/img.jpg',
          public_id: 'test/img',
        }),
        destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
      },
    },
  };
});

describe('Cloudinary Utilities', () => {
  it('should upload image base64 URI successfully', async () => {
    const fileUri = 'data:image/png;base64,iVBORw0KGgo=';
    const result = await uploadToCloudinary(fileUri, 'test-folder');

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(fileUri, {
      folder: 'test-folder',
      resource_type: 'auto',
    });
    expect(result).toEqual({
      url: 'https://res.cloudinary.com/test/image/upload/v1/img.jpg',
      publicId: 'test/img',
    });
  });

  it('should delete asset successfully', async () => {
    const publicId = 'test/img';
    const result = await deleteFromCloudinary(publicId);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(publicId);
    expect(result).toEqual({ result: 'ok' });
  });
});
