'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Search } from 'lucide-react';
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ _id: string; name: string; slug: string; capacity?: string; thumbnail?: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [siteInfo, setSiteInfo] = useState({
    phone: '+919825214214',
    phoneDisplay: '+91 98252 14214',
    email: 'info@balaenterprise.com',
    instagramUrl: 'https://www.instagram.com/',
    youtubeUrl: 'https://www.youtube.com/',
    linkedinUrl: 'https://www.linkedin.com/',
    tradeindiaUrl: 'https://www.tradeindia.com/bala-enterprise-24235777/',
    indiamartUrl: 'https://www.indiamart.com/balaenterprises-gujarat/profile.html?srsltid=AfmBOoo-CME_id8olb_pyMrBd8IurDJTfC_G5k_UzNsao729y8RASlvF',
  });
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
            instagramUrl: d.instagram_url || prev.instagramUrl,
            youtubeUrl: d.youtube_url || prev.youtubeUrl,
            linkedinUrl: d.linkedin_url || prev.linkedinUrl,
            tradeindiaUrl: d.tradeindia_url || prev.tradeindiaUrl,
            indiamartUrl: d.indiamart_url || prev.indiamartUrl,
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setSearchResults(json.data.data || []);
          }
          setIsSearching(false);
        })
        .catch((err) => {
          console.error(err);
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowResults(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
                  src="/logo.webp"
                  alt="Bala Enterprise Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 88px, 120px"
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-3 lg:space-x-5 xl:space-x-7 h-full shrink-0">
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
            <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
              {/* Search Bar with Typeahead */}
              <div ref={searchContainerRef} className="relative hidden lg:block">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  isTransparent 
                    ? 'bg-white/10 border-white/20 text-white focus-within:bg-white/20 focus-within:border-white/40' 
                    : 'bg-black/5 border-black/10 text-[#1A1A18] focus-within:bg-white focus-within:border-[#D85A30] focus-within:shadow-md'
                }`}>
                  <Search className="h-3.5 w-3.5 opacity-60 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search machinery..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
                    onKeyDown={handleSearchSubmit}
                    className="bg-transparent border-none outline-none text-xs font-sans placeholder-current opacity-80 focus:opacity-100 transition-all duration-300 w-32 xl:w-40 text-current"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowResults(false);
                        setSearchResults([]);
                      }}
                      className="p-0.5 hover:opacity-100 opacity-60 transition-opacity shrink-0"
                      title="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Typeahead Results Dropdown */}
                {showResults && searchQuery.trim() && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#131312] border border-white/15 shadow-2xl z-[100] py-2 overflow-hidden">
                    {isSearching ? (
                      <div className="px-4 py-3 text-center text-white/50 text-[10px] uppercase font-black tracking-widest">
                        Searching catalog...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {searchResults.map((product) => (
                          <button
                            key={product._id}
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery('');
                              router.push(`/products/${product.slug}`);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-3"
                          >
                            {product.thumbnail ? (
                              <div className="relative w-8 h-8 rounded-sm bg-white/5 overflow-hidden shrink-0 border border-white/10">
                                <Image
                                  src={product.thumbnail}
                                  alt={product.name}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Search className="h-3.5 w-3.5 text-white/40" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 text-left">
                              <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">
                                {product.name}
                              </p>
                              {product.capacity && (
                                <p className="text-[9px] text-[#D85A30] font-sans font-semibold mt-0.5 truncate">
                                  Capacity: {product.capacity}
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setShowResults(false);
                            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                          }}
                          className="w-full text-center px-4 py-2 text-[9px] font-black text-[#D85A30] uppercase tracking-widest hover:text-[#c24a24] transition-colors bg-black/20"
                        >
                          View all results
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-center text-white/50 text-[10px] uppercase font-black tracking-widest">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* IndiaMART Official Square Badge */}
              <a
                href={siteInfo.indiamartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white hover:bg-slate-100 transition-all duration-300 rounded-sm shadow-sm border border-slate-300 hover:border-[#2E3192] hover:scale-105 flex items-center justify-center overflow-hidden shrink-0 p-1"
                title="Bala Enterprise on IndiaMART"
              >
                <Image
                  src="/indiamart.webp"
                  alt="IndiaMART Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain scale-125"
                />
              </a>

              {/* TradeIndia Official Square Badge */}
              <a
                href={siteInfo.tradeindiaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white hover:bg-slate-100 transition-all duration-300 rounded-sm shadow-sm border border-slate-300 hover:border-[#E52823] hover:scale-105 flex items-center justify-center overflow-hidden shrink-0 p-1"
                title="Bala Enterprise on TradeIndia"
              >
                <Image
                  src="/tradeindia.webp"
                  alt="TradeIndia Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain scale-110"
                />
              </a>

              {/* YouTube Icon */}
              <a
                href={siteInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-[#FF0000] hover:bg-[#cc0000] text-white transition-all duration-300 rounded-sm shadow-sm hover:scale-105 shrink-0"
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
                className="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white transition-all duration-300 rounded-sm shadow-sm hover:scale-105 shrink-0"
                title="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a
                href={siteInfo.linkedinUrl}
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

        {/* Mobile Drawer (Sidebar) Overlay */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile Drawer (Sidebar) Content */}
        <div 
          className={`fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-[#131312] border-l border-white/10 z-55 flex flex-col transition-transform duration-300 ease-out md:hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-5 flex items-center justify-between border-b border-white/10">
            <span className="font-heading text-xs font-black uppercase tracking-widest text-white/50">Menu</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-[#D85A30] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-5 space-y-1.5">
            {/* Drawer Search Bar */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white/5 border border-white/10 text-white rounded-none">
                <Search className="h-3.5 w-3.5 opacity-60 text-white" />
                <input
                  type="text"
                  placeholder="Search machinery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setIsOpen(false);
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="bg-transparent border-none outline-none text-xs font-sans placeholder-white/40 text-white w-full"
                />
              </div>
            </div>
            {links.map((link) => {
              if (link.label === 'Products') {
                return (
                  <div key={link.href} className="border-b border-white/5 pb-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block flex-1 py-3 text-sm font-sans font-bold uppercase tracking-wider transition-colors ${
                          isActive(link.href) ? 'text-[#D85A30]' : 'text-white/80 hover:text-[#D85A30]'
                        }`}
                      >
                        {link.label}
                      </Link>
                      <button
                        onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                        className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-[#D85A30] transition-transform duration-300"
                        style={{ transform: isProductsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Category Dropdown inside Mobile Sidebar */}
                    <div 
                      className={`pl-4 border-l border-white/10 ml-2 space-y-1 overflow-hidden transition-all duration-300 ${
                        isProductsExpanded ? 'max-h-[500px] opacity-100 py-1' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <Link
                        href="/products"
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-[10px] font-black text-white/50 hover:text-[#D85A30] uppercase tracking-widest"
                      >
                        All Products
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-[10px] font-black text-white/85 hover:text-[#D85A30] uppercase tracking-widest transition-colors"
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
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 text-sm font-sans font-bold uppercase tracking-wider border-b border-white/5 transition-colors ${
                    isActive(link.href)
                      ? 'text-[#D85A30]'
                      : 'text-white/80 hover:text-[#D85A30]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer with Official Logos & Socials */}
          <div className="p-5 border-t border-white/10 bg-black/30 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* IndiaMART Badge */}
              <a
                href="https://www.indiamart.com/balaenterprises-gujarat/profile.html?srsltid=AfmBOoo-CME_id8olb_pyMrBd8IurDJTfC_G5k_UzNsao729y8RASlvF"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="h-10 bg-white flex items-center justify-center rounded-sm overflow-hidden border border-white/10"
              >
                <Image
                  src="/indiamart.webp"
                  alt="IndiaMART"
                  width={100}
                  height={28}
                  className="h-7 w-auto object-contain scale-110"
                />
              </a>
              {/* TradeIndia Badge */}
              <a
                href="https://www.tradeindia.com/bala-enterprise-24235777/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="h-10 bg-white flex items-center justify-center rounded-sm overflow-hidden border border-white/10"
              >
                <Image
                  src="/tradeindia.webp"
                  alt="TradeIndia"
                  width={100}
                  height={28}
                  className="h-7 w-auto object-contain scale-110"
                />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* YouTube */}
              <a
                href={siteInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="py-2.5 bg-[#FF0000] text-white text-[10px] font-sans font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="py-2.5 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-[10px] font-sans font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="py-2.5 bg-[#0A66C2] text-white text-[10px] font-sans font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Glowing Golden-Orange Bottom Border Line */}
        <div className={`h-[2.5px] w-full bg-gradient-to-r from-[#D85A30] via-[#FFB800] to-[#D85A30] shadow-[0_1px_8px_rgba(216,90,48,0.25)] transition-opacity duration-300 ${
          isTransparent ? 'opacity-0' : 'opacity-100'
        }`} />
      </header>
  );
}
