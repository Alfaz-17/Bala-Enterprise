'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import Image from 'next/image';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[60px] md:h-[72px] items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="relative h-12 w-44 md:h-14 md:w-52 transition-all">
              <Image
                src="/logo.png"
                alt="Bala Enterprise Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-ink hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Phone Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+919825214214"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>+91 98252 14214</span>
            </a>
            <Link
              href="/#enquire"
              className="px-5 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-primary-dark transition-colors rounded-sm shadow-sm"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-ink hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-base font-medium ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href="tel:+919825214214"
              className="flex items-center gap-2 text-sm font-semibold text-ink"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span>+91 98252 14214</span>
            </a>
            <Link
              href="/#enquire"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 bg-primary text-white text-xs uppercase tracking-wider font-bold hover:bg-primary-dark transition-colors rounded-sm shadow-sm"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
