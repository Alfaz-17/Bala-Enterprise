'use client';

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Sidebar Filters */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center gap-2 border-b border-[#888780]/20 pb-3 lg:pb-4">
          <SlidersHorizontal className="h-4 w-4 text-[#D85A30]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A18]">
            Filter Categories
          </h2>
        </div>

        {/* Mobile Dropdown Selector (visible on mobile/tablet screens) */}
        <div className="block lg:hidden">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full min-h-11 bg-[#F5F4F0] border border-[#888780]/25 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A18] appearance-none focus:outline-none focus:ring-1 focus:ring-[#D85A30] focus:border-[#D85A30]"
            >
              <option value="">All Equipment</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {/* Custom arrow icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#888780]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Filter List (hidden on mobile/tablet) */}
        <div className="hidden lg:flex flex-col gap-1">
          <button
            onClick={() => handleCategorySelect('')}
            className={`min-h-11 shrink-0 rounded-sm px-4 py-2 text-left text-xs font-medium transition-colors ${
              activeCategory === ''
                ? 'bg-[#D85A30] text-white'
                : 'text-[#888780] hover:bg-zinc-200 hover:text-[#1A1A18] lg:bg-transparent'
            }`}
          >
            All Equipment
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`min-h-11 shrink-0 rounded-sm px-4 py-2 text-left text-xs font-medium transition-colors whitespace-nowrap lg:whitespace-normal ${
                activeCategory === cat.slug
                  ? 'bg-[#D85A30] text-white'
                  : 'text-[#888780] hover:bg-zinc-200 hover:text-[#1A1A18] lg:bg-transparent'
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
          <div className="text-center py-12 sm:py-20 bg-[#F5F4F0] border border-[#888780]/20 rounded-md">
            <p className="text-[#888780] text-sm">No items found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 pb-20 sm:pb-24">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
