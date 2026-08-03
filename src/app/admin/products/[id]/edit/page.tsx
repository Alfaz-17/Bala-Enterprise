'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import ProductPreview from '@/components/admin/ProductPreview';
import { Sparkles, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/upload-client';

interface CategoryItem {
  _id: string;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [firstFile, setFirstFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;

    // Load categories first
    fetch('/api/categories?all=true')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      })
      .then(() => {
        // Load product details
        return fetch(`/api/products/${id}`);
      })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const product = json.data;
          setName(product.name || '');
          setSlug(product.slug || '');
          setCategoryId(product.category?._id || product.category || '');
          setModelNumber(product.modelNumber || '');
          setCapacity(product.capacity || '');
          setSpan(product.span || '');
          setPriceDisplay(product.priceDisplay || '');
          setShortDescription(product.shortDescription || '');
          setFullDescription(product.fullDescription || '');
          setFeatured(product.featured || false);
          setStatus(product.status || 'active');

          if (Array.isArray(product.images)) {
            const urls = product.images.map((img: any) => img.url);
            setImages(urls);
            setImageFiles(new Array(urls.length).fill(null));
          }
        } else {
          toast.error('Failed to load product details');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error loading product details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

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
        images: uploadedUrls.filter(Boolean),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message || 'Failed to update product');
        return;
      }

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update product');
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
    if (index === 0) setFirstFile(null);
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
    if (index === 0) {
      setFirstFile(file);
    }
  }

  // --- AI Auto-Fill ---
  async function handleAiAnalyze() {
    const firstImageUrl = images.find(Boolean);

    if (!firstImageUrl && !firstFile) {
      toast.error('Upload at least one image first to use AI analysis');
      return;
    }

    setAnalyzing(true);

    try {
      let fileToSend: File;

      if (firstFile) {
        fileToSend = firstFile;
      } else if (firstImageUrl) {
        const response = await fetch(firstImageUrl);
        const blob = await response.blob();
        fileToSend = new File([blob], 'product-image.jpg', { type: blob.type });
      } else {
        toast.error('No image available for analysis');
        return;
      }

      const formData = new FormData();
      formData.append('file', fileToSend);

      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        toast.error(json.error?.message || 'AI analysis failed');
        return;
      }

      const data = json.data;

      if (data.name) setName(data.name);
      if (data.slug) setSlug(data.slug);
      if (data.shortDescription) setShortDescription(data.shortDescription);
      if (data.fullDescription) setFullDescription(data.fullDescription);
      if (data.capacity) setCapacity(data.capacity);
      if (data.modelNumber) setModelNumber(data.modelNumber);
      if (data.span) setSpan(data.span);

      if (data.categoryName) {
        const match = categories.find(
          (c) =>
            c.name.toLowerCase() === data.categoryName.toLowerCase() ||
            c.name.toLowerCase().includes(data.categoryName.toLowerCase()) ||
            data.categoryName.toLowerCase().includes(c.name.toLowerCase())
        );
        if (match) {
          setCategoryId(match._id);
          toast.success(
            `AI auto-filled fields & matched category: "${match.name}"`,
            { duration: 4000 }
          );
        } else {
          toast.success(
            `AI auto-filled fields. Suggested category "${data.categoryName}" — please select manually.`,
            { duration: 5000 }
          );
        }
      } else {
        toast.success('AI auto-filled product details!', { duration: 3000 });
      }
    } catch (err: any) {
      console.error('AI analysis error:', err);
      toast.error(err.message || 'AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  const selectedCategoryName = categories.find((c) => c._id === categoryId)?.name;

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading product details...</div>;
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Form */}
      <div className="flex-1 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6">
          {/* AI Auto-Fill Banner */}
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20">
            <div>
              <p className="text-sm font-medium text-foreground">
                ✨ AI-Powered Auto-Fill
              </p>
              <p className="text-xs text-muted-foreground">
                Analyze product image to re-generate details with AI
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiAnalyze}
              disabled={analyzing || (!images.some(Boolean) && !firstFile)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI Auto-Fill
                </>
              )}
            </button>
          </div>

          {/* Multiple Product Images - TOP */}
          <div className="space-y-4 pb-4 border-b border-border">
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
              <div
                className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-input cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
                onClick={addImageField}
              >
                <p className="text-sm text-muted-foreground">
                  Click here to add your first product image
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {images.map((imgUrl, index) => (
                  <div key={index} className="flex gap-4 items-end border border-border bg-accent/20 p-4">
                    <div className="flex-1">
                      <ImageUpload
                        label={`Image #${index + 1} ${index === 0 ? '(Primary / Cover)' : ''}`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
                Category *
              </label>
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
              {saving ? 'Saving...' : 'Save Changes'}
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

      {/* Sticky Preview Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0 sticky top-6">
        <ProductPreview
          name={name}
          images={images}
          capacity={capacity}
          shortDescription={shortDescription}
          featured={featured}
          status={status}
          categoryName={selectedCategoryName}
          modelNumber={modelNumber}
          priceDisplay={priceDisplay}
        />
      </div>
    </div>
  );
}
