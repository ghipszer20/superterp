// Measures how much of a term's real prerequisite text the parser understands.
//
//   node scripts/prereq-coverage.ts [202701]
//
// A prerequisite counts as "clean" when every course code in the text ends up
// either as a course in the tree or inside a manual item on purpose (placement),
// and the tree isn't just one manual blob that swallowed course codes.

import { readFileSync } from "node:fs";
import { parsePrerequisite, type Requirement } from "../src/prereqs.ts";
import type { Course } from "../src/soc.ts";

const term = process.argv[2] ?? "202701";
const { courses } = JSON.parse(readFileSync(`.cache/soc-${term}.json`, "utf8")) as { courses: Course[] };

const CODE = /\b[A-Z]{4}\s?\d{3}[A-Z]?\b/g;
const codesIn = (s: string) => new Set((s.match(CODE) ?? []).map((c) => c.replace(/\s/, "")));

function treeCourses(r: Requirement, out = new Set<string>()): Set<string> {
  if (r.kind === "course") out.add(r.course);
  else if (r.kind === "all" || r.kind === "any") r.of.forEach((x) => treeCourses(x, out));
  return out;
}
function manualTexts(r: Requirement, out: string[] = []): string[] {
  if (r.kind === "manual") out.push(r.text);
  else if (r.kind === "all" || r.kind === "any") r.of.forEach((x) => manualTexts(x, out));
  return out;
}

const withPrereq = courses.filter((c) => c.texts.prerequisite);
let clean = 0;
let manualOnly = 0;
const problems: { id: string; text: string; lost: string[] }[] = [];

for (const c of withPrereq) {
  const text = c.texts.prerequisite!;
  const tree = parsePrerequisite(text);
  if (!tree) {
    problems.push({ id: c.id, text, lost: ["(nothing parsed)"] });
    continue;
  }
  const inTree = treeCourses(tree);
  const manual = manualTexts(tree).join(" ");
  const lost = [...codesIn(text)].filter((code) => !inTree.has(code) && !codesIn(manual).has(code));
  const swallowed = [...codesIn(manual)].filter((code) => !/eligibility|placement/i.test(manual) && !inTree.has(code));
  if (inTree.size === 0) manualOnly++;
  if (lost.length === 0 && swallowed.length === 0) clean++;
  else problems.push({ id: c.id, text, lost: [...lost, ...swallowed.map((s) => `${s} (in manual)`)] });
}

const pct = (n: number) => `${((100 * n) / withPrereq.length).toFixed(1)}%`;
console.log(`Term ${term}: ${courses.length} courses, ${withPrereq.length} with prerequisites`);
console.log(`Clean: ${clean} (${pct(clean)})   manual-only: ${manualOnly} (${pct(manualOnly)})   problems: ${problems.length}`);
for (const p of problems.slice(0, Number(process.env.SHOW ?? 25))) {
  console.log(`\n${p.id}: ${p.text}\n   → ${p.lost.join(", ")}`);
}
