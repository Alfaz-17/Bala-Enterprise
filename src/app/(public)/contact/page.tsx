import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import EnquiryForm from '@/components/public/EnquiryForm';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Contact Our Engineering Office & Factory | Bala Enterprise',
  description:
    'Contact Bala Enterprise at Bhavnagar GIDC, Gujarat. Request custom gantry crane quotes, EOT drawing layouts, and pricing details from our engineering desk.',
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: <Phone className="h-5 w-5 text-[#D85A30]" />,
      title: 'Call / WhatsApp Support',
      details: '+91 98252 14214',
      sub: 'Mon-Sat, 9:00 AM - 7:00 PM IST',
      href: 'tel:+919825214214',
    },
    {
      icon: <Mail className="h-5 w-5 text-[#D85A30]" />,
      title: 'Email Correspondence',
      details: 'info@balaenterprise.com',
      sub: 'Sales: sales@balaenterprise.com',
      href: 'mailto:info@balaenterprise.com',
    },
    {
      icon: <MapPin className="h-5 w-5 text-[#D85A30]" />,
      title: 'Factory & Showroom Address',
      details: 'Bala Enterprise, GIDC Industrial Area, Bhavnagar - 364001, Gujarat, India',
      sub: 'Prior visit appointment recommended for crane inspections.',
      href: 'https://maps.google.com/?q=Bhavnagar+GIDC+Gujarat+India',
    },
    {
      icon: <Clock className="h-5 w-5 text-[#D85A30]" />,
      title: 'Working Operations Hours',
      details: 'Monday - Saturday: 09:00 AM - 07:00 PM',
      sub: 'Closed on Sundays and National Holidays.',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A18] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      {/* Page Header — Side-by-side text + image on ALL screens */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 border-b border-[#2A2A28]">
        <div className="absolute top-0 right-0 h-full w-[42%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[12deg] sm:skew-x-[15deg] -translate-x-[8%] sm:-translate-x-[10%] w-[130%] h-full">
            <Image
              src="/Image_from_internet/pexels-enesbeydilli-30278762.jpg"
              alt="Bala Enterprise Contact Office"
              fill
              priority
              className="object-cover object-center opacity-60 sm:opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/40 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <span className="text-[#D85A30] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold block">
              B2B Sales Desk
            </span>
            <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Contact Our Team
            </h1>
            <p className="text-[11px] sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Get in touch with our Bhavnagar GIDC engineering office. Submit your lifting parameters for custom EOT layouts and drawing quotes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#E3E2DA] relative overflow-hidden border-b border-border/10">
        {/* Engineering blueprint dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* Giant Rotating Mechanical Cog Silhouette */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 text-black/[0.015] pointer-events-none select-none z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact details card list */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-[#D85A30] text-xs uppercase tracking-[0.2em] font-semibold block">
                  Communication Channels
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#1A1A18] leading-tight">
                  Reach out directly to our sales managers.
                </h2>
                <p className="text-sm text-[#888780] leading-relaxed">
                  Have questions about load specs, shipping container sizes, or custom track spans? Our managers are available during workshop hours.
                </p>
              </div>

              {/* Details List */}
              <div className="grid grid-cols-1 gap-4 pt-4">
                {contactDetails.map((detail, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/40 backdrop-blur-sm border border-black/5 rounded-lg hover:border-[#D85A30]/25 hover:bg-white/60 transition-all duration-300 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                    {/* Corner Tag Accent */}
                    <div className="absolute top-0 left-0 w-1.5 h-4 bg-[#D85A30]" />
                    <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center flex-shrink-0 shadow-sm border border-border">
                      {detail.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A18]">
                        {detail.title}
                      </h4>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={detail.href.startsWith('http') ? '_blank' : undefined}
                          rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="block text-sm font-semibold text-[#D85A30] hover:underline"
                        >
                          {detail.details}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-[#1A1A18]">{detail.details}</p>
                      )}
                      <p className="text-[11px] text-[#888780] leading-normal">{detail.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Enquiry Form Container */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#F5F4F0] border border-border p-6 sm:p-8 rounded-md shadow-sm">
                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <h3 className="font-heading text-lg font-bold text-[#1A1A18]">
                      Request Drawing Layout & Quote
                    </h3>
                  </div>
                  <p className="text-xs text-[#888780]">
                    Complete the form below. Our drawing layout desk will reply within 24 hours.
                  </p>
                </div>
                <EnquiryForm sourcePage="contactpage" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Embed Section */}
      <section className="relative w-full h-96 border-t border-border bg-[#F5F4F0]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118943.46914569502!2d72.1009139828458!3d21.751996503923984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f507b53805eb3%3A0xc3cfc2d76587c6b5!2sBhavnagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          className="absolute inset-0 w-full h-full border-0 filter grayscale contrast-125 opacity-90"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bala Enterprise Factory Location, Bhavnagar GIDC, Gujarat"
        ></iframe>
      </section>
    </div>
  );
}
