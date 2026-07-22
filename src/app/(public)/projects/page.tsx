import { connectToDatabase } from '@/lib/mongoose';
import Image from 'next/image';
import type { Metadata } from 'next';
import FactoryGallery from '@/components/public/FactoryGallery';

export const metadata: Metadata = {
  title: 'Workshop & Factory Photos | Bala Enterprise',
  description:
    'Take a virtual tour of our heavy-duty crane manufacturing plant, assembly bays, test rigs, and watch customer feedback in Bhavnagar GIDC.',
};

export default async function FactoryTourPage() {
  return (
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden pb-24">
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Header section */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-12 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

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
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-3">
            <p className="label-tech text-[#D85A30] block">
              Bhavnagar GIDC Plant Unit
            </p>
            <h1 className="heading-display uppercase text-white font-black">
              Factory <span className="text-[#D85A30] italic font-medium">Photos & Videos.</span>
            </h1>
            <p className="body-text text-white/80 max-w-xl text-xs sm:text-sm leading-relaxed">
              Explore our heavy-duty manufacturing plant, watch precision machine assembly lines, and see how we craft industry-standard cranes & hoists.
            </p>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="section-container py-16 relative z-10">
        <div className="text-center mb-12 space-y-2">
          <p className="label-tech">Video Tour</p>
          <h2 className="heading-section text-[#131312] font-black uppercase">
            Our Facility <span className="text-[#D85A30] italic font-medium">In Action.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {/* Video 1: Factory Tour */}
          <div className="flex flex-col bg-white border border-black/10 hover:border-[#D85A30]/40 transition-all duration-300 relative overflow-hidden shadow-sm">
            <div className="relative aspect-video w-full bg-[#131312]">
              <video 
                src="/Factory_visit.webm"
                muted
                loop
                playsInline
                controls 
                className="w-full h-full object-cover" 
                preload="none"
                poster="/Images_Factory/inside_factory.png"
              >
                Your browser does not support playing videos.
              </video>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#131312]">
                Factory Operations & Machinery
              </h3>
              <p className="body-text text-[#131312]/70 text-xs sm:text-sm leading-relaxed">
                Take a walkthrough of our factory hangar. Watch structural welding, component lathe tuning, crane end carriages alignment, and load test processes.
              </p>
            </div>
          </div>

          {/* Video 2: Customer Review */}
          <div className="flex flex-col bg-white border border-black/10 hover:border-[#D85A30]/40 transition-all duration-300 relative overflow-hidden shadow-sm">
            <div className="relative aspect-video w-full bg-[#131312]">
              <video 
                src="/Costomer_review.webm"
                muted
                loop
                playsInline
                controls 
                className="w-full h-full object-cover" 
                preload="none"
                poster="/Images_Factory/front_main.png"
              >
                Your browser does not support playing videos.
              </video>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#131312]">
                Customer Review & Feedback
              </h3>
              <p className="body-text text-[#131312]/70 text-xs sm:text-sm leading-relaxed">
                Watch verified client testimonials. Industrial crane operators and factory purchase managers explain why they buy their lifting gear from Bala Enterprise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Production Facilities Bento Gallery */}
      <div className="relative z-10">
        <FactoryGallery />
      </div>
    </div>
  );
}
