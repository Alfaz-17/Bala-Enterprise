import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import ProductListing from '@/components/public/ProductListing';
import type { Metadata } from 'next';

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
    <div className="bg-white min-h-screen">
      {/* Page Header (Slanted High-Contrast Style) */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-10 sm:py-14 md:py-20 border-b border-[#2A2A28]">
        {/* Slanted Design Background shape */}
        <div className="absolute top-0 right-0 h-full w-[45%] bg-[#D85A30] origin-top-right transform skew-x-[-15deg] translate-x-[15%] z-0 hidden lg:block" />
        <div className="absolute inset-0 bg-[#D85A30] z-0 lg:hidden opacity-90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[#D85A30] lg:text-primary text-xs uppercase tracking-[0.2em] font-bold block">
              B2B Equipment Catalog
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
              Equipment Catalog
            </h1>
            <p className="text-sm text-white/80 max-w-xl">
              Explore industrial lifting equipment by category and enquire for the exact capacity your factory needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <ProductListing categories={categories} initialProducts={products} />
      </div>
    </div>
  );
}