import { describe, expect, it } from "vitest";
import { resolveTheme } from "../theme";

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
