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
  thumbnail?: string | null;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch categories once on mount
  useEffect(() => {
    fetch('/api/categories?all=true')
      .then((r) => r.json())
      .then((json) => {
        setCategories(json.data || []);
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products when selected category changes
  useEffect(() => {
    setLoading(true);
    const query = selectedCategory
      ? `/api/products?all=true&limit=100&category=${selectedCategory}`
      : '/api/products?all=true&limit=100';

    fetch(query)
      .then((r) => r.json())
      .then((json) => {
        setProducts(json.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [selectedCategory]);

  async function handleDelete(id: string) {
    const prod = products.find((p) => p._id === id);
    if (!prod) return;
    
    const res = await fetch(`/api/products/${prod.slug}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to delete product');
    }
    
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  const filterSection = (
    <div className="flex items-center gap-4 bg-card border border-border p-4">
      <div className="flex flex-col gap-1.5 w-64">
        <label htmlFor="categoryFilter" className="text-sm font-medium text-foreground">
          Filter by Category
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  if (loading && products.length === 0) {
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
      filterSection={filterSection}
      columns={[
        {
          header: 'Image',
          accessor: (row) => (
            row.thumbnail ? (
              <div className="relative w-10 h-10 bg-muted overflow-hidden border border-border">
                <img
                  src={row.thumbnail}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground">
                No Image
              </div>
            )
          ),
          className: 'w-16',
        },
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
