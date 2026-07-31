import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { connectToDatabase } from "@/lib/mongoose";
import { SiteSettings } from "@/models/SiteSettings";

export async function generateMetadata(): Promise<Metadata> {
  let googleVerification = "";
  let bingVerification = "";

  try {
    await connectToDatabase();
    const settings = await SiteSettings.find().lean();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.settingKey] = s.settingValue;
    }
    googleVerification = settingsMap.google_site_verification || "";
    bingVerification = settingsMap.bing_site_verification || "";
  } catch (error) {
    console.error("Failed to fetch SEO settings from DB, using fallback defaults.", error);
  }

  const verification: Metadata['verification'] = {};
  if (googleVerification) {
    verification.google = googleVerification;
  }
  if (bingVerification) {
    verification.other = {
      'msvalidate.01': [bingVerification]
    };
  }

  return {
    metadataBase: new URL("https://www.balaenterprise.in"),
    title: {
      default: "Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar",
      template: "%s | Bala Enterprise"
    },
    description: "GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.",
    keywords: [
      "Bala Enterprise",
      "Bala Enterprises",
      "Bala Enterprise Bhavnagar",
      "Bala Enterprise Gujarat",
      "Bala Enterprise India",
      "Overhead Cranes Bhavnagar",
      "Wire Rope Hoists Gujarat",
      "Electric Winches Manufacturer",
      "Industrial Lifting Equipment Bhavnagar",
      "GST Certified Crane Manufacturer"
    ],
    icons: {
      icon: "/logo.png",
    },
    alternates: {
      canonical: "/",
    },
    verification,
    openGraph: {
      title: "Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar",
      description: "GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.",
      url: "https://www.balaenterprise.in",
      siteName: "Bala Enterprise",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: "Bala Enterprise Logo",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
