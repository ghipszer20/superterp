import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Plan" };

export default function PlanPage() {
  return (
    <ComingSoon title="Plan" headline="Your four-year plan is coming">
      Check your plan against every requirement for your major, minors and programs, and see exactly what&apos;s left.
    </ComingSoon>
  );
}
