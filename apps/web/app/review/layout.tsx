import type { Metadata } from "next";

// Owner-only (PROJECT_MEMORY.md section 6, step 5). proxy.ts answers 404 outside
// `next dev` unless SUPERTERP_REVIEW=1; nothing in the app links here.
export const metadata: Metadata = {
  title: { default: "Review", template: "%s · Review" },
  robots: { index: false, follow: false },
};

export default function ReviewLayout({ children }: LayoutProps<"/review">) {
  return children;
}
