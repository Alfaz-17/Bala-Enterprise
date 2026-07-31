import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import ProductListing from '@/components/public/ProductListing';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Industrial Cranes & Hoists Catalog | Bala Enterprise',
  description:
    'Browse wire rope hoists, chain blocks, stackers, pallet trucks, winches, cranes, and industrial lifting equipment from Bala Enterprise.',
  alternates: {
    canonical: '/products',
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

async function getProductsCatalogData(categorySlug?: string, search?: string) {
  await connectToDatabase();

  const categories = await Category.find({ status: 'active' })
    .sort({ sortOrder: 1 })
    .lean();

  const filter: Record<string, any> = { status: 'active' };

  if (categorySlug) {
    const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { modelNumber: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

  // Load primary image thumbnails
  const productIds = products.map((p) => p._id);
  const thumbnails = await ProductImage.find({
    product: { $in: productIds },
    isPrimary: true,
  })
    .select('product url')
    .lean();

  const thumbMap = new Map(thumbnails.map((t) => [String(t.product), t.url]));

  const mappedProducts = products.map((p) => ({
    ...p,
    _id: String(p._id),
    category: String(p.category),
    thumbnail: thumbMap.get(String(p._id)) || undefined,
  }));

  return {
    categories: categories.map((c) => ({
      _id: String(c._id),
      name: c.name,
      slug: c.slug,
    })),
    products: mappedProducts,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search } = await searchParams;
  const { categories, products } = await getProductsCatalogData(category, search);

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
    ],
  };

  return (
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Page Header */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-12 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />
        
        {/* Side-by-side skewed image on the right */}
        <div className="absolute top-0 right-0 h-full w-[42%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[12deg] sm:skew-x-[15deg] -translate-x-[8%] sm:-translate-x-[10%] w-[130%] h-full">
            <Image
              src="/Image_from_internet/pexels-cmrcn-29224588.jpg"
              alt="Bala Enterprise Products Catalog"
              fill
              priority
              className="object-cover object-center opacity-60 sm:opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/40 to-transparent" />
          </div>
        </div>
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[65%] sm:max-w-[55%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <p className="label-tech text-[#D85A30] block">
              Equipment List
            </p>
            <h1 className="heading-display uppercase text-white font-black">
              Products <span className="text-[#D85A30] italic font-medium">Catalog.</span>
            </h1>
            <p className="body-text text-white/80 max-w-xl text-xs sm:text-sm leading-relaxed">
              Explore industrial lifting equipment by category and enquire for the exact capacity your factory needs.
            </p>
          </div>
        </div>
      </div>

      {/* Product Listing Main Catalog Area */}
      <div className="section-container py-12 sm:py-16 lg:py-20 relative z-10">
        <ProductListing categories={categories} initialProducts={products} />
      </div>
    </div>
  );
}