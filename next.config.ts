import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lyakfpgmbpcyutseykwn.supabase.co",
      },
      {
        protocol: "https",
        hostname: "static.scientificamerican.com",
      },
      {
        protocol: "https",
        hostname: "i.natgeofe.com",
      },
    ],
  },
};

export default nextConfig;
