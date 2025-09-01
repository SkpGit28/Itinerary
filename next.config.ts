import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["marked", "isomorphic-dompurify"],
  },
};

export default nextConfig;
