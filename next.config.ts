import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;