import { redirect } from "next/navigation";

// The Campus tab opens on Dining; the sub-nav switches sections.
export default function CampusPage() {
  redirect("/campus/dining");
}
