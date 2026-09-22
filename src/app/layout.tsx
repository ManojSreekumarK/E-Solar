import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://esolar.example";

const DESCRIPTION =
  "Expert solar consulting and installation across Kerala. Calculate your savings and go solar with E Solar.";

export const metadata: Metadata = {
  // metadataBase makes the OG/Twitter image URLs absolute, which WhatsApp,
  // Facebook and X all require. Set NEXT_PUBLIC_SITE_URL to the real domain
  // at build time or link previews will point at the placeholder.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "E Solar | Power Your Future",
    template: "%s | E Solar",
  },
  description: DESCRIPTION,
  applicationName: "E Solar",
  keywords: [
    "solar Kerala",
    "rooftop solar",
    "on-grid solar",
    "hybrid solar",
    "solar installation",
    "solar consulting",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "E Solar",
    title: "E Solar | Power Your Future",
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
    title: "E Solar | Power Your Future",
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
        {children}
      </body>
    </html>
  );
}
