import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <ComingSoon title="Schedule" headline="Schedule builder is coming">
      Build your semester section by section with professor ratings and grade data for every course, see conflicts
      instantly, and compare Plan A, B and C before registration.
    </ComingSoon>
  );
}
