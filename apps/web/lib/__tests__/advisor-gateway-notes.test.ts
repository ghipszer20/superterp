import type { GatewayCourseResult } from "@superterp/audit";
import { describe, expect, it } from "vitest";
import { gatewayCourseNote } from "../advisor/gateway-notes";

const course = (status: GatewayCourseResult["status"], options = ["MATH140"]): GatewayCourseResult => ({
  id: "MATH140",
  name: "Calculus I",
  options,
  status,
});

describe("gatewayCourseNote", () => {
  it("explains a below-minimum result that came from ungraded prior credit", () => {
    const note = gatewayCourseNote(course("below-minimum"), "B-", new Set(["MATH140"]));
    expect(note).toBe(
      "MATH140 came from prior credit with no letter grade, so SuperTerp can't check it against the B- gateway minimum. Confirm your CS gateway eligibility with CS advising.",
    );
  });

  it("says nothing when the course met the gateway", () => {
    expect(gatewayCourseNote(course("met"), "B-", new Set(["MATH140"]))).toBeNull();
  });

  it("says nothing when below-minimum isn't from prior credit", () => {
    expect(gatewayCourseNote(course("below-minimum"), "B-", new Set())).toBeNull();
  });

  it("matches a substitute option, e.g. CMSC141 for CMSC131", () => {
    const note = gatewayCourseNote(course("below-minimum", ["CMSC131", "CMSC141"]), "B-", new Set(["CMSC141"]));
    expect(note).not.toBeNull();
  });
});
