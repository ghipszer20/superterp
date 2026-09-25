import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <ComingSoon title="Explore" headline="Courses and professors are coming">
      Grade distributions, reviews and plain-language summaries for every course and professor.
    </ComingSoon>
  );
}
