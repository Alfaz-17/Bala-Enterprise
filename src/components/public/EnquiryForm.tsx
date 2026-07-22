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
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-name" className="label-tech !text-white/80 block mb-1.5">
            Your Name *
          </label>
          <input
            id="form-name"
            name="name"
            required
            suppressHydrationWarning
            placeholder="e.g. Rakesh Patel"
            className="w-full min-h-12 px-4 py-2.5 bg-white/5 border border-white/20 text-white placeholder:text-white/40 text-xs font-sans focus:outline-none focus:border-[#D85A30] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="form-company" className="label-tech !text-white/80 block mb-1.5">
            Company Name
          </label>
          <input
            id="form-company"
            name="companyName"
            suppressHydrationWarning
            placeholder="e.g. ABC Steel Industries"
            className="w-full min-h-12 px-4 py-2.5 bg-white/5 border border-white/20 text-white placeholder:text-white/40 text-xs font-sans focus:outline-none focus:border-[#D85A30] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="form-phone" className="label-tech !text-white/80 block mb-1.5">
            Mobile / Phone *
          </label>
          <input
            id="form-phone"
            name="phone"
            required
            suppressHydrationWarning
            type="tel"
            placeholder="e.g. 98765 43210"
            className="w-full min-h-12 px-4 py-2.5 bg-white/5 border border-white/20 text-white placeholder:text-white/40 text-xs font-sans focus:outline-none focus:border-[#D85A30] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="label-tech !text-white/80 block mb-1.5">
            Email Address
          </label>
          <input
            id="form-email"
            name="email"
            type="email"
            suppressHydrationWarning
            placeholder="e.g. info@abcsteel.com"
            className="w-full min-h-12 px-4 py-2.5 bg-white/5 border border-white/20 text-white placeholder:text-white/40 text-xs font-sans focus:outline-none focus:border-[#D85A30] transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="form-message" className="label-tech !text-white/80 block mb-1.5">
          Your Requirement / Message *
        </label>
        <textarea
          id="form-message"
          name="message"
          required
          suppressHydrationWarning
          rows={4}
          defaultValue={defaultMessage}
          placeholder="e.g. We need a 10-ton EOT crane with 18 meters span for our workshop in Gujarat."
          className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder:text-white/40 text-xs font-sans focus:outline-none focus:border-[#D85A30] transition-colors resize-y"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          suppressHydrationWarning
          className="w-full sm:w-auto min-h-12 px-8 py-3 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c24a24] transition-colors disabled:opacity-50 shadow-md"
        >
          {loading ? 'Submitting...' : 'Submit Price Enquiry'}
        </button>
      </div>
    </form>
  );
}
