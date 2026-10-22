import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ReductionStat from "@/components/ReductionStat";
import PanelAnatomy from "@/components/PanelAnatomy";
import Calculator from "@/components/Calculator";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import { BUSINESS, SITE_URL } from "@/lib/site";

// Only facts the page itself shows. No ratings, hours or coordinates: Google
// penalises structured data that the visible page doesn't back up.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS.name,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo-mark.svg`,
      image: `${SITE_URL}/og-image.jpg`,
      description:
        "Rooftop solar consulting and installation for homes in Thiruvananthapuram and across Kerala.",
      telephone: BUSINESS.phones[0].tel,
      contactPoint: BUSINESS.phones.map((p) => ({
        "@type": "ContactPoint",
        telephone: p.tel,
        contactType: "sales",
        areaServed: "IN",
      })),
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.locality,
        addressRegion: BUSINESS.address.region,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: BUSINESS.address.country,
      },
      areaServed: [
        { "@type": "City", name: "Thiruvananthapuram" },
        { "@type": "State", name: "Kerala" },
      ],
      sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Solar services",
        itemListElement: [
          ["On-Grid Solar", "Grid-tied rooftop systems that cut your monthly bill from day one."],
          ["Hybrid Systems", "Battery-backed plans that keep the lights on through an outage."],
          ["Service & Support", "Ongoing monitoring and maintenance for the life of the system."],
        ].map(([name, description]) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, description },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: BUSINESS.name,
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: "en-IN",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaping `<` keeps a stray "</script>" in any string from closing
        // the tag early (per the Next.js JSON-LD guide).
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <main className="flex-1">
        <Hero />
        <div id="features" className="scroll-mt-24">
          {/* One stacking context for all three: each pins in turn and the
              next slides up over it, so a neighbouring section is never
              revealed as a sliver at the edge of the viewport. Must not gain
              `overflow-hidden`, which would kill the sticky behaviour. */}
          <div className="relative">
            <About />
            <ReductionStat />
            {/* Dwell space: ReductionStat is `sticky h-screen`, so its own
                flow height gives it no time on screen before the next section
                arrives. This scrolls past while it stays pinned. */}
            <div aria-hidden className="h-[15vh]" />
            <PanelAnatomy />
          </div>
        </div>
        <Calculator />
        <Process />
      </main>
      <Footer />
    </>
  );
}
