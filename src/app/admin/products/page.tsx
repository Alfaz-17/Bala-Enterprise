'use client';

import { useState, useEffect } from 'react';
import AdminCrudTable from '@/components/admin/AdminCrudTable';
import toast from 'react-hot-toast';

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
  const [syncing, setSyncing] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

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

  async function handleToggleMainProduct(product: ProductRow) {
    const newFeatured = !product.featured;

    // Optimistic update
    setTogglingIds((prev) => new Set(prev).add(product._id));
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, featured: newFeatured } : p))
    );

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        // Revert on failure
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, featured: !newFeatured } : p))
        );
        toast.error(json.error?.message || 'Failed to update product');
        return;
      }

      toast.success(
        newFeatured
          ? `"${product.name}" added to Main Products`
          : `"${product.name}" removed from Main Products`,
        { duration: 2000 }
      );
    } catch (err: any) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, featured: !newFeatured } : p))
      );
      toast.error(err.message || 'Failed to update product');
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
    }
  }

  async function handleSync() {
    setSyncing(true);
    const loadingToast = toast.loading('Syncing products with TradeIndia profile...');

    try {
      const res = await fetch('/api/admin/scrape-tradeindia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'profile',
          url: 'https://www.tradeindia.com/bala-enterprise-24235777/'
        }),
      });

      const json = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok || !json.success) {
        toast.error(json.error?.message || 'Sync failed.');
        return;
      }

      const added = json.data?.addedCount ?? json.addedCount ?? 0;
      const updated = json.data?.updatedCount ?? json.updatedCount ?? 0;
      const total = json.data?.importedTotal ?? json.importedTotal ?? 0;

      toast.success(
        `Sync completed! Processed ${total} products (${added} added, ${updated} updated).`,
        { duration: 5000 }
      );

      // Refresh list
      setLoading(true);
      const query = selectedCategory
        ? `/api/products?all=true&limit=100&category=${selectedCategory}`
        : '/api/products?all=true&limit=100';

      const refreshRes = await fetch(query);
      const refreshJson = await refreshRes.json();
      setProducts(refreshJson.data?.data || []);
      setLoading(false);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Sync failed.');
      setLoading(false);
    } finally {
      setSyncing(false);
    }
  }

  const filterSection = (
    <div className="flex items-center justify-between gap-4 bg-card border border-border p-4 flex-wrap">
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

      <div className="flex flex-col gap-1.5 justify-end">
        <label className="text-sm font-medium opacity-0">Sync Actions</label>
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="px-5 py-2 bg-[#D85A30] hover:bg-[#c24a24] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1.5 h-[38px] border-none font-sans cursor-pointer"
        >
          {syncing ? 'Syncing...' : 'Sync TradeIndia Profile'}
        </button>
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
          header: 'Main Product',
          accessor: (row) => (
            <button
              type="button"
              role="switch"
              aria-checked={row.featured}
              aria-label={`Toggle main product for ${row.name}`}
              disabled={togglingIds.has(row._id)}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMainProduct(row);
              }}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${togglingIds.has(row._id) ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                ${row.featured ? 'bg-[#D85A30]' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out
                  ${row.featured ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          ),
          className: 'w-28',
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

