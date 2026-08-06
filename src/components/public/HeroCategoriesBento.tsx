'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  sortOrder?: number;
}

interface HeroCategoriesBentoProps {
  categories: CategoryItem[];
}

export default function HeroCategoriesBento({ categories }: HeroCategoriesBentoProps) {
  // Sort by sortOrder from database (set in admin panel)
  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  const marqueeItems = [...sortedCategories, ...sortedCategories, ...sortedCategories];

  return (
    <section className="py-16 lg:py-24 bg-[#131312] text-white relative overflow-hidden border-b border-white/10">
      {/* Blueprint Dot Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '2rem 2rem' 
        }} 
      />

      <div className="section-container relative z-10 mb-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <p className="label-tech mb-3">
              Categories Showcase
            </p>
            <h2 className="heading-section text-white font-black uppercase tracking-tight">
              Our Machinery <span className="text-[#D85A30] italic font-medium">Line.</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="group flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-white/70 hover:text-[#D85A30] transition-colors"
            >
              View Full Product List
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Carousel */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        
        {/* Left & Right Gradient Mask Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[#131312] via-[#131312]/60 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[#131312] via-[#131312]/60 to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex gap-6 sm:gap-8 w-max pl-4"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 28,
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((cat, index) => {
            // Use imageUrl from database (uploaded via admin panel)
            const image = cat.imageUrl || '/logo.png';

            return (
              <Link
                key={`${cat._id}-${index}`}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center justify-center p-2 w-36 sm:w-48 md:w-52 h-44 sm:h-56 shrink-0 text-center transition-all duration-300"
              >
                {/* Floating Image Preview */}
                <div className="relative w-full h-32 sm:h-44 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 140px, 220px"
                    className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Category Name Label */}
                <span className="font-heading text-xs sm:text-sm font-black uppercase tracking-wider text-white/90 group-hover:text-[#D85A30] transition-colors leading-tight block truncate mt-2">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
