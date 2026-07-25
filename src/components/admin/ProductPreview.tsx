'use client';

import { useState } from 'react';
import { Eye, EyeOff, Star, ArrowRight } from 'lucide-react';

interface ProductPreviewProps {
  name: string;
  images: string[];
  capacity?: string;
  shortDescription?: string;
  featured?: boolean;
  status?: string;
  categoryName?: string;
  modelNumber?: string;
  priceDisplay?: string;
}

export default function ProductPreview({
  name,
  images,
  capacity,
  shortDescription,
  featured,
  status,
  categoryName,
  modelNumber,
  priceDisplay,
}: ProductPreviewProps) {
  const [open, setOpen] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const primaryImage = images.filter(Boolean)[activeImage] || images.filter(Boolean)[0];
  const validImages = images.filter(Boolean);

  return (
    <div className="border border-border bg-card">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Eye className="h-4 w-4 text-primary" />
          Live Preview
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {open ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {open ? 'Hide' : 'Show'}
        </span>
      </button>

      {open && (
        <div className="border-t border-border">
          {/* --- Product Card Preview (how it looks on listing) --- */}
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">
              Product Card Preview
            </p>
            <div className="bg-[#FCF6ED] border border-[#EDEBE4] max-w-sm overflow-hidden group shadow-sm">
              {/* Image */}
              <div className="relative aspect-[4/3] bg-[#F2E2D0] overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={name || 'Product'}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-[#7C7A72]">
                      <div className="w-12 h-12 mx-auto mb-2 border-2 border-dashed border-[#D9D8D2] rounded flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#D9D8D2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs">No image yet</p>
                    </div>
                  </div>
                )}

                {/* Featured badge */}
                {featured && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-[#D85A30] text-white text-[10px] font-bold uppercase tracking-wider">
                    <Star className="h-2.5 w-2.5 fill-white" />
                    Featured
                  </div>
                )}

                {/* Status badge */}
                {status === 'inactive' && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Inactive
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                {categoryName && (
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D85A30]">
                    {categoryName}
                  </p>
                )}
                <h3 className="font-bold text-[#1A1A18] text-sm leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-heading, sans-serif)' }}>
                  {name || 'Product Name'}
                </h3>
                {capacity && (
                  <p className="text-xs text-[#7C7A72]">
                    Capacity: <span className="text-[#1A1A18] font-medium">{capacity}</span>
                  </p>
                )}
                {modelNumber && (
                  <p className="text-xs text-[#7C7A72]">
                    Model: <span className="text-[#1A1A18] font-medium">{modelNumber}</span>
                  </p>
                )}
                {shortDescription && (
                  <p className="text-xs text-[#7C7A72] line-clamp-2 leading-relaxed">
                    {shortDescription}
                  </p>
                )}
                {priceDisplay && (
                  <p className="text-xs font-semibold text-[#D85A30]">
                    {priceDisplay}
                  </p>
                )}

                <div className="flex items-center gap-1 text-[#D85A30] text-xs font-semibold pt-1 group-hover:gap-2 transition-all">
                  View Details
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* --- Image Gallery Preview --- */}
          {validImages.length > 1 && (
            <div className="px-4 pb-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                Image Gallery ({validImages.length} images)
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 border-2 p-0.5 transition-colors ${
                      activeImage === i
                        ? 'border-primary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- Quick Stats --- */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-accent/50 px-2.5 py-1.5">
              <span className="text-muted-foreground">Status:</span>{' '}
              <span className={`font-semibold ${status === 'active' ? 'text-green-700' : 'text-red-600'}`}>
                {status || 'active'}
              </span>
            </div>
            <div className="bg-accent/50 px-2.5 py-1.5">
              <span className="text-muted-foreground">Featured:</span>{' '}
              <span className="font-semibold">{featured ? 'Yes' : 'No'}</span>
            </div>
            <div className="bg-accent/50 px-2.5 py-1.5 col-span-2">
              <span className="text-muted-foreground">Images:</span>{' '}
              <span className="font-semibold">{validImages.length} uploaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
