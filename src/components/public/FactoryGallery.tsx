'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const galleryImages = [
  {
    src: '/Images_Factory/front_main.png',
    alt: 'Bala Enterprise main factory entrance at Bhavnagar GIDC.',
    label: 'Main Entrance & Factory Gate',
    span: 'md:col-span-2 md:row-span-2 col-span-2 row-span-2',
  },
  {
    src: '/Images_Factory/inside_factory.png',
    alt: 'Inside Bala Enterprise heavy crane manufacturing and assembly workshop floor.',
    label: 'Assembly Workshop Floor',
    span: 'md:col-span-2 md:row-span-1 col-span-2 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1223.JPG.jpeg',
    alt: 'Heavy duty chain pulley block load testing area.',
    label: 'Chain Block Testing Rig',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1230.JPG.jpeg',
    alt: 'Manual hoist chain block ready for load test.',
    label: 'Manual Hoist Stock',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1327.jpg',
    alt: 'Bala Enterprise warehouse facility with hoists and winches stock.',
    label: 'Warehouse & Stockyard',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1329.jpg',
    alt: 'Industrial electric motor winches ready for dispatch.',
    label: 'Electric Winches Stock',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/factory_hangar_refined.png',
    alt: 'Overhead crane fabrication area with overhead cranes.',
    label: 'Crane Fabrication Hangar',
    span: 'md:col-span-2 md:row-span-1 col-span-2 row-span-1',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

export default function FactoryGallery() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7EBDD] text-[#131312] border-t border-b border-black/10 relative overflow-hidden">
      {/* Blueprint Dot Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.8) 1px, transparent 0)', 
          backgroundSize: '2rem 2rem' 
        }} 
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16 space-y-2"
        >
          <span className="label-tech mb-2 block text-[#D85A30]">
            Our Factory Photos
          </span>
          <h2 className="heading-section text-[#131312] uppercase font-black">
            Inside Our <span className="text-[#D85A30] italic font-medium">Bhavnagar Plant.</span>
          </h2>
          <p className="body-text text-[#131312]/80 max-w-lg mx-auto pt-2 leading-relaxed text-xs sm:text-sm">
            Take a look at photos from our Bhavnagar GIDC plant — heavy crane assembly bays, welding shop, and load testing area.
          </p>
        </motion.div>

        {/* Bento grid gallery */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[260px]"
        >
          {galleryImages.map((image) => (
            <motion.div
              key={image.src}
              variants={itemVariants}
              className={`${image.span} relative group overflow-hidden border border-black/10 bg-white rounded-none shadow-sm`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
                <span className="label-tech text-white !text-[9px] sm:!text-[10px] block mb-0.5">
                  {image.label}
                </span>
                <p className="text-[10px] sm:text-xs font-sans text-white/80 line-clamp-1">
                  {image.alt}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[3px] bg-[#D85A30] transition-all duration-700 ease-out z-20" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
