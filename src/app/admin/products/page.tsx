'use client';

import { useState, useEffect } from 'react';
import AdminCrudTable from '@/components/admin/AdminCrudTable';

interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  capacity?: string;
  status: string;
  featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?all=true&limit=50')
      .then((r) => r.json())
      .then((json) => {
        setProducts(json.data?.data || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    const prod = products.find((p) => p._id === id);
    if (!prod) return;
    await fetch(`/api/products/${prod.slug}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p._id !== id));
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
      title="Products"
      createHref="/admin/products/new"
      editHref={(row) => `/admin/products/${row._id}/edit`}
      onDelete={handleDelete}
      columns={[
        { header: 'Name', accessor: 'name' },
        { header: 'Slug', accessor: 'slug', className: 'text-muted-foreground' },
        { header: 'Capacity', accessor: 'capacity' },
        {
          header: 'Featured',
          accessor: (row) => (
            <span
              className={`text-xs px-2 py-0.5 font-medium ${
                row.featured
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {row.featured ? 'Yes' : 'No'}
            </span>
          ),
          className: 'w-24',
        },
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
      data={products}
    />
  );
}
