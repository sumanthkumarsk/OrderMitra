import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/OrderMitra',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
