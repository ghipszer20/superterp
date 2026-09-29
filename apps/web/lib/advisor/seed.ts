// Development-only example data for screenshots and local checks: /advisor?seed=owner loads a
// Math (Applied) + CS plan (the terms of packages/plan/test/fixtures/owner-plan.ts) with AP
// Calculus BC 5 entered, and signs the agreement as "UI Check". Inert in production builds unless
// NEXT_PUBLIC_SUPERTERP_SEED=1, so a student can never skip the agreement.
// &tracks=pre-med,pre-law adds those tracks to the owner seed's plan (unknown ids dropped), for
// screenshotting the Tracks checks and audit section without hand-editing the owner plan above.
// &degree=double-degree checks the owner plan as two degrees (the double-degree checks).

// TRACKS comes from "@superterp/tracks/list" (no runtime @superterp/audit import), so this stays
// out of the main bundle's solver code -- store.ts, which calls seedFromUrl, is part of it.
import { TRACKS } from "@superterp/tracks/list";
import { CONSENT_VERSION, type ConsentRecord } from "./consent";
import { DEGREE_CHOICES, emptyPrior, type AdvisorPlan, type DegreeChoice } from "./plan-state";

type Env = { NODE_ENV?: string; NEXT_PUBLIC_SUPERTERP_SEED?: string };

export function seedAllowed(env: Env): boolean {
  return env.NODE_ENV === "development" || env.NEXT_PUBLIC_SUPERTERP_SEED === "1";
}

const OWNER_TERMS: [string, string[]][] = [
  ["Fall 2026", ["CMSC131", "MATH240", "ENGL101", "UNIV100", "HIST200"]],
  ["Spring 2027", ["CMSC132", "MATH241", "COMM107", "PHIL140", "CHEM131", "CHEM132"]],
  ["Fall 2027", ["CMSC216", "CMSC250", "MATH246", "MATH310"]],
  ["Spring 2028", ["CMSC330", "CMSC351", "STAT410", "ARTH200", "AAAS100"]],
  ["Fall 2028", ["CMSC320", "MATH410", "MATH401", "AMSC460", "ECON200"]],
  ["Spring 2029", ["CMSC420", "CMSC335", "MATH411", "STAT401", "ENGL394"]],
  ["Fall 2029", ["CMSC414", "CMSC451", "MATH420", "MATH462", "PSYC100"]],
  ["Spring 2030", ["CMSC412", "CMSC421", "SOCY100", "ANTH260"]],
];

function ownerPlan(): AdvisorPlan {
  return {
    v: 1,
    programs: ["math-major-applied", "cmsc-major"],
    catalogYear: "2026-27",
    startTerm: "Fall 2026",
    terms: OWNER_TERMS.map(([name, ids]) => ({ name, courses: ids.map((id) => ({ id })) })),
    prior: { ...emptyPrior(), ap: [{ key: "seed-ap-1", exam: "Calculus BC", score: 5 }] },
  };
}

const KNOWN_TRACK_IDS = new Set(TRACKS.map((t) => t.id));

export function seedFromUrl(search: string, env: Env): { plan: AdvisorPlan | null; consent: ConsentRecord } | null {
  if (!seedAllowed(env)) return null;
  const params = new URLSearchParams(search);
  const seed = params.get("seed");
  if (seed !== "owner" && seed !== "signed") return null;
  const consent = { name: "UI Check", acceptedAt: "2026-09-25T12:00:00.000Z", version: CONSENT_VERSION };
  if (seed !== "owner") return { plan: null, consent };
  const plan = ownerPlan();
  const tracks = (params.get("tracks") ?? "").split(",").filter((id) => KNOWN_TRACK_IDS.has(id));
  if (tracks.length) plan.tracks = tracks;
  const degree = params.get("degree");
  if (DEGREE_CHOICES.includes(degree as DegreeChoice)) plan.degreeMode = degree as DegreeChoice;
  // &add=pwrt-minor appends programs; &slots=pwrt-minor/approved-courses ticks those Open Slots.
  const csv = (name: string) => (params.get(name) ?? "").split(",").filter(Boolean);
  plan.programs.push(...csv("add").filter((id) => !plan.programs.includes(id)));
  const slots = csv("slots");
  if (slots.length) plan.confirmedSlots = slots;
  return { plan, consent };
}
