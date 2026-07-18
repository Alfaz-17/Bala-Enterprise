import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A18] text-white mt-auto">
      {/* Top Golden-Orange Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30] shadow-[0_-1px_8px_rgba(216,90,48,0.25)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative h-14 w-14 brightness-0 invert transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/logo.png"
                  alt="Bala Enterprise Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-white">
                <span className="font-heading text-xl font-extrabold tracking-wider leading-none">
                  BALA
                </span>
                <span className="font-heading text-xs font-bold tracking-[0.3em] text-primary uppercase leading-tight mt-1">
                  ENTERPRISE
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#888780] max-w-sm leading-relaxed">
              GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and custom material handling equipment for factories across Gujarat.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#888780]">
              <span className="bg-green-500/20 border border-green-500/30 text-green-400 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                ISO 9001:2015
              </span>
              <span className="text-[#888780]/60">|</span>
              <span className="font-mono text-[11px] text-[#D85A30] font-semibold">GSTIN: 24AIVPM3595R2Z1</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white mb-5 pb-3 border-b border-white/10">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-[#888780]">
              <li>
                <Link href="/" className="hover:text-primary transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors duration-200">Products</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors duration-200">Completed Projects</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors duration-200">Blog & Resources</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors duration-200">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white mb-5 pb-3 border-b border-white/10">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-[#888780]">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#D85A30] flex-shrink-0 mt-0.5" />
                <span>Bala Enterprise Factory, Bhavnagar GIDC, Gujarat - 364001, India</span>
              </li>
              <li>
                <a href="tel:+919825214214" className="flex items-center gap-3 hover:text-primary transition-colors duration-200">
                  <Phone className="h-4 w-4 text-[#D85A30] flex-shrink-0" />
                  <span className="font-semibold">+91 98252 14214</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@balaenterprise.com" className="flex items-center gap-3 hover:text-primary transition-colors duration-200">
                  <Mail className="h-4 w-4 text-[#D85A30] flex-shrink-0" />
                  <span>info@balaenterprise.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#888780] gap-4">
          <p>© {currentYear} Bala Enterprise. All rights reserved. Bhavnagar, Gujarat, India.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
