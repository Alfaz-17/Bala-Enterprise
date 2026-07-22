'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Factory Photos', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setCategories(json.data);
        }
      })
      .catch((err) => console.error('Failed to fetch categories in header:', err));
  }, []);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isTransparent = isHome && !isScrolled && !isOpen;

  return (
    <header className={`${
      isHome
        ? isScrolled
          ? 'fixed top-0 left-0 bg-[#F7EBDD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-black/5 animate-slide-down'
          : 'absolute top-0 left-0 bg-transparent border-b border-transparent'
        : 'sticky top-0 bg-[#F7EBDD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-black/5'
    } w-full transition-all duration-300 z-50`}>
      {/* Premium Top Info Bar (Appears only on scroll / on other pages) */}
      {isScrolled && (
        <div className="bg-[#1A1A18] text-[#888780] text-[10px] md:text-xs py-1.5 md:py-2 border-b border-white/5 w-full relative z-50">
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
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28 sm:h-32 md:h-36">
            {/* Logo Only */}
            <Link href="/" className="flex items-center group">
              <div className={`relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 transition-transform group-hover:scale-105 duration-300 ${
                isTransparent ? 'filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)] brightness-110' : ''
              }`}>
                <Image
                  src="/logo.png"
                  alt="Bala Enterprise Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 88px, 120px"
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 h-full items-center">
              {links.map((link) => {
                if (link.label === 'Products') {
                  return (
                    <div key={link.href} className="relative group/dropdown h-full flex items-center">
                      <Link
                        href={link.href}
                        className={`py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5 ${
                          isActive(link.href)
                            ? 'text-primary'
                            : isTransparent
                              ? 'text-white hover:text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                              : 'text-[#1A1A18] hover:text-primary'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover/dropdown:rotate-180 text-current" />
                      </Link>
                      {isActive(link.href) && (
                        <span className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
                      )}
                      {/* Hover Dropdown */}
                      <div className="absolute top-[80%] left-0 w-64 bg-[#1A1A18] border border-white/10 rounded-sm shadow-xl hidden group-hover/dropdown:block z-50 py-2">
                        <Link
                          href="/products"
                          className="block px-4 py-2.5 text-[10px] font-black text-white/50 hover:text-primary uppercase tracking-widest border-b border-white/5"
                        >
                          All Products
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            className="block px-4 py-2 text-[10px] font-black text-white/80 hover:text-primary uppercase tracking-widest transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'text-primary'
                        : isTransparent
                          ? 'text-white hover:text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                          : 'text-[#1A1A18] hover:text-primary'
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Official Brand Logos & Social Icons */}
            <div className="hidden md:flex items-center gap-3">
              {/* IndiaMART Official Brand Logo Badge */}
              <a
                href="https://www.indiamart.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-3.5 bg-white hover:bg-slate-50 transition-all duration-300 rounded-md shadow-sm border border-slate-300 hover:border-[#2E3192] hover:scale-105 flex items-center justify-center overflow-hidden"
                title="Bala Enterprise on IndiaMART"
              >
                <Image
                  src="/indiamart.png"
                  alt="IndiaMART Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain scale-125 transition-transform duration-300"
                />
              </a>

              {/* TradeIndia Official Brand Logo Badge */}
              <a
                href="https://www.tradeindia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-3.5 bg-white hover:bg-slate-50 transition-all duration-300 rounded-md shadow-sm border border-slate-300 hover:border-[#E52823] hover:scale-105 flex items-center justify-center overflow-hidden"
                title="Bala Enterprise on TradeIndia"
              >
                <Image
                  src="/tradeindia.png"
                  alt="TradeIndia Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain scale-110 transition-transform duration-300"
                />
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white transition-all duration-300 rounded-sm shadow-sm hover:scale-105 shrink-0"
                title="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-[#0A66C2] hover:bg-[#084e96] text-white transition-all duration-300 rounded-sm shadow-sm hover:scale-105 shrink-0"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`min-h-11 min-w-11 inline-flex items-center justify-center focus:outline-none transition-colors ${
                  isTransparent
                    ? 'text-white hover:text-primary'
                    : 'text-[#1A1A18] hover:text-primary'
                }`}
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
          <div className="md:hidden border-t border-border bg-[#F7EBDD] px-3 py-4 space-y-2 shadow-inner max-h-[calc(100vh-96px)] overflow-y-auto">
            {links.map((link) => {
              if (link.label === 'Products') {
                return (
                  <div key={link.href} className="space-y-1">
                    <div className="flex items-center justify-between pl-2">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block flex-1 py-3 text-base font-semibold transition-colors ${
                          isActive(link.href) ? 'text-primary' : 'text-[#888780] hover:text-[#1A1A18]'
                        }`}
                      >
                        {link.label}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProductsExpanded(!isProductsExpanded);
                        }}
                        className="min-h-11 min-w-11 flex items-center justify-center text-[#888780] hover:text-[#1A1A18] focus:outline-none transition-transform duration-300"
                        style={{ transform: isProductsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-label="Toggle Products Menu"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {isProductsExpanded && (
                      <div className="pl-4 border-l border-border/60 ml-4 space-y-1 pb-2 animate-fade-in">
                        <Link
                          href="/products"
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-sm text-[#888780] hover:text-[#1A1A18] font-medium"
                        >
                          All Products
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-sm text-[#888780] hover:text-[#1A1A18] font-medium"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
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
              );
            })}
            <div className="pt-4 border-t border-border space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                {/* IndiaMART Official Logo */}
                <a
                  href="https://www.indiamart.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="min-h-14 flex items-center justify-center px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden"
                >
                  <Image
                    src="/indiamart.png"
                    alt="IndiaMART Logo"
                    width={130}
                    height={36}
                    className="h-9 w-auto object-contain scale-125"
                  />
                </a>

                {/* TradeIndia Official Logo */}
                <a
                  href="https://www.tradeindia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="min-h-14 flex items-center justify-center px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden"
                >
                  <Image
                    src="/tradeindia.png"
                    alt="TradeIndia Logo"
                    width={130}
                    height={36}
                    className="h-9 w-auto object-contain scale-110"
                  />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Instagram Mobile Icon */}
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-sans text-xs font-bold uppercase rounded-sm shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>

                {/* LinkedIn Mobile Icon */}
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A66C2] text-white font-sans text-xs font-bold uppercase rounded-sm shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Glowing Golden-Orange Bottom Border Line */}
        <div className={`h-[2.5px] w-full bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30] shadow-[0_1px_8px_rgba(216,90,48,0.25)] transition-opacity duration-300 ${
          isTransparent ? 'opacity-0' : 'opacity-100'
        }`} />
      </header>
  );
}
