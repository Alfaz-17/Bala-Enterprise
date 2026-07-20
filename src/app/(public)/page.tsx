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
      <section className="relative min-h-screen lg:h-screen lg:min-h-[580px] flex items-center bg-[#131312] text-white overflow-hidden border-b border-border">
        {/* Full-bleed Loop Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="/hero.MP4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-65 filter brightness-90 contrast-105 pointer-events-none"
          />
          {/* Gradient overlays to match style and make text readable */}
          <div className="absolute inset-0 bg-[#D85A30]/3 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131312]/15 via-transparent to-[#131312]/50 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 sm:pt-32 lg:pt-40 pb-16 flex items-center">
          <div className="max-w-2xl text-left space-y-2.5 sm:space-y-3.5">
            <span className="text-[9px] md:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#D85A30] font-black block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              Industrial Lifting Equipment
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              Cranes, Hoists & Winches
              <span className="text-[#D85A30] block mt-0.5">
                Built for Heavy-Duty
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              Bala Enterprise manufactures highly reliable overhead cranes, hoists, winches, stackers, and industrial lifting machinery for factories and GIDC sites across Gujarat.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/products"
                className="px-5 py-2.5 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-sm shadow-md"
              >
                Get a Quote
              </Link>
              <a
                href="https://wa.me/919825214214?text=Hi%20Bala%20Enterprise%2C%20I%20need%20help%20with%20industrial%20lifting%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-white/35 text-white hover:border-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm bg-transparent"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid Section */}
      <HeroCategoriesBento categories={categories} />

      {/* Trust Stats */}
      <section className="bg-[#1A1A18] py-10 sm:py-12 border-b border-white/5 relative overflow-hidden">
        {/* Subtle orange glow in background */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-[#D85A30]/5 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-[#FFB800]/5 blur-[80px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
          <div className="md:border-r md:border-white/10 md:last:border-r-0 py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black tracking-tight">11+</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-white/60 font-bold">Years in Business</span>
          </div>
          <div className="md:border-r md:border-white/10 md:last:border-r-0 py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black tracking-tight">GST</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-white/60 font-bold">Certified</span>
          </div>
          <div className="md:border-r md:border-white/10 md:last:border-r-0 py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black tracking-tight">9</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-white/60 font-bold">Product Categories</span>
          </div>
          <div className="py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 sm:mb-2 font-black tracking-tight">1 Hr</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-white/60 font-bold">Avg Reply Time</span>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF9F6] to-[#E3E2DA] text-[#1A1A18] relative overflow-hidden border-b border-border/10">
        {/* Engineering Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

        {/* Giant Rotating Mechanical Cog Silhouette */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 text-black/[0.015] pointer-events-none select-none z-0">
          <svg
            className="w-full h-full animate-[spin_100s_linear_infinite]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-[#D85A30]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-1/4 left-1/10 w-96 h-96 bg-[#FFB800]/4 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Typographic Details and Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-bold block">
                  Why Choose Us
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#1A1A18]">
                  Why Factories Trust <br/>Bala Enterprise
                </h2>
                <p className="text-sm text-[#888780] leading-relaxed max-w-xl">
                  Practical engineering guidance, highly durable hoisting gear, and fast turnaround response for factories that cannot afford operational downtime. We build for performance and long service life.
                </p>
              </div>

              {/* Grid of benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Built to Last',
                    copy: 'Manufactured with high-tensile steel and premium electrical elements tested for heavy industrial duties.',
                  },
                  {
                    icon: Settings,
                    title: 'Fast Response',
                    copy: 'Quick guidance on spans, load capacity, and customized drawings because downtime costs money.',
                  },
                  {
                    icon: Award,
                    title: 'GST Certified',
                    copy: 'Fully registered compliant B2B manufacturer based in GIDC Bhavnagar so you can claim input tax credit.',
                  },
                  {
                    icon: ArrowRight,
                    title: 'Wide Catalog Range',
                    copy: 'Complete range of overhead EOT cranes, manual hoists, electric winches, stackers, and hand pallet trucks.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group bg-white/30 backdrop-blur-sm border border-black/5 p-4 rounded-lg hover:border-[#D85A30]/25 hover:bg-white/60 transition-all duration-300 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                    {/* Corner Tag Accent */}
                    <div className="absolute top-0 left-0 w-1.5 h-4 bg-[#D85A30]" />
                    <div className="flex-shrink-0 w-10 h-10 rounded bg-[#D85A30]/10 border border-[#D85A30]/20 flex items-center justify-center transition-colors group-hover:bg-[#D85A30] group-hover:text-white duration-300">
                      <item.icon className="h-5 w-5 text-[#D85A30] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading text-sm font-bold text-[#1A1A18] tracking-wide">{item.title}</h3>
                      <p className="text-xs text-[#888780] leading-relaxed">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Link */}
              <div className="pt-4">
                <Link
                  href="#enquire"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-sm shadow-md"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Factory Photo Showcase */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square max-w-md mx-auto lg:max-w-none">
              {/* Decorative borders */}
              <div className="absolute inset-0 border-2 border-black/5 rounded-md transform translate-x-3 translate-y-3 -z-10" />
              <div className="absolute inset-0 border border-[#D85A30]/30 rounded-md transform -translate-x-3 -translate-y-3 -z-10" />

              {/* Main image container */}
              <div className="relative w-full h-full rounded-md overflow-hidden shadow-2xl group border border-black/10 bg-black">
                <Image
                  src="/Images_Factory/chain_hoists_refined.png"
                  alt="Bala Enterprise Factory Workshop"
                  fill
                  className="object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-[#1A1A18]/85 border border-white/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Bala Factory Floor
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#E6E5DF] to-[#D1CFC6] border-t border-b border-border/40 relative overflow-hidden">
        {/* Soft reflection light gradient */}
        <div className="absolute inset-0 bg-white/20 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250px_250px] animate-[pulse_6s_infinite]" />
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-8">
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
      <section className="py-12 sm:py-16 lg:py-24 lg:pb-32 bg-gradient-to-b from-[#FAF9F6] to-[#E5E4DD] relative overflow-hidden border-t border-border/10">
        {/* Interlocking Gear Mechanism Silhouette Backdrop */}
        <div className="absolute -right-16 -top-16 w-80 h-80 text-black/[0.015] pointer-events-none select-none z-0">
          <svg
            className="w-full h-full animate-[spin_120s_linear_infinite]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div className="absolute right-48 -top-8 w-44 h-44 text-black/[0.012] pointer-events-none select-none z-0">
          <svg
            className="w-full h-full animate-[spin_70s_linear_infinite_reverse]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>

        {/* Engineering Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />
        
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#D85A30]/3 blur-[100px] pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12 lg:mb-20">
            <div className="space-y-3">
              <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Manufacturing Hub</span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#1A1A18]">Workshop & Factory Tour</h2>
              <p className="text-sm text-[#888780] max-w-xl leading-relaxed">
                Take a virtual tour of our heavy-duty manufacturing plant and see our production machinery in action.
              </p>
              <div className="h-0.5 w-12 bg-[#D85A30]" />
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold hover:text-[#D85A30] transition-colors flex items-center gap-1 group border-b border-[#1A1A18]/25 pb-0.5 hover:border-transparent duration-300"
            >
              Explore Factory Gallery & Videos
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
 
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
            {projects.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center text-sm text-[#888780] py-10 px-4 bg-[#F5F4F0] border border-border rounded-md">
                Project photos are being added soon. For now, contact us for recent installation references.
              </div>
            ) : (
              projects.map((proj, idx) => (
                <Link
                  key={proj._id}
                  href={`/projects/${proj.slug}`}
                  className="group flex flex-col transition-all duration-300 h-[260px] sm:h-[360px] lg:h-[400px]"
                >
                  {/* Project Image Area (70% height) */}
                  <div className="relative h-[70%] w-full bg-[#F5F4F0] rounded-md overflow-hidden flex items-center justify-center p-2 sm:p-4">
                    {proj.thumbnail ? (
                      <Image
                        src={proj.thumbnail}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#F5F4F0] text-[#888780] text-sm font-bold text-center p-6">
                        {proj.title}
                      </div>
                    )}
                  </div>

                  {/* Project Info Area (30% height) */}
                  <div className="h-[30%] pt-2 sm:pt-3 pb-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors leading-tight line-clamp-2 h-8 sm:h-10">
                        {proj.title}
                      </h3>
                      {proj.location && (
                        <span className="text-[8px] sm:text-[10px] text-[#888780] font-semibold uppercase tracking-wider block mt-0.5 sm:mt-1">
                          {proj.location}
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit">
                      View Project Details
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 group-hover:translate-x-1 transition-transform" />
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
        <section className="py-16 sm:py-20 bg-[#1A1A18] border-t border-b border-white/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#D85A30]/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-bold">Feedback</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-white mb-6 sm:mb-8">What Our Customers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
              {testimonials.map((test) => (
                <div key={test._id} className="bg-white/[0.03] border border-white/10 p-6 space-y-4 rounded-md backdrop-blur-sm transition-all duration-300 hover:border-[#D85A30]/40 hover:bg-white/[0.05]">
                  <div className="flex text-[#D85A30]">
                    {Array(test.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed italic">
                    &ldquo;{test.reviewText}&rdquo;
                  </p>
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.clientName}</h4>
                    {test.companyName && (
                      <span className="text-[10px] text-white/50 mt-0.5 block">{test.companyName}</span>
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
