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
    category?: { name?: string } | string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryName = typeof product.category === 'object' && product.category?.name 
    ? product.category.name 
    : 'Heavy Machinery';

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-[320px] sm:h-[420px] w-full cursor-pointer transition-all duration-300"
    >
      {/* Upper Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
        {product.capacity && (
          <span className="bg-[#131312] text-white text-[8px] sm:text-[9px] font-sans uppercase tracking-widest font-bold px-2 py-0.5 border border-white/10">
            {product.capacity}
          </span>
        )}
        <span className="bg-[#D85A30] text-white text-[8px] sm:text-[9px] font-sans uppercase tracking-widest font-bold px-2 py-0.5">
          Heavy Duty
        </span>
      </div>

      {/* Product Image Container (Delta-Impex Card aesthetic) */}
      <div className="relative h-[68%] w-full bg-[#FCF6ED] border border-black/5 group-hover:border-[#D85A30]/40 overflow-hidden flex items-center justify-center p-4 sm:p-6 transition-all duration-500">
        
        {/* Technical Radial Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.5) 1px, transparent 0)', 
            backgroundSize: '1.25rem 1.25rem' 
          }} 
        />
        
        {/* Ambient Glow Orb */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#D85A30]/10 group-hover:bg-[#D85A30]/25 blur-[50px] transition-all duration-500 pointer-events-none" />

        {/* Product Image */}
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
              <div className="relative w-full h-full transform transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-1 will-change-transform">
                <Image
                  src={imgUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            );
          }

          return <div className="text-zinc-400 text-xs font-medium uppercase tracking-widest font-sans">Precision Component</div>;
        })()}

        {/* Glass Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Typography & Details Container */}
      <div className="h-[32%] pt-3 sm:pt-4 pb-1 px-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-[#D85A30]/50" />
            <p className="font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#D85A30]">
              {categoryName}
            </p>
          </div>
          
          <h3 className="font-heading text-xs sm:text-sm md:text-base font-bold text-[#131312] group-hover:text-[#D85A30] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Technical Specs Footer Link */}
        <div className="flex items-center justify-between opacity-70 group-hover:opacity-100 transition-all duration-300 pt-1">
          <span className="text-[8px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-[#131312] group-hover:text-[#D85A30]">
            View Details & Specs
          </span>
          <ArrowRight className="h-3 w-3 text-[#D85A30] transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
