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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="text-[#D85A30] text-xs uppercase tracking-wider font-semibold">
                {product.category?.name}
              </span>
              <h1 className="font-heading text-3xl font-bold text-[#1A1A18] mt-1">
                {product.name}
              </h1>
              {product.modelNumber && (
                <p className="text-xs text-[#888780] mt-1">Model: {product.modelNumber}</p>
              )}
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
