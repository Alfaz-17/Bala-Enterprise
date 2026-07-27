/**
 * Client-side helper to upload a File to the backend /api/upload endpoint.
 * Returns the secure Cloudinary URL.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

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
