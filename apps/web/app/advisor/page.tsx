import type { Metadata } from "next";
import { AdvisorApp } from "./AdvisorApp";

export const metadata: Metadata = {
  title: "Advisor",
  description:
    "Plan four years of courses and check them against your majors, Gen Ed and university requirements. Unofficial; not affiliated with the University of Maryland.",
};

export default function AdvisorPage() {
  return <AdvisorApp />;
}
