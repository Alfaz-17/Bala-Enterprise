import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Award, Phone, FileCheck, ShieldAlert, Factory, Wrench, Flame, Truck, Anchor, Building2, HardHat, Warehouse } from 'lucide-react';
import type { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import { SiteSettings } from '@/models/SiteSettings';

export const metadata: Metadata = {
  title: 'About Our Factory & Manufacturing Process | Bala Enterprise',
  description:
    'ISO 9001:2015 certified manufacturer of overhead cranes, wire rope hoists, and electric winches in Bhavnagar GIDC, Gujarat. Learn how we build and test your heavy lifting machines.',
  alternates: {
    canonical: '/about',
  },
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  await connectToDatabase();
  const settings = await SiteSettings.find().lean();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.settingKey] = s.settingValue;
  }

  const phoneDisplay = settingsMap.phone_number || '+91 98252 14214';
  const phoneLink = phoneDisplay.replace(/\s+/g, '');
  const stats = [
    { label: 'Years Experience', value: '15+' },
    { label: 'Cranes & Hoists Built', value: '500+' },
    { label: 'Max Load Capacity', value: '50 Ton' },
    { label: 'Safety Verified', value: '100%' },
  ];

  const certifications = [
    {
      icon: Award,
      title: 'ISO 9001:2015 Certified',
      subtitle: 'Quality Management & Manufacturing',
      desc: 'Our factory follows strict quality control for steel fabrication, welding quality, and machine assembly.',
    },
    {
      icon: FileCheck,
      title: 'GST B2B Registered',
      subtitle: 'GSTIN: 24AIVPM3595R2Z1',
      desc: 'Get full B2B tax invoice with every order so your business can claim complete input tax credit (ITC).',
    },
    {
      icon: ShieldCheck,
      title: 'Full Load & Safety Tested',
      subtitle: '100% Factory Overload Test',
      desc: 'Every crane, wire rope hoist, and winch is physically load-tested on our testing rig before leaving the factory.',
    },
    {
      icon: ShieldAlert,
      title: 'Factory Guarantee & Parts Support',
      subtitle: 'Direct Manufacturer Support',
      desc: 'We provide full warranty support, spare parts, and fast service for all our lifting equipment.',
    },
  ];

  const manufacturingSteps = [
    {
      step: '01',
      icon: Factory,
      title: 'Steel Plate & Girder Cutting',
      desc: 'We select tested heavy steel plates and girders, precision-cut for your exact factory span and load weight.',
    },
    {
      step: '02',
      icon: Flame,
      title: 'Heavy Welding & Motor Fitting',
      desc: 'Our experienced welders fabricate main girders, end carriages, drum winches, and fit heavy copper-wound motors.',
    },
    {
      step: '03',
      icon: Wrench,
      title: 'Factory Overload Safety Test',
      desc: 'Every completed hoist and crane is tested on our factory overload test rig to guarantee 100% safe operation.',
    },
    {
      step: '04',
      icon: Truck,
      title: 'GST Invoice & Safe Dispatch',
      desc: 'We prepare your GST tax invoice, pack all components safely, and dispatch directly to your factory site anywhere in India.',
    },
  ];

  const industriesServed = [
    {
      icon: Anchor,
      title: 'Shipbuilding & Alang Port',
      desc: 'Heavy winches and gantry cranes for ship repair, plate lifting, and marine work.',
    },
    {
      icon: Building2,
      title: 'Steel Mills & Metal Works',
      desc: 'High-capacity EOT cranes for moving steel billets, coils, and scrap metal.',
    },
    {
      icon: HardHat,
      title: 'Cement & Construction',
      desc: 'Heavy-duty electric winches and floor cranes built for continuous outdoor work.',
    },
    {
      icon: Warehouse,
      title: 'Warehouses & Logistics',
      desc: 'Hydraulic stackers, hand pallet trucks, and scissor lifts for fast goods loading.',
    },
  ];

  const valueProps = [
    'Made right here inside our Bhavnagar GIDC factory unit.',
    'Heavy load and safety tested before delivery.',
    'GST B2B Tax Invoice provided for your full input tax credit.',
    'Custom size and capacity made as per your factory layout.',
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.balaenterprise.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: 'https://www.balaenterprise.in/about',
      },
    ],
  };

  return (
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Page Header — Mobile Native Text Width */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-10 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />
        
        {/* Side-by-side image on the right */}
        <div className="absolute top-0 right-0 h-full w-[38%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[12deg] sm:skew-x-[15deg] -translate-x-[8%] sm:-translate-x-[10%] w-[130%] h-full">
            <Image
              src="/Image_from_internet/pexels-cmrcn-29224563.jpg"
              alt="About Bala Enterprise Factory"
              fill
              priority
              className="object-cover object-center opacity-60 sm:opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/40 to-transparent" />
          </div>
        </div>
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[65%] sm:max-w-[55%] lg:max-w-[60%] space-y-2 sm:space-y-3">
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
      <section className="py-16 sm:py-20 bg-[#F7EBDD] relative overflow-hidden border-b border-border/10">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <p className="label-tech mb-1">
                Our Story
              </p>
              <h2 className="heading-section text-[#131312] font-black uppercase">
                Who We Are & <br className="hidden sm:block" />
                <span className="text-[#D85A30] italic font-medium">What We Do.</span>
              </h2>
              
              <div className="border-l-2 border-[#D85A30] pl-4 sm:pl-5 space-y-4 py-1">
                <p className="body-text text-[#131312]/80 leading-relaxed text-xs sm:text-base">
                  Bala Enterprise is located in Bhavnagar GIDC, Gujarat. We started as a small steel workshop and today we are one of the most trusted names for industrial cranes, electric winches, hoists, and material handling equipment. Managed by Mr. Mustufa, our team has built and delivered more than 500 overhead EOT cranes, wire rope hoists, and hydraulic stackers for factories across India.
                </p>
                <p className="body-text text-[#131312]/80 leading-relaxed text-xs sm:text-base">
                  We build heavy machines that last for years without breakdown. From raw steel cutting and welding to final motor fitting and safety load testing, everything is done right inside our Bhavnagar factory. Our customers include shipyards, steel factories, textile mills, cement plants, and warehouses across Gujarat and all over India.
                </p>
              </div>

              {/* Value Props checklist */}
              <div className="pt-2 space-y-3">
                <h3 className="label-tech text-[#131312] mb-2">
                  Why Factory Owners Choose Us:
                </h3>
                <ul className="space-y-2.5">
                  {valueProps.map((prop, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-600/10 border border-green-600/25 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="body-text text-[#131312] font-medium text-xs sm:text-sm">{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative h-[240px] sm:h-[320px] lg:h-[360px] w-full border border-black/10 p-2 bg-white shadow-sm">
                <div className="relative w-full h-full overflow-hidden group">
                  <Image
                    src="/Images_Factory/inside_factory.png"
                    alt="Bala Enterprise Assembly Workshop"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1A1A18]/85 border border-white/10 px-2.5 py-1.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Bhavnagar Workshop Floor
                  </div>
                </div>
              </div>

              {/* Quick Compliance Card */}
              <div className="bg-[#FCF6ED] border border-border p-5 sm:p-6 rounded-none space-y-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#D85A30] shrink-0" />
                  <h3 className="font-heading text-xs sm:text-sm font-bold text-[#131312] uppercase tracking-wider">
                    GST & ISO Certified
                  </h3>
                </div>
                <div className="space-y-2 text-xs font-sans text-[#131312]/80 leading-relaxed">
                  <div>
                    <span className="label-tech !text-[10px] !text-[#131312]/60">GST Invoice Available</span>
                    <p className="mt-0.5 font-mono text-xs sm:text-sm font-semibold text-[#D85A30]">GSTIN: 24AIVPM3595R2Z1</p>
                  </div>
                  <div>
                    <span className="label-tech !text-[10px] !text-[#131312]/60">Quality Certification</span>
                    <p className="mt-0.5 text-[11px] sm:text-xs">ISO 9001:2015 certified manufacturing and safety load testing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: OUR 4-STEP MANUFACTURING & TESTING PROCESS */}
      <section className="py-16 sm:py-20 bg-[#131312] text-white relative overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '1.5rem 1.5rem' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <p className="label-tech text-[#D85A30]">Factory Process</p>
            <h2 className="heading-section text-white font-black uppercase">
              How We Build & Test <span className="text-[#D85A30] italic font-medium">Your Machines.</span>
            </h2>
            <p className="body-text text-white/70 text-xs sm:text-sm leading-relaxed">
              Every crane and hoist is manufactured step-by-step inside our Bhavnagar GIDC workshop before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {manufacturingSteps.map((item) => (
              <div 
                key={item.step} 
                className="p-5 sm:p-6 bg-white/5 border border-white/10 hover:border-[#D85A30]/50 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#D85A30]/20 text-[#D85A30] flex items-center justify-center border border-[#D85A30]/30 group-hover:bg-[#D85A30] group-hover:text-white transition-colors">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-heading text-lg sm:text-xl font-black text-white/30 group-hover:text-[#D85A30] transition-colors">{item.step}</span>
                </div>
                <h3 className="font-heading text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1.5">{item.title}</h3>
                <p className="body-text text-white/70 text-[11px] sm:text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: INDUSTRIES WE SERVE ACROSS INDIA (2-Columns on Mobile) */}
      <section className="py-16 sm:py-20 bg-[#F7EBDD] relative overflow-hidden border-b border-black/10">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <p className="label-tech text-[#D85A30]">Our Clients</p>
            <h2 className="heading-section text-[#131312] font-black uppercase">
              Industries We Serve <span className="text-[#D85A30] italic font-medium">Across India.</span>
            </h2>
            <p className="body-text text-[#131312]/80 text-xs sm:text-sm leading-relaxed">
              We supply heavy lifting machinery for factories, shipyards, warehouses, and industrial plants across Gujarat and India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {industriesServed.map((ind) => (
              <div 
                key={ind.title} 
                className="p-4 sm:p-6 bg-white border border-black/10 hover:border-[#D85A30]/50 transition-all duration-300 shadow-sm"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D85A30]/10 text-[#D85A30] flex items-center justify-center mb-3 border border-[#D85A30]/20">
                  <ind.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-heading text-xs sm:text-sm font-bold text-[#131312] uppercase tracking-wider mb-1">{ind.title}</h3>
                <p className="body-text text-[#131312]/70 text-[11px] sm:text-xs leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR CERTIFICATIONS & GUARANTEES SECTION */}
      <section className="py-16 sm:py-20 bg-[#131312] text-white relative overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '1.5rem 1.5rem' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <p className="label-tech text-[#D85A30]">Our Certifications</p>
            <h2 className="heading-section text-white font-black uppercase">
              Certifications & <span className="text-[#D85A30] italic font-medium">Quality Guarantees.</span>
            </h2>
            <p className="body-text text-white/70 text-xs sm:text-sm leading-relaxed">
              We maintain full government and ISO compliance so your factory gets genuine quality machinery and proper GST tax invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {certifications.map((cert) => (
              <div 
                key={cert.title} 
                className="p-5 sm:p-8 bg-white/5 border border-white/10 hover:border-[#D85A30]/50 transition-all duration-300 relative group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D85A30]/20 text-[#D85A30] flex items-center justify-center mb-4 sm:mb-5 border border-[#D85A30]/30 group-hover:bg-[#D85A30] group-hover:text-white transition-colors">
                  <cert.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="label-tech !text-[#D85A30] block mb-1">{cert.subtitle}</span>
                <h3 className="font-heading text-sm sm:text-lg font-bold text-white uppercase tracking-wider mb-1.5">{cert.title}</h3>
                <p className="body-text text-white/70 text-xs sm:text-sm leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-[#1A1A18] text-white py-10 sm:py-14 border-b border-white/10 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '1.5rem 1.5rem' 
          }} 
        />
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 md:border-r md:border-white/10 md:last:border-r-0 py-2">
              <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#D85A30]">{stat.value}</div>
              <div className="label-tech text-white/60 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#1A1A18] text-white py-14 sm:py-16 border-t border-[#2A2A28] relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />
        <div className="section-container max-w-4xl text-center space-y-4 sm:space-y-6 relative z-10">
          <p className="label-tech text-[#D85A30]">Get Price Quote</p>
          <h2 className="heading-section text-white font-black uppercase">
            Need a Crane or Hoist for Your Factory?
          </h2>
          <p className="body-text text-white/70 max-w-xl mx-auto leading-relaxed text-xs sm:text-sm">
            Call or send us your requirements. Our team will help you choose the right capacity and send you a fast price quote.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="px-5 py-3 bg-[#D85A30] text-white hover:bg-[#c24a24] text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-md"
            >
              Get Price Quote
            </Link>
            <a
              href={`tel:${phoneLink}`}
              className="px-5 py-3 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 rounded-none"
            >
              <Phone className="h-4 w-4 text-[#D85A30]" />
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
