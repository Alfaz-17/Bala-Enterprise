'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const items = [
  {
    name: 'Manual Stacker',
    caption: 'Hydraulic stackers for pallet handling',
    image: '/Categories_3d/Stacker.png',
  },
  {
    name: 'Wire Rope Hoist',
    caption: 'Electric hoists for heavy overhead lifting',
    image: '/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.png',
  },
  {
    name: 'Electric Winch',
    caption: 'Motorized winches for factory and field use',
    image: '/Categories_3d/837efcf2-bdd8-4892-8868-267e6b22ca49.png',
  },
  {
    name: 'Hand Pallet Truck',
    caption: 'Warehouse movement made simple',
    image: '/Categories_3d/35e73dd5-60db-4891-8715-b6c2ed715917.png',
  },
];

export default function HeroMobileCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      // Don't auto scroll if user is actively touching or scrolling
      if (isScrollingRef.current) return;

      const nextIndex = (activeIndex + 1) % items.length;
      const width = container.clientWidth;
      container.scrollTo({
        left: nextIndex * width,
        behavior: 'smooth',
      });
      setActiveIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleTouchStart = () => {
    isScrollingRef.current = true;
  };

  const handleTouchEnd = () => {
    // Resume auto-scroll after a short delay
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1500);
  };

  return (
    <div className="lg:hidden relative -mx-4 mt-2 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.name} className="min-w-full snap-center px-5">
            <div className="relative mx-auto h-[170px] min-[390px]:h-[200px] max-w-[280px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority={item.name === 'Manual Stacker'}
                sizes="(max-width: 768px) 92vw"
                className="object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.12)]"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div className="mx-auto mt-0.5 w-fit rounded bg-[#1A1A18] px-4 py-1.5 text-center border border-white/5 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white">
                {item.name}
              </p>
              <p className="text-[9px] text-white/70">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-[#D85A30] w-3.5' : 'bg-[#1A1A18]/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
