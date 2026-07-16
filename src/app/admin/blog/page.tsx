'use client';

import { useState, useEffect } from 'react';
import AdminCrudTable from '@/components/admin/AdminCrudTable';

interface BlogRow {
  _id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt?: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?all=true&limit=50')
      .then((r) => r.json())
      .then((json) => {
        setPosts(json.data?.data || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    const post = posts.find((p) => p._id === id);
    if (!post) return;
    await fetch(`/api/blog/${post.slug}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p._id !== id));
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
      title="Blog Posts"
      createHref="/admin/blog/new"
      editHref={(row) => `/admin/blog/${row._id}/edit`}
      onDelete={handleDelete}
      columns={[
        { header: 'Title', accessor: 'title' },
        { header: 'Slug', accessor: 'slug', className: 'text-muted-foreground' },
        {
          header: 'Status',
          accessor: (row) => (
            <span
              className={`text-xs px-2 py-0.5 font-medium ${
                row.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {row.status}
            </span>
          ),
          className: 'w-28',
        },
        {
          header: 'Published',
          accessor: (row) =>
            row.publishedAt
              ? new Date(row.publishedAt).toLocaleDateString()
              : '—',
          className: 'w-32',
        },
      ]}
      data={posts}
    />
  );
}
