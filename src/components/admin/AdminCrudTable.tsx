'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface AdminCrudTableProps<T extends { _id: string }> {
  title: string;
  columns: Column<T>[];
  data: T[];
  createHref?: string;
  onDelete?: (id: string) => Promise<void> | void;
  editHref?: (row: T) => string;
  filterSection?: React.ReactNode;
}

export default function AdminCrudTable<T extends { _id: string }>({
  title,
  columns,
  data,
  createHref,
  onDelete,
  editHref,
  filterSection,
}: AdminCrudTableProps<T>) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!onDelete) return;

    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>Delete this item?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeletingId(id);
              try {
                await onDelete(id);
                toast.success('Item deleted successfully');
              } catch (err: any) {
                toast.error(err.message || 'Failed to delete item');
              } finally {
                setDeletingId(null);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white text-xs font-medium hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border border-gray-400 text-xs font-medium hover:bg-gray-100 text-gray-700"
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 10000 }
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {title}
        </h1>
        {createHref && (
          <a
            href={createHref}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Add New
          </a>
        )}
      </div>

      {/* Filter Section */}
      {filterSection && <div className="mb-6">{filterSection}</div>}

      {/* Table */}
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`text-left px-4 py-3 font-medium text-muted-foreground ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {(editHref || onDelete) && (
                <th className="text-right px-4 py-3 font-medium text-muted-foreground w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-12 text-muted-foreground"
                >
                  No items found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                >
                  {columns.map((col, i) => (
                    <td key={i} className={`px-4 py-3 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                  {(editHref || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editHref && (
                          <button
                            onClick={() => router.push(editHref(row))}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(row._id)}
                            disabled={deletingId === row._id}
                            className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
