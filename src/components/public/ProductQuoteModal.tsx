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
        className="px-6 py-3 bg-[#D85A30] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Send Enquiry
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border border-[#888780] w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#1A1A18]">
                  Get Quote Details
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Selected Equipment: {productName}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <EnquiryForm
              productId={productId}
              sourcePage={`product-detail:${slug}`}
              defaultMessage={`Hello! Please send a formal quotation and technical drawing for the ${productName}.`}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
