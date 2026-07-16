'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface CategoryItem {
  _id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [span, setSpan] = useState('');
  const [priceDisplay, setPriceDisplay] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [images, setImages] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
          if (json.data.length > 0) {
            setCategoryId(json.data[0]._id);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setCategoriesLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    setSaving(true);

    const body = {
      name,
      slug,
      categoryId,
      modelNumber: modelNumber || undefined,
      capacity: capacity || undefined,
      span: span || undefined,
      priceDisplay: priceDisplay || undefined,
      shortDescription: shortDescription || undefined,
      fullDescription: fullDescription || undefined,
      featured,
      status,
      images: images.filter(Boolean), // remove empty image URLs
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message || 'Failed to create product');
        return;
      }

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create product');
    } finally {
      setSaving(false);
    }
  }

  function addImageField() {
    setImages((prev) => [...prev, '']);
  }

  function removeImageField(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleImageChange(index: number, val: string) {
    setImages((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Name *
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Simple auto-slug generation
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
              }}
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
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
              Category *
            </label>
            {categoriesLoading ? (
              <div className="text-sm text-muted-foreground py-2">Loading categories...</div>
            ) : (
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="modelNumber" className="block text-sm font-medium text-foreground mb-1">
              Model Number
            </label>
            <input
              id="modelNumber"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              placeholder="e.g. BE-50T"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-foreground mb-1">
              Capacity
            </label>
            <input
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 5 Ton to 100 Ton"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="span" className="block text-sm font-medium text-foreground mb-1">
              Span
            </label>
            <input
              id="span"
              value={span}
              onChange={(e) => setSpan(e.target.value)}
              placeholder="e.g. 10m to 40m"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="priceDisplay" className="block text-sm font-medium text-foreground mb-1">
              Price Display Text
            </label>
            <input
              id="priceDisplay"
              value={priceDisplay}
              onChange={(e) => setPriceDisplay(e.target.value)}
              placeholder="e.g. On Request"
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-foreground mb-1">
            Short Description
          </label>
          <input
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            maxLength={500}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="fullDescription" className="block text-sm font-medium text-foreground mb-1">
            Full Description
          </label>
          <textarea
            id="fullDescription"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Multiple Product Images */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Product Images</h3>
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
                      label={`Image #${index + 1} ${index === 0 ? '(Primary / Cover)' : ''}`}
                      value={imgUrl}
                      onChange={(val) => handleImageChange(index, val)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              id="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm font-medium text-foreground select-none cursor-pointer">
              Feature this product on homepage
            </label>
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
        </div>

        <div className="flex gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-5 py-2 border border-input hover:bg-accent transition-colors text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
