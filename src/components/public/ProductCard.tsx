import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    capacity?: string;
    shortDescription?: string;
    thumbnail?: string;
    priceDisplay?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-border shadow-[0_3px_6px_0_rgba(51,51,51,0.05)] hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group h-full relative overflow-hidden rounded-md">
      {/* Upper Tag (Best Seller / Capacity) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.capacity && (
          <span className="bg-[#1A1A18] text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm">
            {product.capacity}
          </span>
        )}
        <span className="bg-[#D85A30] text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm">
          Best Seller
        </span>
      </div>

      {/* Product Image Area */}
      <div className="relative h-56 w-full bg-[#F5F4F0] overflow-hidden flex items-center justify-center p-6">
        {product.thumbnail ? (
          <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="(max-w-768px) 100vw, 33vw"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="text-zinc-400 text-xs font-medium">No Image Available</div>
        )}
      </div>

      {/* Product Info Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Brand/Subtitle */}
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#888780]">
            Bala Enterprise
          </span>
          {/* Name */}
          <h3 className="font-heading text-sm font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors leading-tight line-clamp-2 h-10">
            {product.name}
          </h3>
          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-[11px] text-[#888780] line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Pricing & CTA Actions */}
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#D85A30]">
              {product.priceDisplay || 'Price on Request'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="block w-full text-center py-2 bg-transparent border border-[#1A1A18] text-[#1A1A18] text-[10px] uppercase tracking-wider font-bold hover:bg-[#1A1A18] hover:text-white transition-colors rounded-sm"
            >
              Specs
            </Link>
            <Link
              href={`/products/${product.slug}#enquire`}
              className="block w-full text-center py-2 bg-[#D85A30] text-white text-[10px] uppercase tracking-wider font-bold hover:bg-[#1A1A18] transition-colors rounded-sm"
            >
              Enquire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
