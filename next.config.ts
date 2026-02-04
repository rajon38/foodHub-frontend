import "./src/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      // {
      //   source: "/api/auth/:path*",
      //   destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`,
      // },
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
      },
    ];
  }
};


export default nextConfig;
