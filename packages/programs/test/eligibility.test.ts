// Eligibility gates (ProgramMeta.notOpenTo): a minor or certificate closed to some majors is
// blocked for students who have declared one. Owner ruling, docs/project/rulings.md "Minors".
import { describe, expect, it } from "vitest";
import { blockedReason, findProgram, majorKey, PROGRAMS, type ProgramEntry } from "../src/registry.ts";

const load = async () => ({}) as never;
const entry = (e: Partial<ProgramEntry> & Pick<ProgramEntry, "id" | "kind">): ProgramEntry => ({
  name: e.id,
  college: "CMNS",
  catalogYear: "2026-27",
  verified: false,
  sources: {},
  load,
  ...e,
});

const minor = entry({ id: "x-minor", kind: "minor", notOpenTo: { programs: ["astr", "phys-major"], colleges: ["BMGT"], reason: "Not open to X majors." } });
const astrTrack = entry({ id: "astr-major-data", kind: "major", major: "astr" });
const physMajor = entry({ id: "phys-major", kind: "major", major: "phys" });
const physOtherTrack = entry({ id: "phys-major-applied", kind: "major", major: "phys" });
const bmgtMajor = entry({ id: "acct-major", kind: "major", college: "BMGT" });
const bmgtMinor = entry({ id: "bmgt-other-minor", kind: "minor", college: "BMGT" });
const unrelated = entry({ id: "cmsc-major", kind: "major" });
const all = [minor, astrTrack, physMajor, physOtherTrack, bmgtMajor, bmgtMinor, unrelated];
const lookup = (id: string) => all.find((e) => e.id === id);

describe("blockedReason", () => {
  it("returns undefined for a program with no gate", () => {
    expect(blockedReason(unrelated, ["astr-major-data"], lookup)).toBeUndefined();
  });

  it("blocks by major key, covering every track", () => {
    expect(blockedReason(minor, ["astr-major-data"], lookup)).toBe("Not open to X majors.");
  });

  it("blocks by program id, only that track", () => {
    expect(blockedReason(minor, ["phys-major"], lookup)).toBe("Not open to X majors.");
    expect(blockedReason(minor, ["phys-major-applied"], lookup)).toBeUndefined();
  });

  it("blocks every major of a listed college, but not its minors", () => {
    expect(blockedReason(minor, ["acct-major"], lookup)).toBe("Not open to X majors.");
    expect(blockedReason(minor, ["bmgt-other-minor"], lookup)).toBeUndefined();
  });

  it("ignores unrelated and unknown declared ids", () => {
    expect(blockedReason(minor, ["cmsc-major", "no-such-id"], lookup)).toBeUndefined();
    expect(blockedReason(minor, [], lookup)).toBeUndefined();
  });

  it("uses the registry by default", () => {
    const astr = PROGRAMS.find((p) => p.id === "astr-minor")!;
    expect(blockedReason(astr, ["astr-major-data-science"])).toBe(astr.notOpenTo?.reason);
  });
});

// Harness: every gate in the registry names real majors and actually bites.
describe("every registered eligibility gate", () => {
  const majors = PROGRAMS.filter((p) => p.kind === "major");
  const gated = PROGRAMS.filter((p) => p.notOpenTo);

  it("exists for the encoded examples", () => {
    expect(gated.map((p) => p.id)).toEqual(expect.arrayContaining(["astr-minor", "neur-minor", "bmgt-minor-general-business"]));
  });

  for (const p of gated) {
    const gate = p.notOpenTo!;
    describe(p.id, () => {
      it("names only registered majors (program id or major key) and colleges with majors", () => {
        for (const ref of gate.programs ?? []) {
          expect(majors.some((m) => m.id === ref || majorKey(m) === ref), `${ref} is not a registered major id or major key`).toBe(true);
        }
        for (const c of gate.colleges ?? []) {
          expect(majors.some((m) => m.college === c), `${c} owns no registered major`).toBe(true);
        }
        expect(gate.reason.trim()).not.toBe("");
      });

      it("blocks one excluded major and lets an unrelated major through", () => {
        const excluded = majors.find((m) => (gate.programs ?? []).some((ref) => m.id === ref || majorKey(m) === ref) || (gate.colleges ?? []).includes(m.college))!;
        expect(blockedReason(p, [excluded.id])).toBe(gate.reason);
        const other = majors.find((m) => blockedReason(p, [m.id]) === undefined)!;
        expect(other).toBeDefined();
        expect(findProgram(other.id)).toBeDefined();
      });
    });
  }
});
