import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Settings, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductImage } from '@/models/ProductImage';
import { Project } from '@/models/Project';
import { ProjectImage } from '@/models/ProjectImage';
import { Testimonial } from '@/models/Testimonial';
import ProductCard from '@/components/public/ProductCard';
import FactoryGallery from '@/components/public/FactoryGallery';
import HeroCategoriesBento from '@/components/public/HeroCategoriesBento';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar',
  description:
    'GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.',
};

async function getHomePageData() {
  await connectToDatabase();

  const [categories, featuredProducts, projects, testimonials] = await Promise.all([
    Category.find({ status: 'active' }).sort({ sortOrder: 1 }).limit(9).lean(),
    Product.find({ status: 'active', featured: true }).limit(6).lean(),
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
  const { categories, products, testimonials } = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
      
      {/* 01. HERO SECTION */}
      <section className="relative min-h-screen lg:h-screen lg:min-h-[620px] flex items-center bg-[#131312] text-white overflow-hidden border-b border-white/10">
        {/* Loop Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="/hero.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 filter brightness-90 contrast-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-[#D85A30]/5 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131312]/30 via-[#131312]/60 to-[#131312] pointer-events-none" />
        </div>

        {/* Blueprint Dot Grid */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '2.5rem 2.5rem' 
          }} 
        />

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 sm:pt-32 lg:pt-40 pb-16 flex items-center">
          <div className="max-w-2xl text-left space-y-4">
            <span className="label-tech tracking-[0.3em] block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              Industrial Cranes, Hoists & Winches
            </span>
            
            <h1 className="heading-display uppercase text-white font-black tracking-tight leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              Cranes, Hoists & Winches <br />
              <span className="text-[#D85A30] italic font-medium">Built Heavy for Factory Work.</span>
            </h1>
            
            <p className="body-text text-white/80 font-medium leading-relaxed max-w-xl text-sm sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              Bala Enterprise makes strong, reliable overhead cranes, hoists, winches, stackers, and heavy lifting equipment for factories in Bhavnagar GIDC and across Gujarat & India.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/products"
                className="px-6 py-3.5 bg-[#D85A30] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-none shadow-lg"
              >
                Get Price Quote
              </Link>
              <a
                href="https://wa.me/919825214214?text=Hi%20Bala%20Enterprise%2C%20I%20need%20help%20with%20industrial%20lifting%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 border border-white/30 text-white hover:border-white hover:bg-white/10 text-xs font-sans font-bold uppercase tracking-wider transition-colors rounded-none bg-transparent"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 02. CATEGORIES CAROUSEL BENTO */}
      <HeroCategoriesBento categories={categories} />

      {/* 03. TECHNICAL TRUST STATS (Dark strip) */}
      <section className="bg-[#131312] py-12 border-b border-white/10 relative overflow-hidden text-white">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '1.5rem 1.5rem' 
          }} 
        />
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-[#D85A30]/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
          <div className="md:border-r md:border-white/10 py-3">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 font-black">15+</span>
            <span className="label-tech text-white/60">Years Experience</span>
          </div>
          <div className="md:border-r md:border-white/10 py-3">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white block mb-1 font-black">GST</span>
            <span className="label-tech text-[#D85A30]">GST Bill & Invoice</span>
          </div>
          <div className="md:border-r md:border-white/10 py-3">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 font-black">9+</span>
            <span className="label-tech text-white/60">Product Types</span>
          </div>
          <div className="py-3">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white block mb-1 font-black">Fast</span>
            <span className="label-tech text-white/60">Price Quote</span>
          </div>
        </div>
      </section>

      {/* 04. FEATURED PRODUCTS CATALOG */}
      <section className="py-20 lg:py-28 bg-[#F7EBDD] border-b border-black/10 relative overflow-hidden">
        {/* Radial dot grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.8) 1px, transparent 0)', 
            backgroundSize: '2rem 2rem' 
          }} 
        />

        <div className="section-container relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8 mb-12">
            <div className="max-w-xl">
              <p className="label-tech mb-3">
                Our Main Products
              </p>
              <h2 className="heading-section text-[#131312] font-black uppercase">
                Cranes, Hoists & <span className="text-[#D85A30] italic font-medium">Lifting Equipment.</span>
              </h2>
            </div>
            
            <Link
              href="/products"
              className="group flex items-center gap-3 text-xs font-sans font-bold uppercase tracking-widest text-[#131312] hover:text-[#D85A30] transition-colors"
            >
              See All Products
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#D85A30]" />
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.length === 0 ? (
              <div className="col-span-full text-center text-sm text-muted-foreground py-16">No products found.</div>
            ) : (
              products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 05. WHY CHOOSE US */}
      <section className="py-20 lg:py-28 bg-[#131312] text-white relative overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '2rem 2rem' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="label-tech mb-3">
                  Why Buy From Us
                </p>
                <h2 className="heading-section text-white font-black uppercase">
                  Why Factory Owners Trust <span className="text-[#D85A30] italic font-medium">Bala Enterprise.</span>
                </h2>
                <p className="body-text text-white/70 mt-4 leading-relaxed max-w-xl">
                  We give simple technical advice, heavy-duty long lasting machinery, and fast reply for factory owners who need zero breakdown work.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Heavy Duty Steel',
                    copy: 'Made with tested strong steel and powerful electric heavy motors for long life.',
                  },
                  {
                    icon: Settings,
                    title: 'Fast Technical Help',
                    copy: 'Quick guidance on crane size, load capacity, and drawing layout for your factory.',
                  },
                  {
                    icon: Award,
                    title: 'GST Registered Factory',
                    copy: 'Proper GST B2B invoice available for your full input tax credit.',
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Full Product Range',
                    copy: 'Complete range of EOT Cranes, Wire Rope Hoists, Winches, and Stackers.',
                  },
                ].map((item) => (
                  <div 
                    key={item.title} 
                    className="p-6 bg-white/5 border border-white/10 hover:border-[#D85A30]/50 transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="w-10 h-10 bg-[#D85A30]/20 text-[#D85A30] flex items-center justify-center mb-4 border border-[#D85A30]/30 group-hover:bg-[#D85A30] group-hover:text-white transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-2">{item.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">{item.copy}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#D85A30] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-none shadow-md"
                >
                  <span>Visit Our Factory</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Workshop Image Showcase */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-square">
              <div className="relative w-full h-full border border-white/10 p-2 bg-white/5">
                <div className="relative w-full h-full overflow-hidden group">
                  <Image
                    src="/Images_Factory/inside_factory.png"
                    alt="Bala Enterprise Factory Workshop"
                    fill
                    className="object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="label-tech !text-white/80 block mb-1">Bhavnagar GIDC Factory</span>
                    <h4 className="font-heading text-base font-bold text-white uppercase">Inside Factory Workshop</h4>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 06. FACTORY GALLERY SHOWCASE */}
      <FactoryGallery />

      {/* 07. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-[#F7EBDD] border-t border-black/10 relative overflow-hidden">
          <div className="section-container max-w-5xl relative z-10">
            <div className="text-center mb-12">
              <p className="label-tech mb-3">Client Reviews</p>
              <h2 className="heading-section text-[#131312] font-black uppercase">
                What Our Customers <span className="text-[#D85A30] italic font-medium">Say.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((test) => (
                <div key={test._id} className="bg-white border border-black/10 p-8 shadow-sm hover:border-[#D85A30]/40 transition-colors">
                  <div className="flex text-[#D85A30] mb-4">
                    {Array(test.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                  </div>
                  <p className="text-sm text-[#131312]/80 leading-relaxed font-sans mb-6 italic">
                    &ldquo;{test.reviewText}&rdquo;
                  </p>
                  <div className="border-t border-black/5 pt-4">
                    <h4 className="text-xs font-bold font-heading text-[#131312] uppercase tracking-wider">{test.clientName}</h4>
                    {test.companyName && (
                      <span className="text-[10px] text-muted-foreground uppercase font-sans tracking-widest mt-0.5 block">{test.companyName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
