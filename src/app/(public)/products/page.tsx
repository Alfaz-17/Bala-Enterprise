import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import ProductListing from '@/components/public/ProductListing';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Industrial Equipment Catalog | Bala Enterprise',
  description:
    'Browse wire rope hoists, chain blocks, stackers, pallet trucks, winches, cranes, and industrial lifting equipment from Bala Enterprise.',
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function getProductsCatalogData(categorySlug?: string) {
  await connectToDatabase();

  const categories = await Category.find({ status: 'active' })
    .sort({ sortOrder: 1 })
    .lean();

  const filter: Record<string, unknown> = { status: 'active' };

  if (categorySlug) {
    const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    }
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
  const { category } = await searchParams;
  const { categories, products } = await getProductsCatalogData(category);

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A18] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      {/* Page Header — Side-by-side text + image on ALL screens */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 border-b border-[#2A2A28]">
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <span className="text-[#D85A30] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold block">
              B2B Equipment Catalog
            </span>
            <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Equipment Catalog
            </h1>
            <p className="text-[11px] sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Explore industrial lifting equipment by category and enquire for the exact capacity your factory needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <ProductListing categories={categories} initialProducts={products} />
      </div>
    </div>
  );
}