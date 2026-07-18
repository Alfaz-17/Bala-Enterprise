'use client';

import { Phone, MessageSquare } from 'lucide-react';

export default function StickyMobileCTA() {
  const phoneNumber = '+919825214214';
  const whatsappUrl = `https://wa.me/919825214214?text=Hi%20Bala%20Enterprise%2C%20I%20am%20interested%20in%20your%20material%20handling%20equipment.`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-3 grid grid-cols-2 gap-3 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)] [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
      <a
        href={`tel:${phoneNumber}`}
        className="min-h-12 flex items-center justify-center gap-2 py-3 bg-[#1A1A18] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm active:scale-95 transition-transform"
      >
        <Phone className="h-4 w-4" />
        Call Us
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm active:scale-95 transition-transform"
      >
        <MessageSquare className="h-4 w-4 fill-current" />
        WhatsApp
      </a>
    </div>
  );
}
