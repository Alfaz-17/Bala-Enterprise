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
    <div className="bg-[#F5F4F0] min-h-screen text-[#1A1A18]">
      {/* Page Header (Slanted High-Contrast Style) */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Slanted Design Background shape */}
        <div className="absolute top-0 right-0 h-full w-[45%] bg-[#D85A30] origin-top-right transform skew-x-[-15deg] translate-x-[15%] z-0 hidden lg:block" />
        <div className="absolute inset-0 bg-[#D85A30] z-0 lg:hidden opacity-90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[#D85A30] lg:text-primary text-xs uppercase tracking-[0.2em] font-bold block">
              Quality Lifting Engineering
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
              About Bala Enterprise
            </h1>
            <p className="text-sm text-white/80 max-w-xl">
              Learn about our 15+ years journey of fabricating, safety testing, and commissioning industrial material handling machinery in Gujarat.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content (Story & Left Border Style) */}
      <section className="py-20 bg-white">
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

            {/* Certifications and GST sidebar */}
            <div className="lg:col-span-5 bg-[#F5F4F0] border border-border p-8 rounded-md space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#D85A30] flex-shrink-0" />
                <h3 className="font-heading text-base font-bold text-[#1A1A18]">
                  Compliance & Verification
                </h3>
              </div>
              <div className="space-y-4 text-xs text-[#888780] leading-relaxed">
                <div>
                  <h4 className="font-bold text-[#1A1A18] uppercase tracking-wider text-[10px]">Registered GST Identification</h4>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-[#D85A30]">GSTIN: 24AIVPM3595R2Z1</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A18] uppercase tracking-wider text-[10px]">Manufacturing Certification</h4>
                  <p className="mt-0.5">ISO 9001:2015 Certified Management and structural welding standards compliance.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A18] uppercase tracking-wider text-[10px]">Safety Overload Verification</h4>
                  <p className="mt-0.5">Every hoister hook, gear pulley block, and manual stacker cylinder is tested to 125% of its rated lifting capacity before shipping.</p>
                </div>
              </div>
              <div className="border-t border-border pt-6">
                <Link
                  href="/contact"
                  className="w-full block text-center py-3 bg-[#1A1A18] text-white hover:bg-[#D85A30] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
                >
                  Contact Engineering Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-[#F5F4F0] py-16 border-t border-b border-border">
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
