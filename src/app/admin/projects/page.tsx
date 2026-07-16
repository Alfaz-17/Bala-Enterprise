'use client';

import { useState, useEffect } from 'react';
import AdminCrudTable from '@/components/admin/AdminCrudTable';

interface ProjectRow {
  _id: string;
  title: string;
  slug: string;
  industryType?: string;
  location?: string;
  status: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects?all=true&limit=50')
      .then((r) => r.json())
      .then((json) => {
        setProjects(json.data?.data || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    const proj = projects.find((p) => p._id === id);
    if (!proj) return;
    await fetch(`/api/projects/${proj.slug}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p._id !== id));
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
      title="Projects"
      createHref="/admin/projects/new"
      editHref={(row) => `/admin/projects/${row._id}/edit`}
      onDelete={handleDelete}
      columns={[
        { header: 'Title', accessor: 'title' },
        { header: 'Industry', accessor: 'industryType' },
        { header: 'Location', accessor: 'location' },
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
      data={projects}
    />
  );
}
