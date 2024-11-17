import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*']  // Be more restrictive in production
    },
  },
  // Add other configurations as needed
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // Custom webpack config if needed
  //   return config;
  // },
};

export default nextConfig;