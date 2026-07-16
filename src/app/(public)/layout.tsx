import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StickyMobileCTA from '@/components/public/StickyMobileCTA';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col pb-[56px] md:pb-0">
      <Header />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
