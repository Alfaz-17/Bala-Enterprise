import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Factory, Calendar, Award, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import FactoryGallery from '@/components/public/FactoryGallery';

export const metadata: Metadata = {
  title: 'About Our Industrial Crane & Hoist Factory | Bala Enterprise',
  description:
    'For over 15 years, Bala Enterprise has fabricated heavy-duty overhead cranes, hoists, stackers, and pallet trucks in our Bhavnagar GIDC workshop, Gujarat.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Years of Excellence', value: '15+' },
    { label: 'Cranes Commissioned', value: '500+' },
    { label: 'Max Lifting Capacity', value: '50 Ton' },
    { label: 'Safety Verification', value: '100%' },
  ];

  const valueProps = [
    '100% In-House Fabrication at our Bhavnagar GIDC facility',
    'IS Standard compliance with rigorous safety overload tests',
    'GST Certified Manufacturer (GSTIN: 24AIVPM3595R2Z1)',
    'Custom design and span engineering tailored to your workshop layout',
  ];



  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A18] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      {/* Page Header — Side-by-side text + image on ALL screens */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 border-b border-[#2A2A28]">
        {/* Slanted Image Block — visible on ALL screen sizes */}
        <div className="absolute top-0 right-0 h-full w-[42%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[12deg] sm:skew-x-[15deg] -translate-x-[8%] sm:-translate-x-[10%] w-[130%] h-full">
            <Image
              src="/Image_from_internet/pexels-cmrcn-29224563.jpg"
              alt="About Bala Enterprise"
              fill
              priority
              className="object-cover object-center opacity-60 sm:opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/40 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <span className="text-[#D85A30] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold block">
              Quality Lifting Engineering
            </span>
            <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              About Bala Enterprise
            </h1>
            <p className="text-[11px] sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Learn about our 15+ years journey of fabricating, safety testing, and commissioning industrial material handling machinery in Gujarat.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content (Story & Left Border Style) */}
      <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#E3E2DA] relative overflow-hidden border-b border-border/10">
        {/* Engineering blueprint dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold block">
                Our History & Vision
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#1A1A18] leading-tight">
                Engineering heavy material handling solutions with safety at the core.
              </h2>
              
              <div className="border-l-2 border-[#D85A30]/50 pl-4 space-y-4">
                <p className="text-sm text-[#888780] leading-relaxed">
                  Founded and operated in the heart of Bhavnagar GIDC, Gujarat, Bala Enterprise has grown from a local steel workshop into a premier industrial manufacturing brand. Under the management of Mr. Mustufa, our engineering desk has successfully designed and fabricated over 500 overhead EOT cranes, heavy-duty electric winches, and hydraulic stackers.
                </p>
                <p className="text-sm text-[#888780] leading-relaxed">
                  We specialize in end-to-end B2B solutions. We do not just assemble components; we construct structural girders, wind high-tensile drums, and carry out physical overload tests on our rigs to match national IS Standards. Our clients span multiple industries including shipbuilding, textile mills, cement manufacturing, steel workshops, and logistics hubs.
                </p>
              </div>

              {/* Value Props checklist matching home reference */}
              <div className="pt-6 space-y-3">
                <h3 className="font-heading text-xs uppercase tracking-wider font-bold text-[#1A1A18] mb-4">
                  Why Factory Owners Trust Us:
                </h3>
                <ul className="space-y-3">
                  {valueProps.map((prop, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs md:text-sm text-[#1A1A18] font-medium">{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Factory Image & Compliance Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative h-[280px] sm:h-[340px] w-full rounded-md overflow-hidden shadow-md border border-border">
                <Image
                  src="/Images_Factory/factory_hangar_refined.png"
                  alt="Bala Enterprise Factory Hangar"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-[#1A1A18]/85 border border-white/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Bala Workshop Hangar Tour
                </div>
              </div>

              {/* Compliance Box */}
              <div className="bg-[#F5F4F0] border border-border p-6 rounded-md space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#D85A30] flex-shrink-0" />
                  <h3 className="font-heading text-sm font-bold text-[#1A1A18]">
                    Compliance & Verification
                  </h3>
                </div>
                <div className="space-y-3 text-xs text-[#888780] leading-relaxed">
                  <div>
                    <h4 className="font-bold text-[#1A1A18] uppercase tracking-wider text-[9px]">Registered GST Identification</h4>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-[#D85A30]">GSTIN: 24AIVPM3595R2Z1</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A18] uppercase tracking-wider text-[9px]">Manufacturing Certification</h4>
                    <p className="mt-0.5">ISO 9001:2015 Certified Management and structural welding standards compliance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-gradient-to-b from-[#E6E5DF] to-[#D1CFC6] py-16 border-t border-b border-border/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="font-heading text-4xl lg:text-5xl font-black text-[#D85A30]">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#888780] font-bold mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Video Section */}
      <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#E5E4DD] relative overflow-hidden border-b border-border/10">
        {/* Engineering blueprint dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* Interlocking Gear Mechanism Silhouette Backdrop */}
        <div className="absolute -left-16 -top-16 w-80 h-80 text-black/[0.012] pointer-events-none select-none z-0">
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
        <div className="absolute left-48 -top-8 w-44 h-44 text-black/[0.01] pointer-events-none select-none z-0">
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
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold block">
              Why Choose Us
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#1A1A18]">
              Why Factories Trust Bala Enterprise
            </h2>
            <div className="h-0.5 w-12 bg-[#D85A30] mx-auto" />
            <p className="text-sm text-[#888780] max-w-xl mx-auto leading-relaxed">
              Practical engineering guidance, highly durable hoisting gear, and fast turnaround response for factories that cannot afford operational downtime. We build for performance and long service life.
            </p>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden shadow-2xl border border-border bg-[#1A1A18]">
            <video
              src="/products_showcase.MP4"
              poster="/Images_Factory/factory_hangar_refined.png"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Production Facilities Bento Gallery */}
      <FactoryGallery />

      {/* Bottom CTA Banner */}
      <section className="bg-[#1A1A18] text-white py-16 border-t border-[#2A2A28]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl font-black">
            Need a Custom Lifting Rig for Your Factory Layout?
          </h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Our engineering team will sketch drawing layouts, select speed ratios, and quote competitive pricing within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-[#D85A30] text-white hover:bg-[#c24a24] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm shadow-md"
            >
              Get drawing layout quote
            </Link>
            <a
              href="tel:+919825214214"
              className="px-6 py-3.5 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 rounded-sm"
            >
              <Phone className="h-4 w-4 text-[#D85A30]" />
              Call +91 98252 14214
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
