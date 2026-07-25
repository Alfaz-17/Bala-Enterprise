'use client';

import { useState, useEffect } from 'react';
import AdminCrudTable from '@/components/admin/AdminCrudTable';

interface TestimonialRow {
  _id: string;
  clientName: string;
  companyName?: string;
  rating: number;
  source: string;
  status: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials?all=true')
      .then((r) => r.json())
      .then((json) => {
        setTestimonials(json.data || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to delete testimonial');
    }
    setTestimonials((prev) => prev.filter((t) => t._id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <AdminCrudTable
      title="Testimonials"
      createHref="/admin/testimonials/new"
      editHref={(row) => `/admin/testimonials/${row._id}/edit`}
      onDelete={handleDelete}
      columns={[
        { header: 'Client', accessor: 'clientName' },
        { header: 'Company', accessor: 'companyName' },
        {
          header: 'Rating',
          accessor: (row) => (
            <span className="text-primary font-medium">
              {'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}
            </span>
          ),
          className: 'w-32',
        },
        { header: 'Source', accessor: 'source', className: 'w-28' },
        {
          header: 'Status',
          accessor: (row) => (
            <span
              className={`text-xs px-2 py-0.5 font-medium ${
                row.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {row.status}
            </span>
          ),
          className: 'w-24',
        },
      ]}
      data={testimonials}
    />
  );
}
