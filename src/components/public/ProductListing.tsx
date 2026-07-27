'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';

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

  const filteredProducts = activeCategory
    ? initialProducts.filter(() => true)
    : initialProducts;

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
      
      {/* Sidebar Filters Container */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-black/10 pb-4">
          <SlidersHorizontal className="h-4 w-4 text-[#D85A30]" />
          <h2 className="label-tech !text-xs !text-[#131312]">
            Select Category
          </h2>
        </div>

        {/* Mobile Dropdown Selector */}
        <div className="block lg:hidden">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full min-h-12 bg-white border border-black/10 px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider text-[#131312] appearance-none focus:outline-none focus:border-[#D85A30]"
            >
              <option value="">All Machinery</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#D85A30]">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Filter List */}
        <div className="hidden lg:flex flex-col gap-1.5 bg-white p-3 border border-black/10 shadow-sm">
          <button
            onClick={() => handleCategorySelect('')}
            className={`w-full px-4 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
              activeCategory === ''
                ? 'bg-[#131312] text-white border-l-4 border-[#D85A30]'
                : 'text-[#131312]/70 hover:bg-[#FAF9F6] hover:text-[#D85A30]'
            }`}
          >
            <span>All Machinery</span>
            <ChevronRight className={`w-3.5 h-3.5 ${activeCategory === '' ? 'text-[#D85A30]' : 'opacity-0'}`} />
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full px-4 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#131312] text-white border-l-4 border-[#D85A30]'
                    : 'text-[#131312]/70 hover:bg-[#FAF9F6] hover:text-[#D85A30]'
                }`}
              >
                <span>{cat.name}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#D85A30]' : 'opacity-0'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="lg:col-span-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-black/10">
            <p className="label-tech !text-muted-foreground">No equipment items found in this section.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-black/10">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 bg-white border border-black/10 text-xs font-sans font-bold uppercase tracking-wider text-[#131312] disabled:opacity-40 hover:bg-[#FAF9F6] hover:text-[#D85A30] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center text-xs font-sans font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#131312] text-white border-b-2 border-[#D85A30]'
                        : 'bg-white border border-black/10 text-[#131312] hover:bg-[#FAF9F6] hover:text-[#D85A30]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 bg-white border border-black/10 text-xs font-sans font-bold uppercase tracking-wider text-[#131312] disabled:opacity-40 hover:bg-[#FAF9F6] hover:text-[#D85A30] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
