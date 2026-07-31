import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.balaenterprise.in"),
  title: "Bala Enterprise | Cranes, Hoists & Winches in Bhavnagar",
  description: "GST certified manufacturer of cranes, hoists, winches, stackers, pallet trucks, and industrial lifting equipment for factories across Gujarat.",
  icons: {
    icon: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
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
