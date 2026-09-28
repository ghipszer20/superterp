import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: data is cached explicitly with 'use cache' + cacheLife,
  // each campus source at its own refresh rate (see lib/campus.ts).
  cacheComponents: true,
  // The shared data package ships TypeScript source; let Next compile it.
  transpilePackages: ["@superterp/campus-data"],
  // Keep old links working after the tab restructure.
  async redirects() {
    return [
      { source: "/campus/buses", destination: "/campus/transit", permanent: true },
      { source: "/plan", destination: "/advisor", permanent: true },
      { source: "/explore", destination: "/schedule", permanent: true },
    ];
  },
};

export default nextConfig;
