import { describe, expect, it } from "vitest";
import { formatDate, plural } from "../../app/review/labels";

describe("formatDate", () => {
  it("writes a sign-off date the way the app writes dates", () => {
    expect(formatDate("2026-09-25")).toBe("Sep 25, 2026");
    expect(formatDate("2027-01-03")).toBe("Jan 3, 2027");
  });

  it("leaves anything else as it is", () => {
    expect(formatDate("soon")).toBe("soon");
  });
});

describe("plural", () => {
  it("counts in words", () => {
    expect(plural(1, "table")).toBe("1 table");
    expect(plural(3, "table")).toBe("3 tables");
    expect(plural(0, "entry", "entries")).toBe("0 entries");
  });
});
