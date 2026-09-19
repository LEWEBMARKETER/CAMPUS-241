import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@campus241/shared"],
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
