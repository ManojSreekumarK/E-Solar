// Single source for the domain and the business's name/address/phone.
// Search engines cross-check these between the visible footer and the
// structured data, so both read from here rather than keeping copies.

// The env var still wins (e.g. for a preview deploy), but the fallback is the
// real domain: the old placeholder fallback shipped to production and told
// Google the canonical home of the site was https://esolar.example.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://esolar.live"
).replace(/\/$/, "");

export const BUSINESS = {
  name: "E Solar",
  address: {
    street: "S N Buildings, 30/258, LMS Junction",
    locality: "Attingal",
    district: "Thiruvananthapuram",
    region: "Kerala",
    postalCode: "695101",
    country: "IN",
  },
  phones: [
    { tel: "+918921259870", display: "+91 89212 59870" },
    { tel: "+919496307656", display: "+91 94963 07656" },
  ],
  social: {
    whatsapp: "https://wa.me/918921259870",
    facebook: "https://www.facebook.com/profile.php?id=61591416965008",
    instagram: "https://www.instagram.com/esolar.in/",
  },
} as const;

export const ADDRESS_LINE = `${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.district} - ${BUSINESS.address.postalCode}`;
