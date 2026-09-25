"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CampusIcon, ExploreIcon, PlanIcon, ScheduleIcon, TodayIcon } from "./icons";
import styles from "./Nav.module.css";

const TABS = [
  { href: "/", label: "Today", Icon: TodayIcon },
  { href: "/campus", label: "Campus", Icon: CampusIcon },
  { href: "/schedule", label: "Schedule", Icon: ScheduleIcon },
  { href: "/plan", label: "Plan", Icon: PlanIcon },
  { href: "/explore", label: "Explore", Icon: ExploreIcon },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Main">
      <Link href="/" className={styles.brand}>
        Super<span>Terp</span>
      </Link>
      <ul className={styles.tabs}>
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link href={href} className={styles.tab} data-active={active} aria-current={active ? "page" : undefined}>
                <Icon size={24} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className={styles.fine}>Unofficial. Not affiliated with the University of Maryland.</p>
    </nav>
  );
}
