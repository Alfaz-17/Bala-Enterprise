'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface EnquiryFormProps {
  sourcePage: string;
  productId?: string;
  defaultMessage?: string;
  onSuccess?: () => void;
}

export default function EnquiryForm({
  sourcePage,
  productId,
  defaultMessage = '',
  onSuccess,
}: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get('name') as string,
      companyName: formData.get('companyName') as string || undefined,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || undefined,
      message: formData.get('message') as string,
      productId,
      sourcePage,
    };

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Failed to submit enquiry');
      }

      toast.success('We received your request! Our team will call you back shortly.');
      e.currentTarget.reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-name" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A18] mb-1">
            Your Name *
          </label>
          <input
            id="form-name"
            name="name"
            required
            suppressHydrationWarning
            placeholder="e.g. Rakesh Patel"
            className="w-full min-h-12 px-3 py-2 border border-border bg-white text-[#1A1A18] text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D85A30] focus:border-[#D85A30] rounded-sm"
          />
        </div>

        <div>
          <label htmlFor="form-company" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A18] mb-1">
            Company Name
          </label>
          <input
            id="form-company"
            name="companyName"
            suppressHydrationWarning
            placeholder="e.g. ABC Industries"
            className="w-full min-h-12 px-3 py-2 border border-border bg-white text-[#1A1A18] text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D85A30] focus:border-[#D85A30] rounded-sm"
          />
        </div>

        <div>
          <label htmlFor="form-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A18] mb-1">
            Phone / Mobile *
          </label>
          <input
            id="form-phone"
            name="phone"
            required
            suppressHydrationWarning
            type="tel"
            placeholder="e.g. 98765 43210"
            className="w-full min-h-12 px-3 py-2 border border-border bg-white text-[#1A1A18] text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D85A30] focus:border-[#D85A30] rounded-sm"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A18] mb-1">
            Email Address
          </label>
          <input
            id="form-email"
            name="email"
            type="email"
            suppressHydrationWarning
            placeholder="e.g. info@abcindustries.com"
            className="w-full min-h-12 px-3 py-2 border border-border bg-white text-[#1A1A18] text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D85A30] focus:border-[#D85A30] rounded-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="form-message" className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A18] mb-1">
          Lifting requirements *
        </label>
        <textarea
          id="form-message"
          name="message"
          required
          suppressHydrationWarning
          rows={4}
          defaultValue={defaultMessage}
          placeholder="e.g. We need a 10-ton EOT crane with 18 meters span for our workshop in Gujarat."
          className="w-full px-3 py-2 border border-border bg-white text-[#1A1A18] text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D85A30] focus:border-[#D85A30] rounded-sm resize-y"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          suppressHydrationWarning
          className="w-full sm:w-auto min-h-12 px-8 py-3 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors disabled:opacity-50 rounded-sm shadow-sm"
        >
          {loading ? 'Submitting...' : 'Send Enquiry'}
        </button>
      </div>
    </form>
  );
}
