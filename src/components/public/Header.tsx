'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      {/* Premium Top Info Bar */}
      <div className="bg-[#1A1A18] text-[#888780] text-[10px] md:text-xs py-1.5 md:py-2 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <span className="hidden sm:inline font-medium tracking-wide">ISO 9001:2015 Certified Manufacturer</span>
            <span className="flex items-center gap-1.5 text-white/80 font-medium truncate">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="truncate">Bhavnagar GIDC, Gujarat</span>
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919825214214"
              className="flex items-center gap-1.5 hover:text-primary transition-colors text-white/80 font-medium"
            >
              <Phone className="h-3 w-3 text-primary" />
              <span className="hidden min-[380px]:inline">Call</span>
            </a>
            <a 
              href="mailto:info@balaenterprise.com" 
              className="flex items-center gap-1.5 hover:text-primary transition-colors text-white/80 font-medium"
            >
              <Mail className="h-3 w-3 text-primary" />
              <span className="hidden min-[520px]:inline">info@balaenterprise.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-24">
          {/* Logo Only (2x Big) */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-14 w-14 md:h-24 md:w-24 transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/logo.png"
                alt="Bala Enterprise Logo"
                fill
                priority
                sizes="(max-width: 768px) 56px, 96px"
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 h-full items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-[#1A1A18] hover:text-primary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA & Phone Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+919825214214"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A18] hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>+91 98252 14214</span>
            </a>
            <Link
              href="/#enquire"
              className="px-5 py-3 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#c24a24] transition-colors rounded-sm shadow-sm"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-11 min-w-11 inline-flex items-center justify-center text-[#1A1A18] hover:text-primary focus:outline-none transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white px-3 py-4 space-y-2 shadow-inner max-h-[calc(100vh-96px)] overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block min-h-11 py-3 text-base font-semibold transition-colors ${
                isActive(link.href)
                  ? 'text-primary border-l-2 border-primary pl-2'
                  : 'text-[#888780] hover:text-[#1A1A18] pl-2'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href="tel:+919825214214"
              className="min-h-11 flex items-center gap-2 text-sm font-bold text-[#1A1A18] hover:text-primary transition-colors pl-2"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span>+91 98252 14214</span>
            </a>
            <Link
              href="/#enquire"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-3.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-[#c24a24] transition-colors rounded-sm shadow-sm"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}

      {/* Glowing Golden-Orange Bottom Border Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30] shadow-[0_1px_8px_rgba(216,90,48,0.25)]" />
    </header>
  );
}
