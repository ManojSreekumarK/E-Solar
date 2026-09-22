import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` returns 403 for everything under /_next/* when the request
  // comes from an origin other than the one it was started on. Tunnelling
  // through ngrok is exactly that case: the HTML renders but every client
  // chunk is refused, so React never hydrates and no animation runs.
  // `*` matches one label, `**` matches the remaining labels.
  allowedDevOrigins: [
    "**.ngrok-free.app",
    "**.ngrok.app",
    "**.ngrok-free.dev",
    "**.ngrok.io",
  ],

  async headers() {
    return [
      {
        // The hero video is re-fetched on every visit under the default
        // `max-age=0`, which costs a round trip before the scroll scrub has
        // anything to seek into. One day fresh, then served stale while it
        // revalidates in the background.
        source: "/:dir(videos|images)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
