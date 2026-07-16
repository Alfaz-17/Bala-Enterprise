'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [source, setSource] = useState<'google' | 'manual' | 'indiamart'>('manual');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/testimonials/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const t = json.data;
          setClientName(t.clientName || '');
          setCompanyName(t.companyName || '');
          setRating(t.rating || 5);
          setReviewText(t.reviewText || '');
          setSource(t.source || 'manual');
          setStatus(t.status || 'active');
        } else {
          toast.error('Failed to load testimonial details');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error loading testimonial details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      clientName,
      companyName: companyName || undefined,
      rating,
      reviewText,
      source,
      status,
    };

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message || 'Failed to update testimonial');
        return;
      }

      toast.success('Testimonial updated successfully');
      router.push('/admin/testimonials');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update testimonial');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading testimonial details...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Edit Testimonial
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border p-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-foreground mb-1">
            Client Name *
          </label>
          <input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. John Doe"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-1">
            Company Name
          </label>
          <input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1">
              Rating *
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value) || 5)}
              required
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-foreground mb-1">
              Source
            </label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value as 'manual' | 'google' | 'indiamart')}
              className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="manual">Manual Entry</option>
              <option value="google">Google Reviews</option>
              <option value="indiamart">IndiaMart</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-foreground mb-1">
            Review Text *
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            rows={5}
            className="w-full px-3 py-2 border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            placeholder="Feedback content..."
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
            onClick={() => router.push('/admin/testimonials')}
            className="px-5 py-2 border border-input hover:bg-accent transition-colors text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
