'use client';

import { useState } from 'react';
import EnquiryForm from './EnquiryForm';

interface ProductQuoteModalProps {
  productName: string;
  productId: string;
  slug: string;
}

export default function ProductQuoteModal({
  productName,
  productId,
  slug,
}: ProductQuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-6 py-3.5 bg-[#D85A30] text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-[#c24a24] transition-colors rounded-none shadow-md"
      >
        Send Enquiry
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#131312] border border-white/15 w-full max-w-lg p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-hidden">
            {/* Dot Grid background overlay */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
                backgroundSize: '1.5rem 1.5rem' 
              }} 
            />

            {/* Glowing Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30]" />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="label-tech !text-[#D85A30] mb-1 block">Request a Quote</span>
                <h2 className="font-heading text-lg sm:text-xl font-black uppercase tracking-wide text-white">
                  Get Quote Details
                </h2>
                <p className="text-xs text-white/60 mt-1 font-medium">
                  Equipment: <span className="text-[#D85A30] font-sans font-bold">{productName}</span>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-[#D85A30] hover:bg-white/5 transition-colors text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="relative z-10">
              <EnquiryForm
                productId={productId}
                sourcePage={`product-detail:${slug}`}
                defaultMessage={`Hello! Please send a formal quotation and technical drawing for the ${productName}.`}
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
