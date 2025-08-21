import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.rogue.ventures',
        port: '',
        pathname: '/**',
      },
    ],
  },
  assetPrefix: '',
  basePath: '',
};

export default nextConfig;
