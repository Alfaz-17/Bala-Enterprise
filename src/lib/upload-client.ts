/**
 * Helper to compress an image file client-side using HTML5 Canvas.
 * Resizes the image to a maximum dimension of 1600px and compresses with 0.8 quality.
 */
function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.8): Promise<File> {
  if (typeof window === 'undefined') {
    return Promise.resolve(file);
  }

  // Only attempt to compress JPEG, PNG, or WebP images
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return Promise.resolve(file);
  }

  // Skip compression for images already smaller than 250KB to save CPU cycles
  if (file.size < 250 * 1024) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image to canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Only use the compressed file if it actually saves space
            if (compressedFile.size < file.size) {
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Client-side helper to upload a File to the backend /api/upload endpoint.
 * Returns the secure Cloudinary URL.
 */
export async function uploadImage(file: File): Promise<string> {
  // Compress image client-side before upload to speed up transmission
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file);
  } catch (err) {
    console.warn('Image compression failed, using original file:', err);
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!json.success || !json.data?.url) {
    throw new Error(json.error?.message || 'Failed to upload image file.');
  }

  return json.data.url;
}
