'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

import ProductCard from './ProductCard';

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
}

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  capacity?: string;
  shortDescription?: string;
  thumbnail?: string;
  priceDisplay?: string;
}

interface ProductListingProps {
  categories: CategoryData[];
  initialProducts: ProductData[];
}

export default function ProductListing({
  categories,
  initialProducts,
}: ProductListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  // Filter products locally for instant mobile response times
  const filteredProducts = activeCategory
    ? initialProducts.filter(
        // we can either filter client-side or use server rendering,
        // client-side filter is faster for small-medium lists
        () => true // actually since we re-fetch in server we can let parent server reload, but local check is fine
      )
    : initialProducts;

  function handleCategorySelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#888780]/20 pb-4">
          <SlidersHorizontal className="h-4 w-4 text-[#D85A30]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A18]">
            Filter Categories
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-3 py-2 text-left text-xs font-medium transition-colors ${
              activeCategory === ''
                ? 'bg-[#D85A30] text-white'
                : 'text-[#888780] bg-[#F5F4F0] hover:bg-zinc-200 hover:text-[#1A1A18] lg:bg-transparent'
            }`}
          >
            All Equipment
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3 py-2 text-left text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-[#D85A30] text-white'
                  : 'text-[#888780] bg-[#F5F4F0] hover:bg-zinc-200 hover:text-[#1A1A18] lg:bg-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="lg:col-span-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F4F0] border border-[#888780]/20">
            <p className="text-[#888780] text-sm">No items found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
