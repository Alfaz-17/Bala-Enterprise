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

export const revalidate = 3600; // Hourly regeneration

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
      canonical: `https://balaenterprise.com/products/${product.slug}`,
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
      url: `https://balaenterprise.com/products/${product.slug}`,
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

  const capacityInfo = product.capacity ? ` - ${product.capacity}` : '';
  const currentUrl = `https://balaenterprise.com/products/${product.slug}`;

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

  // ImageObject schema (for Google Images search eligibility)
  const imageSchemas = (product.images || []).map((img) => ({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: img.url,
    license: 'https://balaenterprise.com/terms',
    acquireLicensePage: 'https://balaenterprise.com/contact',
    creditText: 'Bala Enterprise',
    creator: { '@type': 'Organization', name: 'Bala Enterprise' },
    copyrightNotice: 'Bala Enterprise',
  }));

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://balaenterprise.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://balaenterprise.com/products',
      },
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category.name,
              item: `https://balaenterprise.com/products?category=${product.category.slug}`,
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
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A18] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {imageSchemas.map((imgSchema, idx) => (
        <script
          key={`image-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imgSchema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      {/* Page Header — Side-by-side text + image on ALL screens */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 border-b border-[#2A2A28]">
        <div className="absolute top-0 right-0 h-full w-[42%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[12deg] sm:skew-x-[15deg] -translate-x-[8%] sm:-translate-x-[10%] w-[130%] h-full">
            <Image
              src="/Image_from_internet/pexels-cmrcn-29224588.jpg"
              alt={product.name}
              fill
              priority
              className="object-cover object-center opacity-60 sm:opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/40 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <span className="text-[#D85A30] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold block">
              {product.category?.name || 'Equipment Specifications'}
            </span>
            <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              {product.name}
            </h1>
            {product.modelNumber && (
              <p className="text-[11px] sm:text-sm text-white/80 max-w-xl leading-relaxed">Model Number: {product.modelNumber}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
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
            <ImageGallery
              images={product.images || []}
              title={`${product.name}${product.capacity ? ` - ${product.capacity}` : ''} - Bala Enterprise`}
            />
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
                <div className="bg-white/50 backdrop-blur-sm border border-black/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A18] rounded-sm">
                  Capacity: {product.capacity}
                </div>
              )}
              {product.span && (
                <div className="bg-white/50 backdrop-blur-sm border border-black/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A18] rounded-sm">
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
                <div className="border border-black/5 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val], i) => (
                        <tr key={key} className={i % 2 === 0 ? 'bg-white/30 backdrop-blur-sm' : 'bg-white/60'}>
                          <td className="px-4 py-3 font-semibold text-[#1A1A18] w-1/3 border-r border-black/5">{key}</td>
                          <td className="px-4 py-3 text-[#5f5e58]">{String(val)}</td>
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
