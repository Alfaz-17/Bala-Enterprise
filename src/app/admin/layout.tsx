import AdminSessionProvider from '@/components/admin/SessionProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminToaster } from '@/components/admin/AdminToaster';

export const metadata = {
  title: 'Admin | Bala Enterprise',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      <div className="min-h-screen bg-secondary">
        <AdminSidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <AdminToaster />
    </AdminSessionProvider>
  );
}
