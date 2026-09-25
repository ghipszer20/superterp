"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdvisorIcon, CampusIcon, ScheduleIcon, TodayIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

// Three main tabs (owner decision). Today lives at "/" and is reached from the logo.
const TABS = [
  { href: "/campus", label: "Campus", Icon: CampusIcon },
  { href: "/schedule", label: "Schedule", Icon: ScheduleIcon },
  { href: "/advisor", label: "Advisor", Icon: AdvisorIcon },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  return (
    <>
      {/* Phones: small wordmark at the top that goes to Today. */}
      <header className={styles.topBar}>
        <Link href="/" className={styles.wordmark} aria-current={pathname === "/" ? "page" : undefined}>
          Super<span>Terp</span>
        </Link>
        <ThemeToggle />
      </header>
      <nav className={styles.nav} aria-label="Main">
        <Link href="/" className={styles.brand} aria-current={pathname === "/" ? "page" : undefined}>
          Super<span>Terp</span>
        </Link>
        <Link href="/" className={`${styles.tab} ${styles.todayLink}`} data-active={pathname === "/"}>
          <TodayIcon size={24} />
          <span>Today</span>
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
        <div className={styles.appearance}>
          <ThemeToggle />
        </div>
        <p className={styles.fine}>Unofficial. Not affiliated with the University of Maryland.</p>
      </nav>
    </>
  );
}
