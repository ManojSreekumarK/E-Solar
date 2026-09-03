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
};

export default nextConfig;
