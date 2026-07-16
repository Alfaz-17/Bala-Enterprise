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
import EnquiryForm from '@/components/public/EnquiryForm';
import ProductCard from '@/components/public/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bala Enterprise | Manual Hydraulic Stackers & Hand Pallet Trucks Bhavnagar',
  description:
    'Leading manufacturer and supplier of Manual Hydraulic Stackers, Hand Pallet Trucks, Scissor Lift Tables, and Drum Tilters based in Bhavnagar, Gujarat, India.',
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#1A1A18] text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(216,90,48,0.12),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold block">
              Heavy Duty Industrial Cranes
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Lifting Industries with Engineering Precision
            </h1>
            <p className="text-sm text-[#888780] max-w-xl leading-relaxed">
              We design, manufacture, and commission Overhead Cranes, Gantry Cranes, Jib Cranes, and custom industrial lift gear. Built for high performance, reliability, and maximum factory safety.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 bg-[#D85A30] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Explore Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#enquire"
                className="px-6 py-3 border border-white/20 hover:border-white/50 text-white text-sm font-medium transition-colors"
              >
                Request Quotation
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-[250px] sm:h-[350px] border border-white/10 overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
              alt="Bala Enterprise Overhead Cranes"
              fill
              className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A18]/80 to-zinc-900/95 flex flex-col justify-center p-8 space-y-4">
              <div className="text-[#D85A30] font-heading text-5xl font-black">100%</div>
              <div className="text-sm font-semibold tracking-wider uppercase text-white">Custom Manufactured</div>
              <p className="text-[11px] text-[#888780] leading-relaxed">
                Complying with IS 3177 and IS 807 design standards for heavy-duty industrial crane engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-[#F5F4F0] py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-heading text-3xl font-bold text-[#1A1A18]">15+</div>
            <div className="text-[10px] uppercase tracking-wider text-[#888780] mt-1">Years of Excellence</div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#1A1A18]">500+</div>
            <div className="text-[10px] uppercase tracking-wider text-[#888780] mt-1">Cranes Commissioned</div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#1A1A18]">50 Ton</div>
            <div className="text-[10px] uppercase tracking-wider text-[#888780] mt-1">Max Lift Capacity</div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#1A1A18]">100%</div>
            <div className="text-[10px] uppercase tracking-wider text-[#888780] mt-1">Safety Compliant</div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Our Portfolio</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A18]">Equipment Categories</h2>
            <div className="h-0.5 w-12 bg-[#D85A30] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.length === 0 ? (
              <div className="col-span-3 text-center text-sm text-[#888780] py-12">No categories defined yet.</div>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="group block relative bg-[#F5F4F0] border border-border overflow-hidden h-72"
                >
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#F5F4F0] to-white flex items-center justify-center text-[#888780] font-heading text-xl font-bold">
                      {cat.name}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#D85A30] transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] text-[#888780] mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#F5F4F0] border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-3">
              <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Reliable Material Handling</span>
              <h2 className="font-heading text-3xl font-bold text-[#1A1A18]">Featured Equipment</h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold hover:text-[#D85A30] transition-colors flex items-center gap-1 group"
            >
              View Full Catalog
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Completed installations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-3">
              <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Our Track Record</span>
              <h2 className="font-heading text-3xl font-bold text-[#1A1A18]">Recent Commissions</h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold hover:text-[#D85A30] transition-colors flex items-center gap-1 group"
            >
              All Completed Installations
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              <div className="col-span-3 text-center text-sm text-[#888780] py-12">No installations listed yet.</div>
            ) : (
              projects.map((proj) => (
                <Link
                  key={proj._id}
                  href={`/projects/${proj.slug}`}
                  className="group block relative bg-[#F5F4F0] border border-border h-72 overflow-hidden"
                >
                  {proj.thumbnail ? (
                    <Image
                      src={proj.thumbnail}
                      alt={proj.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F5F4F0] text-[#888780] text-sm font-bold text-center p-6">
                      {proj.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#D85A30] transition-colors line-clamp-2">
                      {proj.title}
                    </h3>
                    {proj.location && (
                      <span className="text-xs text-[#888780] mt-1">{proj.location}</span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-[#F5F4F0] border-t border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Feedback</span>
            <h2 className="font-heading text-3xl font-bold text-[#1A1A18] mb-8">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {testimonials.map((test) => (
                <div key={test._id} className="bg-white border border-border p-6 space-y-4">
                  <div className="flex text-[#D85A30]">
                    {Array(test.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                  </div>
                  <p className="text-xs text-[#1A1A18] leading-relaxed italic">
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

      {/* Enquiry Form */}
      <section id="enquire" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold">Contact Us</span>
            <h2 className="font-heading text-3xl font-bold text-[#1A1A18]">Request Custom Crane Quote</h2>
            <div className="h-0.5 w-12 bg-[#D85A30] mx-auto" />
            <p className="text-xs text-[#888780] max-w-md mx-auto pt-1 leading-relaxed">
              Submit your project layout details, and our engineering desk will send you drawing layouts and pricing within 24 hours.
            </p>
          </div>

          <div className="bg-[#F5F4F0] border border-border p-6 sm:p-8">
            <EnquiryForm sourcePage="homepage" />
          </div>
        </div>
      </section>
    </div>
  );
}
