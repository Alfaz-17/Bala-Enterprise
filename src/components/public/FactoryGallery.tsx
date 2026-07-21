'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const galleryImages = [
  {
    src: '/Images_Factory/IMG_1330.jpg',
    alt: 'Bala Enterprise storefront office and display showroom at GIDC Bhavnagar.',
    label: 'GIDC Showroom',
    span: 'md:col-span-2 md:row-span-2 col-span-2 row-span-2',
  },
  {
    src: '/Images_Factory/IMG_1223.JPG.jpeg',
    alt: 'Heavy duty orange chain pulley block undergoing load test verification.',
    label: 'Chain Pulley Blocks',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1230.JPG.jpeg',
    alt: 'Yellow 1-ton manual hoist chain block with safety hooks.',
    label: 'Manual Hoists',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1327.jpg',
    alt: 'Bala Enterprise warehouse facility showing high-capacity hoists, wire rope drums, and heavy lifting gear inventory.',
    label: 'Assembly Warehouse',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/IMG_1329.jpg',
    alt: 'Industrial electric motor winches, wire ropes, and hoisting tackle inventory.',
    label: 'Electric Winches',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/Images_Factory/factory_hangar_refined.png',
    alt: 'Refined view of our heavy crane fabrication hangar with overhead gantry cranes.',
    label: 'Fabrication Hangar',
    span: 'md:col-span-2 md:row-span-1 col-span-2 row-span-1',
  },
  {
    src: '/Images_Factory/chain_hoists_refined.png',
    alt: 'Row of certified heavy duty material handling crane blocks and pulley gear.',
    label: 'Quality Certification',
    span: 'md:col-span-2 md:row-span-1 col-span-2 row-span-1',
  },
];
// Container variants for stagger animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Item variants for simple slide-up
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export default function FactoryGallery() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#1A1A18] border-t border-b border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D85A30]/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-20 space-y-3"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-[#D85A30] font-bold block">
            Our Space
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Inside Our Factory
          </h2>
          <div className="h-0.5 w-12 bg-[#D85A30] mx-auto" />
          <p className="text-sm text-white/70 tracking-wide max-w-lg mx-auto pt-1 leading-relaxed">
            Step inside our GIDC Bhavnagar manufacturing facility — equipped with industrial assembly rigs, overhead cranes, and rigorous safety testing fields.
          </p>
        </motion.div>

        {/* Bento grid gallery */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[240px]"
        >
          {galleryImages.map((image) => (
            <motion.div
              key={image.src}
              variants={itemVariants}
              className={`${image.span} relative group overflow-hidden border border-white/10 bg-white/5 rounded-md`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-w-768px) 50vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
                <span className="text-white text-xs sm:text-sm tracking-[0.2em] uppercase font-bold">
                  {image.label}
                </span>
                <p className="text-[10px] sm:text-xs text-white/70 line-clamp-1 mt-0.5">
                  {image.alt}
                </p>
              </div>

              {/* Accent line */}
              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[3px] bg-[#D85A30] transition-all duration-700 ease-out z-20" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
