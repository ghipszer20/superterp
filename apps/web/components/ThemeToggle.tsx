"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, type Theme } from "@/lib/theme";
import { Segmented } from "./Segmented";
import styles from "./ThemeToggle.module.css";

// The theme lives on <html data-theme>, set before first paint by the
// pre-paint script. Subscribe to it so the control always shows what's applied.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const currentTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
const unknownOnServer = (): Theme | null => null;

/** Light / Dark appearance switch. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, unknownOnServer);

  return (
    <div className={styles.toggle} data-ready={theme !== null}>
      <Segmented<Theme>
        label="Appearance"
        options={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
        value={theme ?? "light"}
        onChange={(next) => applyTheme(next, document.documentElement, window.localStorage)}
      />
    </div>
  );
}
