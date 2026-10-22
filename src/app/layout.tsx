import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE_URL } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Leads with the service and the home district, which is what local searches
// match on; "Power Your Future" stays as the on-page headline.
const TITLE = "Rooftop Solar in Thiruvananthapuram & Kerala | E Solar";

const DESCRIPTION =
  "Rooftop solar installation in Thiruvananthapuram and across Kerala: on-grid and hybrid systems for homes. Calculate your savings and get a custom quote.";

export const metadata: Metadata = {
  // metadataBase makes the OG/Twitter image URLs absolute, which WhatsApp,
  // Facebook and X all require. See SITE_URL in lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | E Solar",
  },
  description: DESCRIPTION,
  applicationName: "E Solar",
  keywords: [
    "rooftop solar Thiruvananthapuram",
    "solar installation Kerala",
    "solar panels Attingal",
    "on-grid solar",
    "hybrid solar",
    "solar consulting",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "E Solar",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rooftop solar panels at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
