import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import ImageGallery from '@/components/public/ImageGallery';
import ProductQuoteModal from '@/components/public/ProductQuoteModal';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductDetails(slug: string) {
  await connectToDatabase();

  const product = await Product.findOne({ slug, status: 'active' })
    .populate('category', 'name slug')
    .lean();

  if (!product) return null;

  const images = await ProductImage.find({ product: product._id })
    .sort({ sortOrder: 1 })
    .select('url isPrimary altText')
    .lean();

  return {
    ...product,
    _id: String(product._id),
    category: product.category
      ? {
          name: (product.category as any).name,
          slug: (product.category as any).slug,
        }
      : undefined,
    images: images.map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      altText: img.altText,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    return {
      title: 'Equipment Not Found | Bala Enterprise',
    };
  }

  const capacityInfo = product.capacity ? ` (${product.capacity})` : '';
  return {
    title: `${product.name}${capacityInfo} Specifications | Bala Enterprise`,
    description:
      product.shortDescription ||
      `Get price quotes, dimensions, drawing layouts and engineering details for the ${product.name} industrial lift system.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header (Slanted High-Contrast Style) */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Slanted Design Background shape */}
        <div className="absolute top-0 right-0 h-full w-[45%] bg-[#D85A30] origin-top-right transform skew-x-[-15deg] translate-x-[15%] z-0 hidden lg:block" />
        <div className="absolute inset-0 bg-[#D85A30] z-0 lg:hidden opacity-90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[#D85A30] lg:text-primary text-xs uppercase tracking-[0.2em] font-bold block">
              {product.category?.name || 'Equipment Specifications'}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
              {product.name}
            </h1>
            {product.modelNumber && (
              <p className="text-sm text-white/80 max-w-xl">Model Number: {product.modelNumber}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-[13px] text-[#888780] mb-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#1A1A18] font-semibold truncate max-w-[200px] md:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Images Section */}
          <div className="lg:col-span-6">
            <ImageGallery images={product.images || []} title={product.name} />
          </div>

          {/* Details Section */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D85A30] font-bold">
                Equipment Summary
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#1A1A18] mt-1">
                Engineering Specifications
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.capacity && (
                <div className="bg-[#F5F4F0] border border-border px-3 py-1.5 text-xs font-semibold text-[#1A1A18]">
                  Capacity: {product.capacity}
                </div>
              )}
              {product.span && (
                <div className="bg-[#F5F4F0] border border-border px-3 py-1.5 text-xs font-semibold text-[#1A1A18]">
                  Span: {product.span}
                </div>
              )}
            </div>

            {product.fullDescription && (
              <div className="text-sm text-[#888780] leading-relaxed whitespace-pre-wrap">
                {product.fullDescription}
              </div>
            )}

            {/* Price Display / CTA */}
            <div className="border-t border-b border-border py-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[10px] text-[#888780] uppercase tracking-wider">Pricing</p>
                <p className="text-xl font-bold text-[#1A1A18] mt-0.5">
                  {product.priceDisplay || 'Price on Request'}
                </p>
              </div>
              <ProductQuoteModal
                productName={product.name}
                productId={product._id}
                slug={product.slug}
              />
            </div>

            {/* Specifications List */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-[#1A1A18] border-b border-border pb-2">
                  Technical Specifications
                </h3>
                <div className="border border-border">
                  <table className="w-full text-xs">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val], i) => (
                        <tr key={key} className={i % 2 === 0 ? 'bg-[#F5F4F0]' : 'bg-white'}>
                          <td className="px-4 py-3 font-medium text-[#1A1A18] w-1/3 border-r border-border">{key}</td>
                          <td className="px-4 py-3 text-[#888780]">{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
