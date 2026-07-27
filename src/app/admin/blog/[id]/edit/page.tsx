'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { uploadImage } from '@/lib/upload-client';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blog/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const post = json.data;
          setTitle(post.title || '');
          setSlug(post.slug || '');
          setFeaturedImage(post.featuredImage || '');
          setContent(post.content || '');
          setMetaDescription(post.metaDescription || '');
          setStatus(post.status || 'draft');

          if (post.publishedAt) {
            // Format to datetime-local expected string: YYYY-MM-DDTHH:MM
            const dateObj = new Date(post.publishedAt);
            const offset = dateObj.getTimezoneOffset() * 60000;
            const localISOTime = new Date(dateObj.getTime() - offset).toISOString().slice(0, 16);
            setPublishedAt(localISOTime);
          } else {
            setPublishedAt('');
          }
        } else {
          toast.error('Failed to load blog post details');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error loading blog post details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = featuredImage;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const body = {
        title,
        slug,
        content,
        featuredImage: finalImageUrl || undefined,
        metaDescription: metaDescription || undefined,
        status,
        publishedAt: status === 'published' 
          ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString())
          : undefined,
      };

      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message || 'Failed to update blog post');
        return;
      }

      toast.success('Blog post updated successfully');
      router.push('/admin/blog');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update blog post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading blog post details...</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Edit Blog Post
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

        <ImageUpload
          label="Featured Image"
          value={featuredImage}
          onChange={setFeaturedImage}
          onFileReady={setImageFile}
          uploading={saving}
        />

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
            placeholder="Write blog content in HTML or plain text..."
          />
        </div>

        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-foreground mb-1">
            Meta Description (for SEO)
          </label>
          <input
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={300}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Brief summary of the post..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {status === 'published' && (
            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-foreground mb-1">
                Publish Date
              </label>
              <input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
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
            onClick={() => router.push('/admin/blog')}
            className="px-5 py-2 border border-input hover:bg-accent transition-colors text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
