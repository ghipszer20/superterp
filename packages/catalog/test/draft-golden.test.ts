// Golden tests: the drafts of the real CS and Math pages against the programs
// encoded by hand in packages/audit/programs/. They must agree on everything a
// requirement table can express; every place they differ is listed below with
// the reason (a footnote rule, an owner ruling, an overlay, prose the drafter
// leaves to review), so a new difference fails the test until it's explained.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Program, Requirement } from "@superterp/audit";
import { cmscMajor } from "../../audit/programs/cmsc-major-2026-27.ts";
import { mathMajorTraditional } from "../../audit/programs/math-major-2026-27.ts";
import { mathMajorApplied } from "../../audit/programs/math-major-applied-2026-27.ts";
import { draftProgram, type Draft, type ReviewReason } from "../src/draft.ts";
import { parseProgramPage } from "../src/program.ts";

const fixture = (name: string) => parseProgramPage(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8"));
const meta = { catalogYear: "2026-27", source: "UMD Academic Catalog 2026–27" };

/** What a requirement means to the audit, without its id or name. "One of" is the same rule as a course or a choose-one. */
function meaning(r: Requirement): string {
  const sorted = (xs: string[]) => [...xs].sort();
  const overlay = r.overlay ? " overlay" : "";
  switch (r.kind) {
    case "course":
      return `one of ${sorted(r.options)}${overlay}`;
    case "choose":
      if (r.count === 1 && r.from.courses && Object.keys(r.from).length === 1) return `one of ${sorted(r.from.courses)}${overlay}`;
      return `choose ${r.count ?? `${r.credits} credits`} from ${JSON.stringify(r.from)}${overlay}`;
    case "sets":
      return `sets ${sorted(r.options.map((o) => sorted(o).join("&")))}${overlay}`;
    case "distribution":
      return `distribution ${r.count}/${r.minAreas}/${r.maxPerArea} ${r.areas.map((a) => `${a.name}=${sorted(a.courses)}`)}${overlay}`;
    case "concentration":
      return `concentration ${JSON.stringify({ ...r, id: undefined, name: undefined })}`;
  }
}

/** A requirement both have, drafted differently. */
type Pair = {
  draft: string;
  hand: string;
  why: string;
  /** Options the hand encoding adds beyond the table (and nothing else differs). */
  extraOptions?: string[];
  /** The hand encoding marks it an overlay; otherwise identical. */
  overlay?: true;
  /** Every draft set is in the hand encoding, which has more (sets requirements). */
  fewerSets?: true;
};
/** A hand requirement with no drafted counterpart: the table row went to review with this reason, or it isn't in the table at all. */
type Missing = { hand: string; why: string; review: ReviewReason | null; row?: string };

type Golden = { draft: Draft; hand: Program; pairs: Pair[]; missing: Missing[] };

const FOOTNOTE_1_HONORS = "footnote 1 (honors MATH340–MATH341) is prose; the table lists only the standard course";
const OWNER_CMSC141 = "owner-confirmed 2026-09-25: CMSC141/CMSC142 substitute for CMSC131/CMSC132; not in the catalog table";

const goldens: Record<string, Golden> = {
  "Computer Science Major": {
    draft: draftProgram(fixture("cs-major.html"), { ...meta, id: "cmsc-major", list: 0 }),
    hand: cmscMajor,
    pairs: [
      { draft: "cmsc131", hand: "cmsc131", why: OWNER_CMSC141, extraOptions: ["CMSC141"] },
      { draft: "cmsc132", hand: "cmsc132", why: OWNER_CMSC141, extraOptions: ["CMSC142"] },
    ],
    missing: [
      { hand: "stat4xx", why: "'STAT4xx' is an unlinked course pattern; the draft suggests the filter but doesn't guess", review: "course-pattern", row: "STAT4xx" },
      { hand: "mathxxx", why: "'MATH/AMSC/STAT xxx' depends on footnote 2 (prerequisite MATH141 or higher)", review: "unrecognized-rule", row: "MATH/AMSC/STAT xxx" },
      { hand: "electives", why: "the 6 upper-level elective credits come from footnote 3 only; no table row says so", review: null },
      {
        hand: "concentration",
        why: "'Select at least 12 credits … from one discipline outside of CMSC' is prose the drafter doesn't parse (the engine can express it)",
        review: "unrecognized-rule",
        row: "one discipline outside of CMSC",
      },
    ],
  },
  "Mathematics Major (Traditional Track)": {
    draft: draftProgram(fixture("math-major.html"), { ...meta, id: "math-major", list: 0 }),
    hand: mathMajorTraditional,
    pairs: [
      { draft: "math240", hand: "math240", why: `${FOOTNOTE_1_HONORS}; the hand encoding also makes it an overlay`, extraOptions: ["MATH340"], overlay: true },
      { draft: "math241", hand: "math241", why: FOOTNOTE_1_HONORS, extraOptions: ["MATH340"] },
      { draft: "one-of-math246", hand: "intro3", why: FOOTNOTE_1_HONORS, extraOptions: ["MATH341"] },
      { draft: "one-of-cmsc106", hand: "programming", why: OWNER_CMSC141, extraOptions: ["CMSC141", "CMSC142"] },
      { draft: "sequence-phys161", hand: "supporting", why: "owner ruling: CMSC131 may count for programming and Sequence Four, so the sequence is an overlay", overlay: true },
    ],
    missing: [
      { hand: "stat4xx", why: "'Any 400-level STAT course other than STAT464' is prose the drafter doesn't parse", review: "unrecognized-rule", row: "Any 400-level STAT course" },
      { hand: "depth", why: "'Select depth requirement; a one year sequence chosen from the following:' isn't a recognized phrasing, and it's an overlay", review: "unrecognized-rule", row: "Select depth requirement" },
      { hand: "eight", why: "'Select eight courses …; must include:' is an umbrella overlay count, with footnote 4's exclusions", review: "must-include", row: "must include" },
    ],
  },
  "Mathematics Major (Applied Mathematics Track)": {
    draft: draftProgram(fixture("math-major.html"), { ...meta, id: "math-major", list: 1 }),
    hand: mathMajorApplied,
    pairs: [
      { draft: "math240", hand: "math240", why: `${FOOTNOTE_1_HONORS}; the hand encoding also makes it an overlay`, extraOptions: ["MATH340"], overlay: true },
      { draft: "math241", hand: "math241", why: FOOTNOTE_1_HONORS, extraOptions: ["MATH340"] },
      { draft: "one-of-math246", hand: "intro3", why: FOOTNOTE_1_HONORS, extraOptions: ["MATH341"] },
      { draft: "one-of-cmsc106", hand: "programming", why: OWNER_CMSC141, extraOptions: ["CMSC141", "CMSC142"] },
      {
        draft: "sequence-phys161",
        hand: "supporting",
        why:
          "overlay (owner ruling on CMSC131); the hand encoding adds CMSC141/142 to Sequence Four (owner), BSCI171+BSCI161 for BSCI180 (a note in the course title), " +
          "and Sequence Eleven's 'Select Two From:' expanded by hand; the draft leaves Eleven and Twelve out with a check note",
        overlay: true,
        fewerSets: true,
      },
    ],
    missing: [
      { hand: "stat4xx", why: "'STAT4XX' is an unlinked course pattern (and the hand encoding excludes STAT410 and STAT464)", review: "course-pattern", row: "STAT4XX" },
      { hand: "depth", why: "'Select depth requirement; …' isn't a recognized phrasing, and it's an overlay", review: "unrecognized-rule", row: "Select depth requirement" },
      { hand: "eight", why: "'Select eight 400-level or higher; must include:' is an umbrella overlay count, with footnote 3's exclusions", review: "must-include", row: "must include" },
    ],
  },
};

describe.each(Object.entries(goldens))("draft of %s vs the hand encoding", (_, { draft, hand, pairs, missing }) => {
  const draftById = new Map(draft.program.requirements.map((r) => [r.id, r]));
  const handById = new Map(hand.requirements.map((r) => [r.id, r]));
  const handMeanings = new Set(hand.requirements.map(meaning));
  const draftMeanings = new Set(draft.program.requirements.map(meaning));

  it("agrees on every requirement except the documented differences", () => {
    const draftOnly = draft.program.requirements.filter((r) => !handMeanings.has(meaning(r))).map((r) => r.id);
    const handOnly = hand.requirements.filter((r) => !draftMeanings.has(meaning(r))).map((r) => r.id);
    expect(draftOnly.sort()).toEqual(pairs.map((p) => p.draft).sort());
    expect(handOnly.sort()).toEqual([...pairs.map((p) => p.hand), ...missing.map((m) => m.hand)].sort());
  });

  it.each(pairs)("$draft vs $hand differs only as documented: $why", (pair) => {
    const d = draftById.get(pair.draft)!;
    const h = handById.get(pair.hand)!;
    expect(Boolean(h.overlay)).toBe(Boolean(pair.overlay));
    expect(d.overlay).toBeUndefined();
    if (d.kind === "sets" && h.kind === "sets") {
      const handSets = new Set(h.options.map((o) => [...o].sort().join("&")));
      for (const o of d.options) expect(handSets).toContain([...o].sort().join("&"));
      expect(d.options.length < h.options.length).toBe(Boolean(pair.fewerSets));
      if (!pair.fewerSets) expect(meaning({ ...h, overlay: undefined })).toBe(meaning(d));
      return;
    }
    const options = (r: Requirement) => (r.kind === "course" ? r.options : r.kind === "choose" ? (r.from.courses ?? []) : []);
    expect(options(h).filter((o) => !options(d).includes(o)).sort()).toEqual([...(pair.extraOptions ?? [])].sort());
    expect(options(d).every((o) => options(h).includes(o))).toBe(true);
  });

  it.each(missing)("$hand is left to review ($review): $why", (m) => {
    if (m.review) expect(draft.review).toContainEqual(expect.objectContaining({ reason: m.review, text: expect.stringContaining(m.row!) }));
  });

  it("is unverified, and leaves program-wide rules from prose (minimum grade) to the owner", () => {
    expect(draft.program.verified).toBe(false);
    expect(draft.program.minGrade).toBeUndefined();
    expect(hand.minGrade).toBe("C-");
  });
});
