'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminCrudTable from '@/components/admin/AdminCrudTable';

interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  status: string;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch('/api/categories?all=true');
    const json = await res.json();
    setCategories(json.data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const cat = categories.find((c) => c._id === id);
    if (!cat) return;
    
    const res = await fetch(`/api/categories/${cat.slug}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to delete category');
    }
    
    setCategories((prev) => prev.filter((c) => c._id !== id));
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
      title="Categories"
      createHref="/admin/categories/new"
      editHref={(row) => `/admin/categories/${row._id}/edit`}
      onDelete={handleDelete}
      columns={[
        { header: 'Name', accessor: 'name' },
        { header: 'Slug', accessor: 'slug', className: 'text-muted-foreground' },
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
        },
        { header: 'Order', accessor: 'sortOrder', className: 'w-20' },
      ]}
      data={categories}
    />
  );
}
