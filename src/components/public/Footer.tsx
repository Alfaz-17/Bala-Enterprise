import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              <div className="relative h-14 w-14 brightness-0 invert transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/logo.png"
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
              <span className="font-mono text-[10px] text-white/60 bg-white/5 border border-white/10 px-3 py-1">
                GSTIN: 24AIVPM3595R2Z1
              </span>
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
                <span className="leading-relaxed">Bala Enterprise Factory, Bhavnagar GIDC Industrial Area, Gujarat - 364001, India</span>
              </li>
              <li>
                <a href="tel:+919825214214" className="flex items-center gap-3 hover:text-[#D85A30] transition-colors">
                  <Phone className="h-4 w-4 text-[#D85A30] shrink-0" />
                  <span className="font-bold text-white">+91 98252 14214</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@balaenterprise.com" className="flex items-center gap-3 hover:text-[#D85A30] transition-colors">
                  <Mail className="h-4 w-4 text-[#D85A30] shrink-0" />
                  <span>info@balaenterprise.com</span>
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
