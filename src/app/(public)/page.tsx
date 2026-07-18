import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Settings, ShieldCheck, Award } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import { Project } from '@/models/Project';
import { ProjectImage } from '@/models/ProjectImage';
import { Testimonial } from '@/models/Testimonial';
import ProductCard from '@/components/public/ProductCard';
import FactoryGallery from '@/components/public/FactoryGallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar',
  description:
    'GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.',
};

async function getHomePageData() {
  await connectToDatabase();

  const [categories, featuredProducts, projects, testimonials] = await Promise.all([
    Category.find({ status: 'active' }).sort({ sortOrder: 1 }).limit(6).lean(),
    Product.find({ status: 'active', featured: true }).limit(3).lean(),
    Project.find({ status: 'active' }).sort({ completedDate: -1, createdAt: -1 }).limit(3).lean(),
    Testimonial.find({ status: 'active' }).sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  // Attach main thumbnail image to each product
  const productIds = featuredProducts.map((p) => p._id);
  const prodThumbnails = await ProductImage.find({
    product: { $in: productIds },
    isPrimary: true,
  }).select('product url').lean();
  const prodThumbMap = new Map(prodThumbnails.map((t) => [String(t.product), t.url]));

  const mappedProducts = featuredProducts.map((p) => ({
    ...p,
    _id: String(p._id),
    category: String(p.category),
    thumbnail: prodThumbMap.get(String(p._id)) || undefined,
  }));

  // Attach first image as thumbnail to each project
  const projectIds = projects.map((p) => p._id);
  const projImages = await ProjectImage.find({ project: { $in: projectIds } }).lean();
  const projThumbMap = new Map<string, string>();
  for (const img of projImages) {
    const key = String(img.project);
    if (!projThumbMap.has(key)) projThumbMap.set(key, img.url);
  }

  const mappedProjects = projects.map((p) => ({
    ...p,
    _id: String(p._id),
    product: p.product ? String(p.product) : undefined,
    thumbnail: projThumbMap.get(String(p._id)) || undefined,
  }));

  return {
    categories: categories.map((c) => ({ ...c, _id: String(c._id) })),
    products: mappedProducts,
    projects: mappedProjects,
    testimonials: testimonials.map((t) => ({ ...t, _id: String(t._id) })),
  };
}

export default async function HomePage() {
  const { categories, products, projects, testimonials } = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100svh-96px)] lg:h-[calc(100vh-122px)] flex items-center bg-[#32C8E6] lg:bg-[#F5F4F0] text-white lg:text-[#1A1A18] overflow-hidden py-7 sm:py-10 lg:py-0 border-b border-border">
        {/* Diagonal Background Accent (slanted division as seen in the reference) */}
        <div className="absolute top-0 right-0 h-full w-[55%] bg-[#D85A30] origin-top-right transform skew-x-[-15deg] translate-x-[10%] z-0 hidden lg:block" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_36%)] z-0 lg:hidden" />

        {/* Custom 3D Floating Animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-slow-1 {
            0%, 100% { transform: translateY(0px) rotate(-1deg); }
            50% { transform: translateY(-12px) rotate(1deg); }
          }
          @keyframes float-slow-2 {
            0%, 100% { transform: translateY(0px) rotate(1.5deg); }
            50% { transform: translateY(-18px) rotate(-1deg); }
          }
          @keyframes float-slow-3 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
          }
          .animate-float-1 { animation: float-slow-1 6.5s ease-in-out infinite; }
          .animate-float-2 { animation: float-slow-2 8.5s ease-in-out infinite; }
          .animate-float-3 { animation: float-slow-3 7.5s ease-in-out infinite; }
        `}} />

        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10 hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-8 items-center h-full">
          {/* Left Column (5/12 width): Typographic Brand Column (Light Theme) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 lg:pr-6 text-center lg:text-left">
            <div className="space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.18em] sm:tracking-[0.25em] uppercase text-white/80 lg:text-[#D85A30] font-black block">
                Industrial Lifting Equipment
              </span>
              <h1 className="font-heading text-[2rem] min-[380px]:text-4xl sm:text-5xl lg:text-5xl font-black leading-[1.05] tracking-tight text-white lg:text-[#1A1A18] flex flex-col drop-shadow-sm lg:drop-shadow-none">
                <span>Cranes, Hoists & Winches</span>
                <span className="text-white lg:text-[#D85A30] mt-1">Built for Heavy-Duty Work</span>
              </h1>
              
              <p className="text-sm sm:text-base text-white/85 lg:text-[#5f5e58] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Bala Enterprise manufactures reliable lifting equipment for factories, warehouses, and industrial sites across Gujarat.
              </p>

              {/* Checklist (2 items) */}
              <ul className="hidden lg:block space-y-2 pt-2 text-[#1A1A18]">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm font-semibold">GST certified manufacturer based in Bhavnagar GIDC</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm font-semibold">Fast guidance for capacity, span, and site requirements</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 max-w-sm mx-auto lg:mx-0 lg:max-w-md">
              <Link
                href="#enquire"
                className="min-h-11 lg:min-h-12 inline-flex items-center justify-center px-4 lg:px-5 py-3 bg-[#1A1A18] lg:bg-[#D85A30] text-white text-[10px] lg:text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-sm shadow-sm"
              >
                Get a Quote
              </Link>
              <a
                href="https://wa.me/919825214214?text=Hi%20Bala%20Enterprise%2C%20I%20need%20help%20with%20industrial%20lifting%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 lg:min-h-12 inline-flex items-center justify-center px-4 lg:px-5 py-3 border border-white/70 lg:border-[#1A1A18] text-white lg:text-[#1A1A18] hover:bg-[#1A1A18] hover:text-white text-[10px] lg:text-xs font-bold uppercase tracking-wider transition-colors rounded-sm bg-white/10 lg:bg-white/40"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Mobile Product Showcase */}
          <div className="lg:hidden relative -mx-4 mt-1 overflow-hidden">
            <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
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
              ].map((item) => (
                <div key={item.name} className="min-w-full snap-center px-5">
                  <div className="relative mx-auto h-[235px] min-[390px]:h-[270px] max-w-[340px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      priority={item.name === 'Manual Stacker'}
                      sizes="(max-width: 768px) 92vw"
                      className="object-contain drop-shadow-[0_24px_28px_rgba(0,0,0,0.22)]"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                  <div className="mx-auto -mt-2 w-fit rounded-full bg-white/18 px-4 py-1.5 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-white/75">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-[#7B55F2]" />
              <span className="h-2 w-2 rounded-full border border-white/80" />
              <span className="h-2 w-2 rounded-full border border-white/80" />
            </div>
          </div>

          {/* Desktop Product Collage */}
          <div className="hidden lg:flex lg:col-span-7 relative h-[300px] min-[420px]:h-[340px] sm:h-[390px] lg:h-full items-center justify-center overflow-visible select-none">
            {/* Collage Container */}
            <div className="relative w-full h-full flex items-center justify-center">
               
               {/* Product 1: Electric Hoist (Top-Left Center) */}
               <div className="absolute top-[2%] left-[22%] w-[145px] min-[420px]:w-[170px] md:w-[260px] aspect-square animate-float-1 z-10 transition-transform duration-300 hover:scale-105 cursor-pointer">
                 <Image
                   src="/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.png"
                   alt="Electric Wire Rope Hoist"
                   fill
                   sizes="(max-width: 480px) 150px, (max-width: 768px) 180px, 260px"
                   className="object-contain"
                   style={{ mixBlendMode: 'multiply' }}
                 />
                 <span className="absolute bottom-2 right-2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white pointer-events-none shadow-sm">
                   Wire Rope Hoist
                 </span>
               </div>

               {/* Product 2: Manual Stacker (Center-Left Main Focus) */}
               <div className="absolute top-[20%] left-[2%] w-[155px] min-[420px]:w-[180px] md:w-[280px] aspect-square animate-float-2 z-30 transition-transform duration-300 hover:scale-105 cursor-pointer">
                 <Image
                   src="/Categories_3d/Stacker.png"
                   alt="Manual Hydraulic Stacker"
                   fill
                   sizes="(max-width: 480px) 160px, (max-width: 768px) 190px, 280px"
                   className="object-contain"
                   style={{ mixBlendMode: 'multiply' }}
                 />
                 <span className="absolute bottom-2 left-2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white pointer-events-none shadow-sm">
                   Manual Stacker
                 </span>
               </div>

               {/* Product 3: Winch Machine (Top-Right / Back Background) */}
               <div className="absolute top-[12%] right-[8%] w-[140px] min-[420px]:w-[165px] md:w-[250px] aspect-square animate-float-3 z-0 transition-transform duration-300 hover:scale-105 cursor-pointer">
                 <Image
                   src="/Categories_3d/837efcf2-bdd8-4892-8868-267e6b22ca49.png"
                   alt="Electric Winch Machine"
                   fill
                   sizes="(max-width: 480px) 145px, (max-width: 768px) 175px, 250px"
                   className="object-contain"
                   style={{ mixBlendMode: 'multiply' }}
                 />
                 <span className="absolute bottom-2 left-2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-[#D85A30] pointer-events-none shadow-sm">
                   Winch Machine
                 </span>
               </div>

               {/* Product 4: Hand Pallet Truck (Bottom-Right) */}
               <div className="absolute top-[50%] right-[12%] w-[135px] min-[420px]:w-[160px] md:w-[240px] aspect-square animate-float-1 z-20 transition-transform duration-300 hover:scale-105 cursor-pointer" style={{ animationDelay: '1.5s' }}>
                 <Image
                   src="/Categories_3d/35e73dd5-60db-4891-8715-b6c2ed715917.png"
                   alt="Hand Pallet Truck"
                   fill
                   sizes="(max-width: 480px) 140px, (max-width: 768px) 170px, 240px"
                   className="object-contain"
                   style={{ mixBlendMode: 'multiply' }}
                 />
                 <span className="absolute bottom-2 right-2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white pointer-events-none shadow-sm">
                   Pallet Truck
                 </span>
               </div>

             </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-[#F5F4F0] py-8 sm:py-12 lg:py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div>
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black">11+</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#888780] font-bold">Years in Business</span>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black">GST</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#888780] font-bold">Certified</span>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black">9</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#888780] font-bold">Product Categories</span>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black">1 Hr</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#888780] font-bold">Avg Reply Time</span>
          </div>
        </div>
      </section>

      {/* Category Section (Asymmetrical layout matching the template) */}
      <section className="py-12 sm:py-16 lg:py-24 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-8 sm:mb-12 lg:mb-20">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Our Portfolio</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1A1A18]">Our Products</h2>
            <p className="text-sm text-[#888780] max-w-xl mx-auto leading-relaxed">
              Nine categories of industrial lifting equipment, built to handle your factory's toughest jobs.
            </p>
            <div className="h-0.5 w-12 bg-[#D85A30] mx-auto" />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
            {categories.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center text-sm text-[#888780] py-12">No categories defined yet.</div>
            ) : (
              categories.map((cat, idx) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className={`group flex flex-col transition-all duration-300 h-[420px] ${
                    idx % 3 === 0 ? 'lg:translate-y-4' : idx % 3 === 2 ? 'lg:translate-y-8' : ''
                  }`}
                >
                  {/* Category Image Area (70% height) */}
                  <div className="relative h-[70%] w-full bg-[#F5F4F0] rounded-md overflow-hidden flex items-center justify-center p-4">
                    {(() => {
                      const imgUrl = cat.imageUrl || (() => {
                        const name = cat.name.toLowerCase();
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
                          <Image
                            src={imgUrl}
                            alt={cat.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            style={{ mixBlendMode: 'multiply' }}
                          />
                        );
                      }

                      return (
                        <div className="text-[#888780] font-heading text-lg font-bold text-center px-4">
                          {cat.name}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Category Info Area (30% height) */}
                  <div className="h-[30%] pt-3 pb-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-heading text-base font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors leading-tight">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-[11px] text-[#888780] line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 mt-2 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit">
                      Explore Category
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#1A1A18] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-8 sm:mb-10">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">
              Why Choose Us
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-black">
              Why Factories Choose Bala Enterprise
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Practical guidance, durable equipment, and quick response for factories that cannot afford downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Built to Last',
                copy: 'Manufactured with quality materials and tested for heavy industrial use.',
              },
              {
                icon: Settings,
                title: 'Fast Response',
                copy: 'We help you choose the right equipment quickly, because downtime costs money.',
              },
              {
                icon: Award,
                title: 'GST Certified',
                copy: 'Fully registered and compliant, so industrial buyers can order with confidence.',
              },
              {
                icon: ArrowRight,
                title: 'Wide Range',
                copy: 'From hand winches to electric hoists, stackers, cranes, and pallet trucks.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-white/10 bg-white/[0.04] p-5 rounded-md">
                <item.icon className="h-5 w-5 text-[#D85A30] mb-4" />
                <h3 className="font-heading text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F5F4F0] border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
            <div className="space-y-3">
              <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Reliable Material Handling</span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#1A1A18]">Featured Equipment</h2>
              <div className="h-0.5 w-12 bg-[#D85A30]" />
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold hover:text-[#D85A30] transition-colors flex items-center gap-1 group"
            >
              View Full Catalog
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {products.length === 0 ? (
              <div className="col-span-3 text-center text-sm text-[#888780] py-12">No featured products listed.</div>
            ) : (
              products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Our Manufacturing Facility Showcase */}
      <FactoryGallery />

      {/* Completed installations */}
      <section className="py-12 sm:py-16 lg:py-24 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12 lg:mb-20">
            <div className="space-y-3">
              <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Our Track Record</span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#1A1A18]">Recent Work</h2>
              <p className="text-sm text-[#888780] max-w-xl leading-relaxed">
                A look at Bala Enterprise equipment installed and working at real client sites.
              </p>
              <div className="h-0.5 w-12 bg-[#D85A30]" />
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold hover:text-[#D85A30] transition-colors flex items-center gap-1 group border-b border-[#1A1A18]/25 pb-0.5 hover:border-transparent duration-300"
            >
              All Completed Installations
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
            {projects.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center text-sm text-[#888780] py-10 px-4 bg-[#F5F4F0] border border-border rounded-md">
                Project photos are being added soon. For now, contact us for recent installation references.
              </div>
            ) : (
              projects.map((proj, idx) => (
                <Link
                  key={proj._id}
                  href={`/projects/${proj.slug}`}
                  className={`group flex flex-col transition-all duration-300 h-[400px] ${
                    idx % 3 === 0 ? 'lg:translate-y-4' : idx % 3 === 2 ? 'lg:translate-y-8' : ''
                  }`}
                >
                  {/* Project Image Area (70% height) */}
                  <div className="relative h-[70%] w-full bg-[#F5F4F0] rounded-md overflow-hidden flex items-center justify-center p-4">
                    {proj.thumbnail ? (
                      <Image
                        src={proj.thumbnail}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#F5F4F0] text-[#888780] text-sm font-bold text-center p-6">
                        {proj.title}
                      </div>
                    )}
                  </div>

                  {/* Project Info Area (30% height) */}
                  <div className="h-[30%] pt-3 pb-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-heading text-sm font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors leading-tight line-clamp-2 h-10">
                        {proj.title}
                      </h3>
                      {proj.location && (
                        <span className="text-[10px] text-[#888780] font-semibold uppercase tracking-wider block mt-1">
                          {proj.location}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit">
                      View Project Details
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-[#F5F4F0] border-t border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Feedback</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#1A1A18] mb-6 sm:mb-8">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
              {testimonials.map((test) => (
                <div key={test._id} className="bg-white border border-border p-6 space-y-4">
                  <div className="flex text-[#D85A30]">
                    {Array(test.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                  </div>
                  <p className="text-sm text-[#1A1A18] leading-relaxed italic">
                    &ldquo;{test.reviewText}&rdquo;
                  </p>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A18]">{test.clientName}</h4>
                    {test.companyName && (
                      <span className="text-[10px] text-[#888780]">{test.companyName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* End of content sections */}
    </div>
  );
}
