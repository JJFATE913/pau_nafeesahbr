import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Workers has no Node image pipeline. The logo is already sized in public/, so serving
    // it as-is avoids depending on a Cloudflare Images binding.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
