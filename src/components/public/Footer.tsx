'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteInfo, setSiteInfo] = useState({
    phone: '+919825214214',
    phoneDisplay: '+91 98252 14214',
    email: 'info@balaenterprise.com',
    address: 'Bala Enterprise Factory, Bhavnagar GIDC Industrial Area, Gujarat - 364001, India',
    tradeindiaUrl: 'https://www.tradeindia.com/bala-enterprise-24235777/',
    indiamartUrl: 'https://www.indiamart.com/balaenterprises-gujarat/profile.html?srsltid=AfmBOoo-CME_id8olb_pyMrBd8IurDJTfC_G5k_UzNsao729y8RASlvF',
    instagramUrl: 'https://www.instagram.com/',
    youtubeUrl: 'https://www.youtube.com/',
    linkedinUrl: 'https://www.linkedin.com/',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const d = json.data;
          setSiteInfo((prev) => ({
            phone: d.phone_number ? d.phone_number.replace(/\s+/g, '') : prev.phone,
            phoneDisplay: d.phone_number || prev.phoneDisplay,
            email: d.email || prev.email,
            address: d.address || prev.address,
            tradeindiaUrl: d.tradeindia_url || prev.tradeindiaUrl,
            indiamartUrl: d.indiamart_url || prev.indiamartUrl,
            instagramUrl: d.instagram_url || prev.instagramUrl,
            youtubeUrl: d.youtube_url || prev.youtubeUrl,
            linkedinUrl: d.linkedin_url || prev.linkedinUrl,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#131312] text-white mt-auto relative overflow-hidden border-t border-white/10">
      {/* Blueprint Dot Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '2rem 2rem' 
        }} 
      />

      {/* Top Brand Amber Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30]" />

      <div className="section-container py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Company Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative h-14 w-14 transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/logo.webp"
                  alt="Bala Enterprise Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-white">
                <span className="font-heading text-2xl font-black tracking-wider leading-none">
                  BALA
                </span>
                <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#D85A30] uppercase leading-tight mt-1">
                  ENTERPRISE
                </span>
              </div>
            </Link>

            <p className="body-text text-white/70 max-w-md leading-relaxed text-sm">
              GST certified manufacturer of heavy-duty overhead cranes, wire rope hoists, winches, stackers, and hand pallet trucks serving factories & GIDC industrial plants across Gujarat and India.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="bg-[#D85A30]/15 border border-[#D85A30]/40 text-[#D85A30] px-3 py-1 text-[9px] uppercase font-bold tracking-widest">
                ISO 9001 Certified
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 font-mono text-[10px] uppercase font-bold tracking-wider">
                GSTIN: 24AIVPM3595R2Z1
              </span>
            </div>

            {/* Verified B2B Partner Badges & Social Media Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={siteInfo.indiamartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 bg-white hover:bg-slate-50 transition-all duration-300 rounded-md shadow-sm border border-slate-300 hover:scale-105 flex items-center justify-center overflow-hidden"
                title="Bala Enterprise on IndiaMART"
              >
                <Image
                  src="/indiamart.webp"
                  alt="IndiaMART Logo"
                  width={110}
                  height={32}
                  className="h-8 w-auto object-contain scale-110"
                />
              </a>

              <a
                href={siteInfo.tradeindiaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 bg-white hover:bg-slate-50 transition-all duration-300 rounded-md shadow-sm border border-slate-300 hover:scale-105 flex items-center justify-center overflow-hidden"
                title="Bala Enterprise on TradeIndia"
              >
                <Image
                  src="/tradeindia.webp"
                  alt="TradeIndia Logo"
                  width={110}
                  height={32}
                  className="h-8 w-auto object-contain scale-105"
                />
              </a>

              {/* YouTube Icon */}
              <a
                href={siteInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#FF0000] hover:bg-[#cc0000] text-white transition-all duration-300 rounded-md shadow-sm hover:scale-105 shrink-0"
                title="YouTube Channel"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href={siteInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white transition-all duration-300 rounded-md shadow-sm hover:scale-105 shrink-0"
                title="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.779-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a
                href={siteInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#0A66C2] hover:bg-[#084e96] text-white transition-all duration-300 rounded-md shadow-sm hover:scale-105 shrink-0"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <p className="label-tech mb-6 border-b border-white/10 pb-2">
              Quick Links
            </p>
            <ul className="space-y-3.5 text-xs sm:text-sm font-sans text-white/70">
              <li>
                <Link href="/" className="hover:text-[#D85A30] transition-colors flex items-center gap-1 group">
                  <span>Home</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D85A30]" />
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#D85A30] transition-colors flex items-center gap-1 group">
                  <span>All Products</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D85A30]" />
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#D85A30] transition-colors flex items-center gap-1 group">
                  <span>Factory Photos</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D85A30]" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D85A30] transition-colors flex items-center gap-1 group">
                  <span>About Us</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D85A30]" />
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#D85A30] transition-colors flex items-center gap-1 group">
                  <span>Blog & Articles</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D85A30]" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D85A30] transition-colors flex items-center gap-1 group">
                  <span>Contact Us</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D85A30]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4">
            <p className="label-tech mb-6 border-b border-white/10 pb-2">
              Factory Address
            </p>
            <ul className="space-y-4 text-xs sm:text-sm font-sans text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#D85A30] shrink-0 mt-1" />
                <span className="leading-relaxed">{siteInfo.address}</span>
              </li>
              <li>
                <a href={`tel:${siteInfo.phone}`} className="flex items-center gap-3 hover:text-[#D85A30] transition-colors">
                  <Phone className="h-4 w-4 text-[#D85A30] shrink-0" />
                  <span className="font-bold text-white">{siteInfo.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-3 hover:text-[#D85A30] transition-colors">
                  <Mail className="h-4 w-4 text-[#D85A30] shrink-0" />
                  <span>{siteInfo.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-sans text-white/50 gap-4">
          <p>© {currentYear} Bala Enterprise. Cranes & Hoists Manufacturer. Bhavnagar, Gujarat.</p>
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <Link href="/contact" className="hover:text-[#D85A30] transition-colors">Terms of Supply</Link>
            <Link href="/contact" className="hover:text-[#D85A30] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
