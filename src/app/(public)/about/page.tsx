import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import FactoryGallery from '@/components/public/FactoryGallery';

export const metadata: Metadata = {
  title: 'About Our Industrial Crane & Hoist Factory | Bala Enterprise',
  description:
    'For over 15 years, Bala Enterprise has made heavy-duty overhead cranes, hoists, stackers, and pallet trucks in our Bhavnagar GIDC workshop, Gujarat.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Years Experience', value: '15+' },
    { label: 'Cranes & Hoists Built', value: '500+' },
    { label: 'Max Load Capacity', value: '50 Ton' },
    { label: 'Safety Verified', value: '100%' },
  ];

  const valueProps = [
    'Made right here inside our Bhavnagar GIDC factory unit.',
    'Heavy load and safety tested before delivery.',
    'GST B2B Tax Invoice provided for your full input tax credit.',
    'Custom size and capacity made as per your factory layout.',
  ];

  return (
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Page Header — Side-by-side text + image on ALL screens */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-12 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />
        
        {/* Side-by-side image on the right */}
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
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-3">
            <p className="label-tech text-[#D85A30] block">
              Bhavnagar GIDC, Gujarat
            </p>
            <h1 className="heading-display uppercase text-white font-black">
              About <span className="text-[#D85A30] italic font-medium">Bala Enterprise.</span>
            </h1>
            <p className="body-text text-white/80 max-w-xl text-xs sm:text-sm leading-relaxed">
              15+ years of making heavy-duty overhead cranes, wire rope hoists, winches, and lifting machinery for factories in Gujarat and across India.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-[#F7EBDD] relative overflow-hidden border-b border-border/10">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <p className="label-tech mb-2">
                Our Story
              </p>
              <h2 className="heading-section text-[#131312] font-black uppercase">
                Who We Are & <br className="hidden sm:block" />
                <span className="text-[#D85A30] italic font-medium">What We Do.</span>
              </h2>
              
              <div className="border-l-2 border-[#D85A30] pl-5 space-y-4 py-1">
                <p className="body-text text-[#131312]/80 leading-relaxed text-sm sm:text-base">
                  Bala Enterprise is located in Bhavnagar GIDC, Gujarat. We started as a small steel workshop and today we are one of the most trusted names for industrial cranes, electric winches, hoists, and material handling equipment. Managed by Mr. Mustufa, our team has built and delivered more than 500 overhead EOT cranes, wire rope hoists, and hydraulic stackers for factories across India.
                </p>
                <p className="body-text text-[#131312]/80 leading-relaxed text-sm sm:text-base">
                  We build heavy machines that last for years without breakdown. From raw steel cutting and welding to final motor fitting and safety load testing, everything is done right inside our Bhavnagar factory. Our customers include shipyards, steel factories, textile mills, cement plants, and warehouses across Gujarat and all over India.
                </p>
              </div>

              {/* Value Props checklist */}
              <div className="pt-4 space-y-3">
                <h3 className="label-tech text-[#131312] mb-3">
                  Why Factory Owners Choose Us:
                </h3>
                <ul className="space-y-3">
                  {valueProps.map((prop, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-600/10 border border-green-600/25 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="body-text text-[#131312] font-medium text-xs sm:text-sm">{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative h-[280px] sm:h-[340px] w-full border border-black/10 p-2 bg-white shadow-sm">
                <div className="relative w-full h-full overflow-hidden group">
                  <Image
                    src="/Images_Factory/inside_factory.png"
                    alt="Bala Enterprise Assembly Workshop"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 bg-[#1A1A18]/85 border border-white/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Bhavnagar Workshop Floor
                  </div>
                </div>
              </div>

              {/* Compliance Box */}
              <div className="bg-[#FCF6ED] border border-border p-6 rounded-none space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#D85A30] shrink-0" />
                  <h3 className="font-heading text-sm font-bold text-[#131312] uppercase tracking-wider">
                    GST & ISO Registered
                  </h3>
                </div>
                <div className="space-y-3 text-xs font-sans text-[#131312]/80 leading-relaxed">
                  <div>
                    <span className="label-tech !text-xs !text-[#131312]/60">GST Invoice Available</span>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-[#D85A30]">GSTIN: 24AIVPM3595R2Z1</p>
                  </div>
                  <div>
                    <span className="label-tech !text-xs !text-[#131312]/60">Quality Certification</span>
                    <p className="mt-0.5">ISO 9001:2015 certified quality manufacturing and safety testing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-[#131312] text-white py-14 border-t border-b border-white/10 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '1.5rem 1.5rem' 
          }} 
        />
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 md:border-r md:border-white/10 md:last:border-r-0 py-2">
              <div className="font-heading text-4xl lg:text-5xl font-black text-[#D85A30]">{stat.value}</div>
              <div className="label-tech text-white/60 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Production Facilities Bento Gallery */}
      <FactoryGallery />

      {/* Bottom CTA Banner */}
      <section className="bg-[#1A1A18] text-white py-16 border-t border-[#2A2A28] relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />
        <div className="section-container max-w-4xl text-center space-y-6 relative z-10">
          <p className="label-tech text-[#D85A30]">Get Price Quote</p>
          <h2 className="heading-section text-white font-black uppercase">
            Need a Crane or Hoist for Your Factory?
          </h2>
          <p className="body-text text-white/70 max-w-xl mx-auto leading-relaxed">
            Call or send us your requirements. Our team will help you choose the right capacity and send you a fast price quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-[#D85A30] text-white hover:bg-[#c24a24] text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-md"
            >
              Get Price Quote
            </Link>
            <a
              href="tel:+919825214214"
              className="px-6 py-3.5 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 rounded-none"
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
