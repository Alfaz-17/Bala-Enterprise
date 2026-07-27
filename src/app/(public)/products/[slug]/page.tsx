import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import ImageGallery from '@/components/public/ImageGallery';
import ProductQuoteModal from '@/components/public/ProductQuoteModal';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    return {
      title: 'Equipment Not Found | Bala Enterprise',
    };
  }

  const capacityInfo = product.capacity ? ` - ${product.capacity}` : '';
  const title = `${product.name}${capacityInfo} | Bala Enterprise`;
  const description =
    product.shortDescription ||
    `Get price quotes, dimensions, drawing layouts and engineering details for the ${product.name} industrial lift system.`;
  const imageUrls = product.images?.map((img) => img.url) || [];

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.balaenterprise.in/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      images: imageUrls.map((url) => ({
        url,
        width: 1200,
        height: 1200,
        alt: `${product.name}${capacityInfo} - Bala Enterprise`,
      })),
      type: 'website',
      url: `https://www.balaenterprise.in/products/${product.slug}`,
      siteName: 'Bala Enterprise',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  const currentUrl = `https://www.balaenterprise.in/products/${product.slug}`;

  // Product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.fullDescription || product.shortDescription || '',
    image: product.images?.map((img) => img.url) || [],
    brand: { '@type': 'Brand', name: 'Bala Enterprise' },
    sku: product.modelNumber || product.slug,
    offers: {
      '@type': 'Offer',
      url: currentUrl,
      priceCurrency: 'INR',
      price: product.priceMin || 0,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Bala Enterprise' },
    },
    manufacturer: { '@type': 'Organization', name: 'Bala Enterprise' },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.balaenterprise.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://www.balaenterprise.in/products',
      },
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category.name,
              item: `https://www.balaenterprise.in/products?category=${product.category.slug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: product.category ? 4 : 3,
        name: product.name,
        item: currentUrl,
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen text-foreground relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 01. EDITORIAL HEADER BANNER */}
      <section className="relative bg-[#131312] text-white overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '2.5rem 2.5rem' 
          }} 
        />

        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#D85A30]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="section-container relative z-20">
          <div className="max-w-3xl space-y-3">
            <span className="label-tech block text-[#D85A30]">
              {product.category?.name || 'Heavy Machinery'} Specifications
            </span>
            <h1 className="heading-display uppercase text-white font-black">
              {product.name}
            </h1>
            {product.modelNumber && (
              <p className="label-tech !text-white/60">Model Reference: {product.modelNumber}</p>
            )}
          </div>
        </div>
      </section>

      {/* 02. DETAILS SECTION */}
      <section className="py-12 sm:py-16 bg-[#FAF9F6] relative z-10 border-b border-black/10">
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.8) 1px, transparent 0)', 
            backgroundSize: '2rem 2rem' 
          }} 
        />

        <div className="section-container relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-muted-foreground mb-8">
            <Link href="/" className="hover:text-[#D85A30] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#D85A30] transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#D85A30] transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#131312] font-black truncate max-w-[200px] md:max-w-none">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Gallery */}
            <div className="lg:col-span-6">
              <div className="bg-white p-4 border border-black/10 shadow-sm">
                <ImageGallery
                  images={product.images || []}
                  title={`${product.name}${product.capacity ? ` - ${product.capacity}` : ''} - Bala Enterprise`}
                />
              </div>
            </div>

            {/* Product Technical Specs */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="label-tech mb-2">Technical Overview</p>
                <h2 className="heading-section text-[#131312] font-black uppercase">
                  Engineering <span className="text-[#D85A30] italic font-medium">Specifications.</span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.capacity && (
                  <span className="label-tech !bg-[#131312] !text-white px-3 py-1.5 border border-white/10">
                    Capacity: {product.capacity}
                  </span>
                )}
                {product.span && (
                  <span className="label-tech !bg-[#D85A30] !text-white px-3 py-1.5">
                    Span: {product.span}
                  </span>
                )}
              </div>

              {product.fullDescription && (
                <p className="body-text text-[#131312]/80 leading-relaxed text-sm sm:text-base whitespace-pre-wrap border-l-2 border-[#D85A30] pl-4">
                  {product.fullDescription}
                </p>
              )}

              {/* Quote CTA box */}
              <div className="border border-black/10 bg-white p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="label-tech">Pricing Guidance</p>
                  <p className="font-heading text-xl font-black text-[#131312] mt-0.5">
                    {product.priceDisplay || 'Price On Request'}
                  </p>
                </div>
                <ProductQuoteModal
                  productName={product.name}
                  productId={product._id}
                  slug={product.slug}
                />
              </div>

              {/* Specifications Table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="space-y-4 pt-2">
                  <p className="label-tech border-b border-black/10 pb-2">Technical Data Sheet</p>
                  <div className="border border-black/10 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-xs font-sans">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, val], i) => (
                          <tr key={key} className={i % 2 === 0 ? 'bg-[#FAF9F6]' : 'bg-white'}>
                            <td className="px-4 py-3 font-bold uppercase tracking-wider text-[#131312] w-1/3 border-r border-black/5">{key}</td>
                            <td className="px-4 py-3 text-[#131312]/80 font-medium">{String(val)}</td>
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
      </section>

    </div>
  );
}
