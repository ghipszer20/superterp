import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: data is cached explicitly with 'use cache' + cacheLife,
  // each campus source at its own refresh rate (see lib/campus.ts).
  cacheComponents: true,
  // The shared packages ship TypeScript source; let Next compile them.
  transpilePackages: ["@superterp/campus-data", "@superterp/catalog", "@superterp/audit", "@superterp/course-data", "@superterp/credit", "@superterp/plan", "@superterp/ratings"],
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
