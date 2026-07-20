'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Mapping categories to their custom 3D images
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
  // Sort categories by predefined slugs to match order
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

  // Duplicate list to make infinite marquee loop seamlessly
  const marqueeItems = [...sortedCategories, ...sortedCategories, ...sortedCategories];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-[#EAE9E2] to-[#DCDAD0] relative overflow-hidden border-b border-border/10">
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-8 text-center lg:text-left space-y-1">
          <span className="text-[#D85A30] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-black block">
            Product Portfolio
          </span>
          <h2 className="font-heading text-lg sm:text-2xl font-black text-[#1A1A18] tracking-tight">
            Explore Lifting Categories
          </h2>
          <div className="h-0.5 w-10 bg-[#D85A30] mt-1.5 mx-auto lg:mx-0" />
        </div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        
        {/* Left & Right Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#EAE9E2] via-[#EAE9E2]/50 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#DCDAD0] via-[#DCDAD0]/50 to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex gap-10 sm:gap-14 md:gap-18 w-max pl-4"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
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
                className="group flex flex-col items-center text-center justify-center shrink-0 w-28 sm:w-32 md:w-36"
              >
                {/* Card-less 3D Icon Container */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1">
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
                {/* Text Label */}
                <span className="font-heading text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#1A1A18]/85 group-hover:text-[#D85A30] transition-colors duration-300 leading-tight">
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


