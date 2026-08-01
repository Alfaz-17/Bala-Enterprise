import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Toaster } from 'react-hot-toast';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1A1A18',
            color: '#FFFFFF',
            borderRadius: '0px',
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#D85A30',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
}
