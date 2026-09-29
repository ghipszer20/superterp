// Downloads one term of the Schedule of Classes (every department, course
// and section) into .cache/soc-<term>.json. Polite: one request at a time
// with a pause between them. Run by hand:
//
//   npm run snapshot -w @superterp/course-data -- 202701

import { mkdirSync, writeFileSync } from "node:fs";
import { fetchCourses, fetchSections, fetchTermsAndDepartments, withExtraDepartments, type Course, type Section } from "../src/soc.ts";

const PAUSE_MS = 300;
const SECTION_BATCH = 40;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const { terms, departments: listed } = await fetchTermsAndDepartments();
const departments = withExtraDepartments(listed);
const term = process.argv[2] ?? terms.find((t) => t.current)?.id;
if (!term) throw new Error("No term given and no current term found");
console.log(`Term ${term}: ${departments.length} departments`);

const courses: Course[] = [];
for (const [i, dept] of departments.entries()) {
  try {
    courses.push(...(await fetchCourses(term, dept.code)));
  } catch (err) {
    console.warn(`  ${dept.code}: ${(err as Error).message}`);
  }
  if (i % 25 === 0) console.log(`  courses: ${i + 1}/${departments.length} departments, ${courses.length} courses`);
  await sleep(PAUSE_MS);
}

const sections: Section[] = [];
const ids = courses.map((c) => c.id);
for (let i = 0; i < ids.length; i += SECTION_BATCH) {
  try {
    sections.push(...(await fetchSections(term, ids.slice(i, i + SECTION_BATCH))));
  } catch (err) {
    console.warn(`  sections ${i}: ${(err as Error).message}`);
  }
  if ((i / SECTION_BATCH) % 25 === 0) console.log(`  sections: ${Math.min(i + SECTION_BATCH, ids.length)}/${ids.length} courses`);
  await sleep(PAUSE_MS);
}

mkdirSync(".cache", { recursive: true });
const file = `.cache/soc-${term}.json`;
writeFileSync(file, JSON.stringify({ term, fetchedAt: new Date().toISOString(), departments, courses, sections }));
console.log(`Saved ${courses.length} courses and ${sections.length} sections to ${file}`);
