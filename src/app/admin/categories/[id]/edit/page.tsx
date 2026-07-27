'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { uploadImage } from '@/lib/upload-client';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/categories/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const category = json.data;
          setName(category.name || '');
          setSlug(category.slug || '');
          setDescription(category.description || '');
          setImageUrl(category.imageUrl || '');
          setSortOrder(category.sortOrder || 0);
          setStatus(category.status || 'active');
        } else {
          toast.error('Failed to load category');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load category');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const body = {
        name,
        slug,
        description,
        imageUrl: finalImageUrl || undefined,
        sortOrder,
        status,
      };

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message || 'Failed to update category');
        return;
      }

      toast.success('Category updated successfully');
      router.push('/admin/categories');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading category details...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Edit Category
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
            Name *
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <ImageUpload
          label="Category Image"
          value={imageUrl}
          onChange={setImageUrl}
          onFileReady={setImageFile}
          uploading={saving}
        />

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-foreground mb-1">
            Sort Order
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
            onClick={() => router.push('/admin/categories')}
            className="px-5 py-2 border border-input hover:bg-accent transition-colors text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
