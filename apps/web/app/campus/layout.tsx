import { CampusNav } from "@/components/CampusNav";

export default function CampusLayout({ children }: LayoutProps<"/campus">) {
  return (
    <>
      <CampusNav />
      {children}
    </>
  );
}
