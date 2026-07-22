'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';

const category3DImages: Record<string, string> = {
  'wire-rope-hoist': '/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.png',
  'chain-block': '/Categories_3d/Chain_Block.png',
  'manual-stacker': '/Categories_3d/Stacker.png',
  'hand-pallet-truck': '/Categories_3d/35e73dd5-60db-4891-8715-b6c2ed715917.png',
  'manual-geared-trolley': '/Categories_3d/Geared_Trolley.png',
  'hydraulic-scissor-lift-table': '/Categories_3d/Scissor Lift Table.png',
  'hydraulic-floor-crane': '/Categories_3d/Floor crane.png',
  'electric-winch': '/Categories_3d/837efcf2-bdd8-4892-8868-267e6b22ca49.png',
  'hand-winch': '/Categories_3d/Hand_winch.png',
};

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

interface HeroCategoriesBentoProps {
  categories: CategoryItem[];
}

export default function HeroCategoriesBento({ categories }: HeroCategoriesBentoProps) {
  const orderOfSlugs = [
    'wire-rope-hoist',
    'chain-block',
    'manual-stacker',
    'hand-pallet-truck',
    'manual-geared-trolley',
    'hydraulic-scissor-lift-table',
    'hydraulic-floor-crane',
    'electric-winch',
    'hand-winch'
  ];

  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = orderOfSlugs.indexOf(a.slug);
    const idxB = orderOfSlugs.indexOf(b.slug);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

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
              Product Categories
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
            const image = category3DImages[cat.slug] || cat.imageUrl || '/logo.png';

            return (
              <Link
                key={`${cat._id}-${index}`}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col justify-between p-6 w-56 sm:w-64 md:w-72 h-72 sm:h-80 bg-white/5 border border-white/10 hover:border-[#D85A30]/50 transition-all duration-500 rounded-none shrink-0 overflow-hidden"
              >
                {/* Micro Ambient Glow */}
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[#D85A30]/10 group-hover:bg-[#D85A30]/30 blur-[40px] transition-all duration-500 pointer-events-none" />
                
                {/* Category Header Badge */}
                <div className="flex items-center justify-between z-10">
                  <div className="w-8 h-8 rounded-none bg-[#D85A30]/20 text-[#D85A30] flex items-center justify-center border border-[#D85A30]/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-sans text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-colors">
                    GST Invoice Available
                  </span>
                </div>

                {/* 3D Image Preview Container */}
                <div className="relative w-full h-36 sm:h-44 my-2 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 200px, 280px"
                    className="object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Text Label Footer */}
                <div className="z-10 pt-2 border-t border-white/10 group-hover:border-[#D85A30]/30 transition-colors">
                  <span className="font-heading text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-[#D85A30] transition-colors leading-tight block truncate">
                    {cat.name}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-white/50">Explore Products</span>
                    <ArrowRight className="w-3 h-3 text-[#D85A30] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
