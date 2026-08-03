'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { uploadImage } from '@/lib/upload-client';

interface ProductItem {
  _id: string;
  name: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [clientName, setClientName] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [location, setLocation] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [productId, setProductId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Load products first
    fetch('/api/products?all=true&limit=100')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && Array.isArray(json.data.data)) {
          setProducts(json.data.data);
        }
      })
      .then(() => {
        // Load project details
        return fetch(`/api/projects/${id}`);
      })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const project = json.data;
          setTitle(project.title || '');
          setSlug(project.slug || '');
          setClientName(project.clientName || '');
          setIndustryType(project.industryType || '');
          setLocation(project.location || '');
          setProductId(project.product?._id || project.product || '');
          setDescription(project.description || '');
          setStatus(project.status || 'active');

          if (project.completedDate) {
            // format date string YYYY-MM-DD
            const dateObj = new Date(project.completedDate);
            const formatted = dateObj.toISOString().split('T')[0];
            setCompletedDate(formatted);
          } else {
            setCompletedDate('');
          }

          if (Array.isArray(project.images)) {
            const urls = project.images.map((img: any) => img.url);
            setImages(urls);
            setImageFiles(new Array(urls.length).fill(null));
          }
        } else {
          toast.error('Failed to load project details');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error loading project details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const uploadedUrls = [...images];
      const uploadPromises = imageFiles.map(async (file, i) => {
        if (file) {
          uploadedUrls[i] = await uploadImage(file);
        }
      });
      await Promise.all(uploadPromises);

      const body = {
        title,
        slug,
        clientName: clientName || undefined,
        industryType: industryType || undefined,
        location: location || undefined,
        completedDate: completedDate || undefined,
        productId: productId || undefined,
        description: description || undefined,
        status,
        images: uploadedUrls.filter(Boolean),
      };

      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message || 'Failed to update project');
        return;
      }

      toast.success('Project updated successfully');
      router.push('/admin/projects');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  }

  function addImageField() {
    setImages((prev) => [...prev, '']);
    setImageFiles((prev) => [...prev, null]);
  }

  function removeImageField(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleImageChange(index: number, val: string) {
    setImages((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }

  function handleFileReady(index: number, file: File | null) {
    setImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading project details...</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Edit Project
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
              Title *
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
              Slug *
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-foreground mb-1">
              Client Name
            </label>
            <input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Reliance Industries"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="industryType" className="block text-sm font-medium text-foreground mb-1">
              Industry Type
            </label>
            <input
              id="industryType"
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
              placeholder="e.g. Steel Plant, Infrastructure"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
              Location
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="completedDate" className="block text-sm font-medium text-foreground mb-1">
              Completed Date
            </label>
            <input
              id="completedDate"
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-foreground mb-1">
              Linked Product
            </label>
            <select
              id="product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— Select Linked Product (Optional) —</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Multiple Project Images */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Project Images</h3>
            <button
              type="button"
              onClick={addImageField}
              className="text-xs px-2.5 py-1.5 bg-muted border border-input hover:bg-accent text-foreground transition-colors font-medium"
            >
              + Add Image
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-xs text-muted-foreground">No images added yet. Click "+ Add Image" above.</p>
          ) : (
            <div className="space-y-4">
              {images.map((imgUrl, index) => (
                <div key={index} className="flex gap-4 items-end border border-border bg-accent/20 p-4">
                  <div className="flex-1">
                    <ImageUpload
                      label={`Image #${index + 1}`}
                      value={imgUrl}
                      onChange={(val) => handleImageChange(index, val)}
                      onFileReady={(file) => handleFileReady(index, file)}
                      uploading={saving}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium h-[42px] flex items-center justify-center"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-5 py-2 border border-input hover:bg-accent transition-colors text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
