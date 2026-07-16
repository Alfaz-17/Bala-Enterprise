'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface EnquiryRow {
  _id: string;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  message: string;
  sourcePage: string;
  status: string;
  product?: { name: string; slug: string };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  converted: 'bg-green-100 text-green-800',
  closed: 'bg-muted text-muted-foreground',
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  async function fetchEnquiries() {
    setLoading(true);
    const url = statusFilter
      ? `/api/enquiries?status=${statusFilter}&limit=50`
      : '/api/enquiries?limit=50';
    const res = await fetch(url);
    const json = await res.json();
    setEnquiries(json.data?.data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const promise = fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).then(async (res) => {
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to update status');
    });

    toast.promise(promise, {
      loading: 'Updating status...',
      success: 'Status updated successfully',
      error: (err) => err.message || 'Failed to update status',
    });

    try {
      await promise;
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status } : e))
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Enquiries
        </h1>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : (
        <div className="bg-card border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-36">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr
                    key={enq._id}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{enq.name}</div>
                      {enq.companyName && (
                        <div className="text-xs text-muted-foreground">{enq.companyName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{enq.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {enq.product?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{enq.sourcePage}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={enq.status}
                        onChange={(e) => updateStatus(enq._id, e.target.value)}
                        className={`text-xs px-2 py-1 font-medium border-0 cursor-pointer focus:ring-2 focus:ring-primary ${
                          statusColors[enq.status] || ''
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
