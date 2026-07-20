import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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
    <Link
      href={`/products/${product.slug}`}
      className="transition-all duration-300 flex flex-col group relative h-[280px] sm:h-[400px] cursor-pointer"
    >
      {/* Upper Tag (Best Seller / Capacity) */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
        {product.capacity && (
          <span className="bg-[#1A1A18] text-white text-[7px] sm:text-[9px] uppercase tracking-wider font-bold px-1.5 sm:px-2 py-0.5 rounded-sm">
            {product.capacity}
          </span>
        )}
        <span className="bg-[#D85A30] text-white text-[7px] sm:text-[9px] uppercase tracking-wider font-bold px-1.5 sm:px-2 py-0.5 rounded-sm">
          Best Seller
        </span>
      </div>

      {/* Product Image Area (70% height) */}
      <div className="relative h-[70%] w-full bg-[#F5F4F0] rounded-md overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6">
        {(() => {
          const imgUrl = product.thumbnail || (() => {
            const name = product.name.toLowerCase();
            if (name.includes('stacker')) return '/Categories_3d/Stacker.png';
            if (name.includes('hoist')) return '/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.png';
            if (name.includes('winch')) return '/Categories_3d/837efcf2-bdd8-4892-8868-267e6b22ca49.png';
            if (name.includes('pallet')) return '/hero_pallet.png';
            if (name.includes('crane') || name.includes('gantry') || name.includes('jib')) {
              return '/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.png';
            }
            return null;
          })();

          if (imgUrl) {
            return (
              <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={imgUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            );
          }

          return <div className="text-zinc-400 text-xs font-medium">No Image Available</div>;
        })()}
      </div>

      {/* Product Info Area (30% height) */}
      <div className="h-[30%] pt-2 sm:pt-3 pb-1 flex flex-col justify-between">
        <div className="space-y-0.5 sm:space-y-1">
          {/* Brand/Subtitle */}
          <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-[#888780]">
            Bala Enterprise
          </span>
          {/* Name */}
          <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>

        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit">
          View Specs & Enquire
          <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
