'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageItem {
  url: string;
  altText?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]?.url || '');

  if (images.length === 0) {
    return (
      <div className="relative h-64 sm:h-96 bg-[#F5F4F0] border border-[#888780]/20 flex items-center justify-center text-muted-foreground text-sm">
        No Image Available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-64 sm:h-[400px] bg-zinc-100 border border-[#888780]/20 overflow-hidden">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-w-768px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img.url)}
              className={`relative h-16 w-20 border flex-shrink-0 overflow-hidden ${
                activeImage === img.url
                  ? 'border-[#D85A30]'
                  : 'border-[#888780]/20 hover:border-[#888780]'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
