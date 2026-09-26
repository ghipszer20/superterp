// Development-only example data for screenshots and local checks: /advisor?seed=owner loads a
// Math (Applied) + CS plan (the terms of packages/plan/test/fixtures/owner-plan.ts) with AP
// Calculus BC 5 entered, and signs the agreement as "UI Check". Inert in production builds unless
// NEXT_PUBLIC_SUPERTERP_SEED=1, so a student can never skip the agreement.

import { CONSENT_VERSION, type ConsentRecord } from "./consent";
import { emptyPrior, type AdvisorPlan } from "./plan-state";

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

export function seedFromUrl(search: string, env: Env): { plan: AdvisorPlan | null; consent: ConsentRecord } | null {
  if (!seedAllowed(env)) return null;
  const seed = new URLSearchParams(search).get("seed");
  if (seed !== "owner" && seed !== "signed") return null;
  const consent = { name: "UI Check", acceptedAt: "2026-09-25T12:00:00.000Z", version: CONSENT_VERSION };
  return { plan: seed === "owner" ? ownerPlan() : null, consent };
}
