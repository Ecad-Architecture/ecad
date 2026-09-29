import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31536000, // Cache images for 1 year
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
      },
    ],
  },

  // cpanel redirect config
  async redirects() {
    return [
      {
        source: "/cpanel",
        destination: "http://176.74.16.235:2038",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
