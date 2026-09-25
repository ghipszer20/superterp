import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Advisor" };

export default function AdvisorPage() {
  return (
    <ComingSoon title="Advisor" headline="Your four-year plan and advisor are coming">
      Check your plan against every requirement for your majors, minors and programs, see exactly what&apos;s left, and
      get advice on what to take next, all in one place.
    </ComingSoon>
  );
}
