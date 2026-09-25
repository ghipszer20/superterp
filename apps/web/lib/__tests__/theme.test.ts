import { describe, expect, it } from "vitest";
import { applyTheme, resolveTheme, THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from "../theme";

/** Runs the inline pre-paint script against a fake browser; returns the theme it applied. */
function runInit(saved: string | null, systemDark: boolean, storageThrows = false) {
  const attrs: Record<string, string> = {};
  const fake = {
    localStorage: {
      getItem: () => {
        if (storageThrows) throw new Error("blocked");
        return saved;
      },
    },
    matchMedia: (q: string) => ({ matches: q.includes("dark") && systemDark }),
    document: { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } },
  };
  new Function("localStorage", "matchMedia", "document", THEME_INIT_SCRIPT)(fake.localStorage, fake.matchMedia, fake.document);
  return attrs["data-theme"];
}

describe("resolveTheme", () => {
  it("uses the saved choice when there is one", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("falls back to the device setting on a first visit or a corrupted saved value", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("purple", true)).toBe("dark");
  });
});

describe("pre-paint script", () => {
  it("applies the saved theme to the page before it draws", () => {
    expect(runInit("dark", false)).toBe("dark");
    expect(runInit("light", true)).toBe("light");
  });

  it("follows the device on a first visit", () => {
    expect(runInit(null, true)).toBe("dark");
    expect(runInit(null, false)).toBe("light");
  });

  it("still applies a theme when storage is blocked (private browsing)", () => {
    expect(runInit(null, true, true)).toBe("dark");
  });
});

describe("applyTheme", () => {
  it("switches the page and remembers the choice", () => {
    const attrs: Record<string, string> = {};
    const stored: Record<string, string> = {};
    applyTheme("dark", { setAttribute: (k, v) => (attrs[k] = v) }, { setItem: (k, v) => (stored[k] = v) });
    expect(attrs["data-theme"]).toBe("dark");
    expect(stored[THEME_STORAGE_KEY]).toBe("dark");
  });

  it("still switches the page when storage is blocked", () => {
    const attrs: Record<string, string> = {};
    const blocked = { setItem: () => { throw new Error("blocked"); } };
    expect(() => applyTheme("light", { setAttribute: (k, v) => (attrs[k] = v) }, blocked)).not.toThrow();
    expect(attrs["data-theme"]).toBe("light");
  });
});
