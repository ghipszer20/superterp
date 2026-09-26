import type { MetadataRoute } from "next";

// The owner's review tool is 404 outside development anyway (proxy.ts); keep crawlers off it too.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/review", "/api/review"] },
  };
}
