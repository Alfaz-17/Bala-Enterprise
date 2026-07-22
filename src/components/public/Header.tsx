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

            {/* CTA & Phone Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="tel:+919825214214"
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                  isTransparent
                    ? 'text-white hover:text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                    : 'text-[#1A1A18] hover:text-primary'
                }`}
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
        <div className={`h-[2.5px] w-full bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30] shadow-[0_1px_8px_rgba(216,90,48,0.25)] transition-opacity duration-300 ${
          isTransparent ? 'opacity-0' : 'opacity-100'
        }`} />
      </header>
  );
}
