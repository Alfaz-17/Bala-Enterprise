import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import EnquiryForm from '@/components/public/EnquiryForm';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Contact Our Sales Desk & Factory | Bala Enterprise',
  description:
    'Contact Bala Enterprise at Bhavnagar GIDC, Gujarat. Request custom gantry crane quotes, EOT drawing layouts, and pricing details from our engineering desk.',
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: <Phone className="h-5 w-5 text-[#D85A30]" />,
      title: 'Call / WhatsApp Sales Desk',
      details: '+91 98252 14214',
      sub: 'Mon-Sat, 9:00 AM - 7:00 PM IST',
      href: 'tel:+919825214214',
    },
    {
      icon: <Mail className="h-5 w-5 text-[#D85A30]" />,
      title: 'Email Support',
      details: 'info@balaenterprise.com',
      sub: 'Sales: sales@balaenterprise.com',
      href: 'mailto:info@balaenterprise.com',
    },
    {
      icon: <MapPin className="h-5 w-5 text-[#D85A30]" />,
      title: 'Factory & Showroom Address',
      details: 'Bala Enterprise Plant, GIDC Industrial Area, Bhavnagar - 364001, Gujarat, India',
      sub: 'Prior visit appointment recommended for crane inspections.',
      href: 'https://maps.google.com/?q=Bhavnagar+GIDC+Gujarat+India',
    },
    {
      icon: <Clock className="h-5 w-5 text-[#D85A30]" />,
      title: 'Working Hours',
      details: 'Monday - Saturday: 09:00 AM - 07:00 PM',
      sub: 'Closed on Sundays and National Holidays.',
    },
  ];

  return (
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Page Header */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-10 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="absolute top-0 right-0 h-full w-[38%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
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
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[65%] sm:max-w-[55%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <p className="label-tech text-[#D85A30] block">
              B2B Sales & Quote Desk
            </p>
            <h1 className="heading-display uppercase text-white font-black">
              Contact <span className="text-[#D85A30] italic font-medium">Us.</span>
            </h1>
            <p className="body-text text-white/80 max-w-xl text-xs sm:text-sm leading-relaxed">
              Get in touch with our Bhavnagar GIDC sales team. Submit your load parameters for fast price quotes and layout drawings.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <section className="py-16 sm:py-20 bg-[#F7EBDD] relative overflow-hidden border-b border-border/10">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Contact details card list */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div className="space-y-2 sm:space-y-3">
                <p className="label-tech mb-1">
                  Direct Support
                </p>
                <h2 className="heading-section text-[#131312] font-black uppercase">
                  Reach Out Directly <br />
                  <span className="text-[#D85A30] italic font-medium">To Our Team.</span>
                </h2>
                <p className="body-text text-[#131312]/80 leading-relaxed text-xs sm:text-sm">
                  Have questions about crane capacity, beam span, or custom track design? Our team is available during plant working hours.
                </p>
              </div>

              {/* Details List */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-1">
                {contactDetails.map((detail, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white/60 backdrop-blur-sm border border-black/10 rounded-none hover:border-[#D85A30]/40 transition-all duration-300 relative overflow-hidden shadow-sm">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-[#F7EBDD] flex items-center justify-center shrink-0 border border-border">
                      {detail.icon}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 font-sans">
                      <h4 className="label-tech !text-[10px] sm:!text-xs !text-[#131312]">
                        {detail.title}
                      </h4>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={detail.href.startsWith('http') ? '_blank' : undefined}
                          rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="block text-xs sm:text-sm font-bold text-[#D85A30] hover:underline"
                        >
                          {detail.details}
                        </a>
                      ) : (
                        <p className="text-xs sm:text-sm font-bold text-[#131312]">{detail.details}</p>
                      )}
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{detail.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Enquiry Form Container */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#131312] text-white border border-white/10 p-5 sm:p-8 shadow-lg relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
                    backgroundSize: '1.5rem 1.5rem' 
                  }} 
                />
                
                <div className="mb-5 sm:mb-6 space-y-2 relative z-10 border-b border-white/10 pb-4 sm:pb-6">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#D85A30]" />
                    <h3 className="font-heading text-base sm:text-xl font-bold uppercase tracking-wider text-white">
                      Request Layout & Price Quote
                    </h3>
                  </div>
                  <p className="body-text text-white/70 text-xs sm:text-sm">
                    Complete the form below. Our team will reply with technical specifications and pricing within 24 hours.
                  </p>
                </div>

                <div className="relative z-10">
                  <EnquiryForm sourcePage="contactpage" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Embed Section */}
      <section className="relative w-full h-80 sm:h-96 border-t border-black/10 bg-[#131312]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118943.46914569502!2d72.1009139828458!3d21.751996503923984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f507b53805eb3%3A0xc3cfc2d76587c6b5!2sBhavnagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          className="absolute inset-0 w-full h-full border-0 filter grayscale contrast-125 opacity-85"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bala Enterprise Factory Location, Bhavnagar GIDC, Gujarat"
        ></iframe>
      </section>
    </div>
  );
}
