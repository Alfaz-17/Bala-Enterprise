import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A18] text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-64 brightness-0 invert">
                <Image
                  src="/logo.png"
                  alt="Bala Enterprise Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-[#888780] max-w-sm">
              Premium manufacturer of high-quality Single/Double Girder EOT Cranes, Gantry Cranes, Jib Cranes, and custom industrial material handling equipment.
            </p>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#888780]">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">Completed Projects</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">Blog & Resources</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">Contact us</h4>
            <ul className="space-y-2 text-sm text-[#888780]">
              <li>Bala Enterprise Factory, Rajkot, Gujarat, India</li>
              <li>
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@balaenterprise.com" className="hover:text-primary transition-colors">
                  info@balaenterprise.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#888780] gap-4">
          <p>© {currentYear} Bala Enterprise. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
