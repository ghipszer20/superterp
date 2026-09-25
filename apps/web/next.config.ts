import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: data is cached explicitly with 'use cache' + cacheLife,
  // each campus source at its own refresh rate (see lib/campus.ts).
  cacheComponents: true,
  // The shared data package ships TypeScript source; let Next compile it.
  transpilePackages: ["@superterp/campus-data"],
};

export default nextConfig;
