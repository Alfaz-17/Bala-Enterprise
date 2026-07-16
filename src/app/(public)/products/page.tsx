import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import ProductListing from '@/components/public/ProductListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industrial Equipment Catalog | Bala Enterprise',
  description:
    'Browse our technical specifications catalog for Single and Double Girder EOT Cranes, Goliath Cranes, Jib Cranes, winches and custom lift assemblies.',
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
      {/* Page Header */}
      <div className="bg-[#F5F4F0] border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A1A18]">
            Equipment Catalog
          </h1>
          <p className="text-xs text-[#888780] mt-2">
            Explore technical specifications and download quote templates for our heavy-duty lift rigs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductListing categories={categories} initialProducts={products} />
      </div>
    </div>
  );
}
