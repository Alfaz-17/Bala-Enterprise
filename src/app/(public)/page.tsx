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
import { SiteSettings } from '@/models/SiteSettings';
import ProductCard from '@/components/public/ProductCard';
import FactoryGallery from '@/components/public/FactoryGallery';
import HeroCategoriesBento from '@/components/public/HeroCategoriesBento';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar',
  description:
    'GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.',
  keywords: [
    'Bala Enterprise',
    'Bala Enterprises',
    'Bala Enterprise Bhavnagar',
    'Bala Enterprise Gujarat',
    'Bala Enterprise India',
    'Overhead Cranes Bhavnagar',
    'Wire Rope Hoists Gujarat',
    'Electric Winches Manufacturer',
    'Industrial Lifting Equipment Bhavnagar',
    'GST Certified Crane Manufacturer'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar',
    description:
      'GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.',
    url: 'https://www.balaenterprise.in',
    type: 'website',
    images: [
      {
        url: '/Images_Factory/inside_factory.png',
        width: 1200,
        height: 630,
        alt: 'Bala Enterprise Factory Workshop',
      },
    ],
  },
};

export const dynamic = 'force-dynamic';

async function getHomePageData() {
  await connectToDatabase();

  const [categories, featuredProducts, projects, testimonials, settings] = await Promise.all([
    Category.find({ status: 'active' }).sort({ sortOrder: 1 }).limit(50).lean(),
    Product.find({ status: 'active', featured: true }).limit(6).lean(),
    Project.find({ status: 'active' }).sort({ completedDate: -1, createdAt: -1 }).limit(3).lean(),
    Testimonial.find({ status: 'active' }).sort({ createdAt: -1 }).limit(4).lean(),
    SiteSettings.find().lean(),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.settingKey] = s.settingValue;
  }

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
    settings: settingsMap,
  };
}

export default async function HomePage() {
  const { categories, products, testimonials, settings } = await getHomePageData();

  const sameAsLinks = [
    settings.tradeindia_url || 'https://www.tradeindia.com/bala-enterprise-24235777/',
    settings.indiamart_url || 'https://www.indiamart.com/balaenterprises-gujarat/profile.html?srsltid=AfmBOoo-CME_id8olb_pyMrBd8IurDJTfC_G5k_UzNsao729y8RASlvF',
  ];
  if (settings.facebook_url) sameAsLinks.push(settings.facebook_url);
  if (settings.instagram_url) sameAsLinks.push(settings.instagram_url);
  if (settings.linkedin_url) sameAsLinks.push(settings.linkedin_url);
  if (settings.youtube_url) sameAsLinks.push(settings.youtube_url);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.balaenterprise.in/#organization',
    name: 'Bala Enterprise',
    url: 'https://www.balaenterprise.in',
    logo: 'https://www.balaenterprise.in/logo.png',
    image: 'https://www.balaenterprise.in/Images_Factory/inside_factory.png',
    description:
      'GST certified manufacturer of overhead cranes, wire rope hoists, winches, stackers, pallet trucks, and industrial lifting equipment in Bhavnagar GIDC, Gujarat.',
    telephone: settings.phone_number || '+919825214214',
    email: settings.email || 'info@balaenterprise.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || 'Bala Enterprise Factory, Bhavnagar GIDC Industrial Area',
      addressLocality: 'Bhavnagar',
      addressRegion: 'Gujarat',
      postalCode: '364001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.752',
      longitude: '72.1009',
    },
    sameAs: sameAsLinks,
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
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
            className="w-full h-full object-cover opacity-85 filter brightness-100 contrast-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-[#D85A30]/5 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131312]/20 via-[#131312]/40 to-[#131312]/80 pointer-events-none" />
        </div>

        {/* Blueprint Dot Grid */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '2.5rem 2.5rem' 
          }} 
        />

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 sm:pt-32 lg:pt-40 pb-16 flex items-center">
          <div className="max-w-md text-left space-y-2.5">
            <span className="label-tech !text-[9px] sm:!text-[10px] tracking-[0.2em] block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-[#D85A30]">
              Bala Enterprise | Industrial Cranes & Hoists
            </span>
            
            <h1 className="font-heading uppercase text-white font-black tracking-tight text-xl sm:text-2xl md:text-3xl leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Bala Enterprise <br />
              <span className="text-base sm:text-lg md:text-xl block text-white/90 font-medium normal-case tracking-tight mt-1 mb-2">
                Cranes, Hoists & Winches
              </span>
              <span className="text-[#D85A30] italic font-medium">Built Heavy for Factory Work.</span>
            </h1>
            
            <p className="font-sans text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Bala Enterprise is a leading manufacturer of strong overhead cranes, wire rope hoists & lifting machinery in Bhavnagar, Gujarat. Built for heavy factory work.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-[#D85A30] text-white text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-none shadow-md"
              >
                Get Price Quote
              </Link>
              <Link
                href="/products"
                className="px-5 py-2.5 border border-white/40 text-white hover:border-white hover:bg-white/10 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-colors rounded-none bg-black/40 backdrop-blur-xs"
              >
                Browse Inventory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02. TRUST STATS STRIP (Light section between Hero and Categories) */}
      <section className="bg-[#F7EBDD] py-10 border-b border-black/10 relative overflow-hidden text-[#131312]">
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.8) 1px, transparent 0)', 
            backgroundSize: '1.5rem 1.5rem' 
          }} 
        />

        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
          <div className="md:border-r md:border-black/10 py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 font-black">15+</span>
            <span className="label-tech !text-[#131312]/70">Years Experience</span>
          </div>
          <div className="md:border-r md:border-black/10 py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#131312] block mb-1 font-black">500+</span>
            <span className="label-tech !text-[#131312]/70">Cranes & Hoists Built</span>
          </div>
          <div className="md:border-r md:border-black/10 py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#D85A30] block mb-1 font-black">50 Ton</span>
            <span className="label-tech !text-[#131312]/70">Max Load Capacity</span>
          </div>
          <div className="py-2">
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#131312] block mb-1 font-black">100%</span>
            <span className="label-tech !text-[#D85A30]">Safety Verified</span>
          </div>
        </div>
      </section>

      {/* 03. CATEGORIES CAROUSEL BENTO */}
      <HeroCategoriesBento categories={categories} />

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

          {/* Grid Layout (2 Columns on Mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
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
      <section className="py-16 lg:py-28 bg-[#131312] text-white relative overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '2rem 2rem' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div>
                <p className="label-tech mb-2">
                  Why Buy From Us
                </p>
                <h2 className="heading-section text-white font-black uppercase">
                  Why Factory Owners Trust <span className="text-[#D85A30] italic font-medium">Bala Enterprise.</span>
                </h2>
                <p className="body-text text-white/70 mt-3 leading-relaxed max-w-xl text-xs sm:text-sm">
                  We give simple technical advice, heavy-duty long lasting machinery, and fast reply for factory owners who need zero breakdown work.
                </p>
              </div>

              {/* Feature Cards (2 Columns on Mobile for Neat Alignment) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Heavy Duty Steel',
                    copy: 'Made with tested strong steel and powerful heavy motors.',
                  },
                  {
                    icon: Settings,
                    title: 'Fast Technical Help',
                    copy: 'Quick guidance on crane size and drawing layout.',
                  },
                  {
                    icon: Award,
                    title: 'GST Registered Factory',
                    copy: 'Proper GST B2B invoice for full input tax credit.',
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Full Product Range',
                    copy: 'Complete range of Cranes, Hoists, Winches & Stackers.',
                  },
                ].map((item) => (
                  <div 
                    key={item.title} 
                    className="p-4 sm:p-6 bg-white/5 border border-white/10 hover:border-[#D85A30]/50 transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D85A30]/20 text-[#D85A30] flex items-center justify-center mb-3 border border-[#D85A30]/30 group-hover:bg-[#D85A30] group-hover:text-white transition-colors">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1">{item.title}</h3>
                    <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed font-sans">{item.copy}</p>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#D85A30] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-none shadow-md"
                >
                  <span>Visit Our Factory</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Workshop Image Showcase */}
            <div className="lg:col-span-5 relative w-full h-[240px] sm:h-[320px] lg:h-[440px]">
              <div className="relative w-full h-full border border-white/10 p-2 bg-white/5">
                <div className="relative w-full h-full overflow-hidden group">
                  <Image
                    src="/Images_Factory/inside_factory.png"
                    alt="Bala Enterprise Factory Workshop"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <span className="label-tech !text-white/80 block mb-0.5 !text-[9px] sm:!text-[10px]">Bhavnagar GIDC Factory</span>
                    <h4 className="font-heading text-xs sm:text-sm md:text-base font-bold text-white uppercase">Inside Factory Workshop</h4>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 06. FACTORY GALLERY SHOWCASE */}
      <FactoryGallery />

      {/* 07. TESTIMONIALS (Dark Technical Glass Cards) */}
      {testimonials.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#131312] text-white border-t border-white/10 relative overflow-hidden">
          {/* Blueprint Dot Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '1.5rem 1.5rem' 
            }} 
          />

          <div className="section-container max-w-5xl relative z-10">
            <div className="text-center mb-10 sm:mb-14 space-y-2">
              <p className="label-tech text-[#D85A30]">Client Reviews</p>
              <h2 className="heading-section text-white font-black uppercase">
                What Our Customers <span className="text-[#D85A30] italic font-medium">Say.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {testimonials.map((test) => (
                <div 
                  key={test._id} 
                  className="bg-white/5 border border-white/10 hover:border-[#D85A30]/50 p-5 sm:p-8 transition-all duration-300 relative group overflow-hidden shadow-lg"
                >
                  {/* Top Edge Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D85A30] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#D85A30] mb-3 sm:mb-5">
                    {Array(test.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                      ))}
                  </div>

                  {/* Review Quote Text */}
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans italic mb-5 sm:mb-8 relative z-10">
                    &ldquo;{test.reviewText}&rdquo;
                  </p>

                  {/* Client Info Footer */}
                  <div className="border-t border-white/10 pt-4 sm:pt-5 flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#D85A30]/20 text-[#D85A30] border border-[#D85A30]/30 flex items-center justify-center font-heading font-black text-xs shrink-0">
                      {test.clientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                        {test.clientName}
                      </h4>
                      {test.companyName && (
                        <span className="label-tech !text-[9px] !text-white/60 block mt-0.5">
                          {test.companyName}
                        </span>
                      )}
                    </div>
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
