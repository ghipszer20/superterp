// Light / Dark appearance. The saved choice wins; on a first visit (or if the
// saved value is unreadable) the device's setting decides.

export type Theme = "light" | "dark";

export function resolveTheme(saved: string | null, systemPrefersDark: boolean): Theme {
  if (saved === "light" || saved === "dark") return saved;
  return systemPrefersDark ? "dark" : "light";
}
