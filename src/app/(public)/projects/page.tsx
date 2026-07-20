import { connectToDatabase } from '@/lib/mongoose';
import { Testimonial } from '@/models/Testimonial';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workshop & Factory Tour | Bala Enterprise',
  description:
    'Take a virtual tour of our heavy-duty crane manufacturing plant, assembly bays, test rigs, and watch customer feedback in Bhavnagar GIDC.',
};

const factoryImages = [
  { url: '/Images_Factory/factory_hangar_refined.png', caption: 'Heavy Crane Assembly Bay' },
  { url: '/Images_Factory/chain_hoists_refined.png', caption: 'Precision Hoist Testing Rig' },
  { url: '/Images_Factory/IMG_1223.JPG.jpeg', caption: 'Steel Fabrication Area' },
  { url: '/Images_Factory/IMG_1230.JPG.jpeg', caption: 'Structural Girder Welding' },
  { url: '/Images_Factory/IMG_1262.JPG.jpeg', caption: 'Hoist Gearbox Machining' },
  { url: '/Images_Factory/IMG_1263.JPG.jpeg', caption: 'Component Turning & Lathe Work' },
  { url: '/Images_Factory/IMG_1267.jpg', caption: 'Main Gantry Frame Inspection' },
  { url: '/Images_Factory/IMG_1268.jpg', caption: 'Load Testing Setup' },
  { url: '/Images_Factory/IMG_1272.JPG.jpeg', caption: 'Under-Construction End Carriages' },
  { url: '/Images_Factory/IMG_1327.jpg', caption: 'Quality Assurance Testing Station' },
  { url: '/Images_Factory/IMG_1329.jpg', caption: 'Motor & Drive Assembly' },
  { url: '/Images_Factory/IMG_1330.jpg', caption: 'Electrical Control Panel Wiring' },
  { url: '/Images_Factory/IMG_1331.jpg', caption: 'Hydraulic Press & Stacker Assembly' },
  { url: '/Images_Factory/IMG_1332.jpg', caption: 'Finished Goods Dispatch Area' },
  { url: '/Images_Factory/IMG_1333.jpg', caption: 'Heavy-Duty Paint Shop' },
  { url: '/Images_Factory/IMG_1335.jpg', caption: 'Bhavnagar Factory Entrance' },
];

async function getTestimonials() {
  await connectToDatabase();
  return Testimonial.find({ status: 'active' }).sort({ createdAt: -1 }).limit(6).lean();
}

export default async function FactoryTourPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A18] relative overflow-hidden pb-24">
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Interlocking Gear Mechanism Silhouette Backdrop */}
      <div className="absolute -right-16 -top-16 w-80 h-80 text-black/[0.012] pointer-events-none select-none z-0">
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
      <div className="absolute left-48 -top-8 w-44 h-44 text-black/[0.008] pointer-events-none select-none z-0">
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
      {/* Header section with skewed design */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-10 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        <div className="absolute top-0 right-0 h-full w-[45%] sm:w-[48%] bg-[#1A1A18] origin-top-right transform skew-x-[-15deg] translate-x-[8%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[15deg] -translate-x-[8%] w-[130%] h-full">
            <Image
              src="/Images_Factory/factory_hangar_refined.png"
              alt="Bala Enterprise Factory"
              fill
              priority
              className="object-cover object-center opacity-40 sm:opacity-50 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/50 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-3">
            <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-bold block">
              Bhavnagar GIDC Manufacturing Hub
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Workshop & Factory Tour
            </h1>
            <p className="text-xs sm:text-base text-white/80 max-w-xl leading-relaxed">
              Explore our heavy-duty manufacturing plant, watch our precision machine assembly lines, and see how we craft industry-standard cranes, hoists, and winches.
            </p>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-[#D85A30] text-xs uppercase tracking-[0.25em] font-bold">Videos</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black mt-1">Our Facility in Action</h2>
          <div className="h-0.5 w-12 bg-[#D85A30] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {/* Video 1: Factory Tour */}
          <div className="flex flex-col bg-white/40 backdrop-blur-sm border border-black/5 hover:border-[#D85A30]/30 hover:bg-white/60 transition-all duration-300 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)] rounded-lg">
            {/* Left Edge Accent */}
            <div className="absolute top-0 left-0 w-1.5 h-6 bg-[#D85A30]" />
            <div className="relative aspect-video w-full bg-[#1A1A18]">
              <video 
                autoPlay
                muted
                loop
                playsInline
                controls 
                className="w-full h-full object-cover" 
                preload="metadata"
                poster="/Images_Factory/factory_hangar_refined.png"
              >
                <source src="/Factory_visit.webm" type="video/webm" />
                <source src="/Factory_visit.MP4" type="video/mp4" />
                Your browser does not support playing videos.
              </video>
            </div>
            <div className="p-5 sm:p-6 space-y-2">
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-[#1A1A18]">
                Factory Operations & Machinery
              </h3>
              <p className="text-xs sm:text-sm text-[#5f5e58] leading-relaxed">
                Take a walkthrough of our factory hangar. Watch structural welding, component lathe tuning, crane end carriages alignment, and load test processes.
              </p>
            </div>
          </div>

          {/* Video 2: Customer Review */}
          <div className="flex flex-col bg-white/40 backdrop-blur-sm border border-black/5 hover:border-[#D85A30]/30 hover:bg-white/60 transition-all duration-300 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)] rounded-lg">
            {/* Left Edge Accent */}
            <div className="absolute top-0 left-0 w-1.5 h-6 bg-[#D85A30]" />
            <div className="relative aspect-video w-full bg-[#1A1A18]">
              <video 
                autoPlay
                muted
                loop
                playsInline
                controls 
                className="w-full h-full object-cover" 
                preload="metadata"
                poster="/Images_Factory/chain_hoists_refined.png"
              >
                <source src="/Costomer_review.webm" type="video/webm" />
                <source src="/Costomer_review.MP4" type="video/mp4" />
                Your browser does not support playing videos.
              </video>
            </div>
            <div className="p-5 sm:p-6 space-y-2">
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-[#1A1A18]">
                Customer Walkthrough & Review
              </h3>
              <p className="text-xs sm:text-sm text-[#5f5e58] leading-relaxed">
                Watch a detailed customer inspection of our manufactured hoists, hand winches, and stackers before shipping. Hear direct feedback on structural builds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-border/50">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#D85A30] text-xs uppercase tracking-[0.25em] font-bold">Photo Showcase</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black mt-1">Workshop Photo Gallery</h2>
          <div className="h-0.5 w-12 bg-[#D85A30] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {/* Giant Rotating Mechanical Cog Silhouette */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 text-black/[0.012] pointer-events-none select-none z-0">
            <svg
              className="w-full h-full animate-[spin_100s_linear_infinite]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.35"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          {factoryImages.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative h-[220px] bg-white/40 backdrop-blur-sm border border-black/5 hover:border-[#D85A30]/30 hover:bg-white/60 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 z-10"
            >
              <div className="relative h-[80%] w-full overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="h-[20%] px-4 flex items-center justify-between bg-white/70 border-t border-border/10">
                <span className="text-[10px] sm:text-xs font-bold text-[#1A1A18] uppercase tracking-wider truncate">
                  {img.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-border/50">
        <div className="text-center mb-12">
          <span className="text-[#D85A30] text-xs uppercase tracking-[0.25em] font-bold">Client Trust</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black mt-1">What Our Clients Say</h2>
          <div className="h-0.5 w-12 bg-[#D85A30] mx-auto mt-3" />
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-10 bg-white border border-border rounded-md max-w-xl mx-auto">
            <p className="text-[#888780] text-sm">Real reviews are being gathered and synced soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {testimonials.map((t: any) => (
              <div 
                key={t._id} 
                className="bg-white/40 backdrop-blur-sm border border-black/5 hover:border-[#D85A30]/30 hover:bg-white/60 p-6 rounded-md shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent Tag */}
                <div className="absolute top-0 left-0 w-1 h-3 bg-[#D85A30]" />
                <div className="space-y-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < t.rating ? 'text-[#FFB800] fill-[#FFB800]' : 'text-gray-200'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5f5e58] italic leading-relaxed">
                    &ldquo;{t.reviewText}&rdquo;
                  </p>
                </div>

                <div className="border-t border-border/20 pt-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1A1A18] uppercase tracking-wide">
                    {t.clientName}
                  </h4>
                  {t.companyName && (
                    <span className="text-[10px] text-[#888780] font-semibold tracking-wider uppercase block mt-0.5">
                      {t.companyName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
