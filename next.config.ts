import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { typedRoutes: false },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    // Temporary: allow preview deployments even when strict type issues exist.
    // Remove once all TS issues are fully resolved.
    ignoreBuildErrors: true
  }
};

export default nextConfig;
