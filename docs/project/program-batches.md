# Adding programs (batch builders)

One batch = one college, 10–15 programs. For each program:

1. **Program file**: `packages/audit/programs/<id>-2026-27.ts`, exporting one `Program` (copy the shape of
   `cmsc-major-2026-27.ts`). `id` is `<subject>-major|minor|cert[-<track>]`; `source` cites the catalog page
   AND the department page with fetch date; `verified: false`; every department-vs-catalog difference goes in
   `reviewNotes`, citing both. The department page wins where they disagree (owner ruling).
2. **Registry line**: one entry in `PROGRAMS` in `packages/programs/src/registry.ts`, in its kind's section
   (majors, minors, certificates, special). Fill `id`, `name` (exactly the Program's), `short` if the name is
   long, `kind`, `college` (from the catalog URL's `colleges-schools/<slug>/`), `catalogYear`, `verified`,
   `major` + `track` only for tracks of one major (default track first), `sources.catalog` and
   `sources.department`, and `load: () => import("@superterp/audit/programs/<file>.ts").then((m) => m.<export>)`.
   The import path must be a literal (the bundler splits each program into its own chunk). **Majors
   only**: after adding or changing a major's requirements, run `npm run build:course-sets -w @superterp/programs`
   to regenerate `packages/programs/src/course-sets.generated.ts` (the double-major notice pre-filter's
   per-major course list); `packages/programs/test/course-sets.test.ts` fails if you forget.
3. **Sample plan fixture**: `packages/programs/sample-plans/<id>.json` (see `math-major-applied.json`).
   Majors: the 4-year plan reached from https://4yearplans.umd.edu (college page, then department page),
   term by term, Gen Ed slots left out, credits listed for non-3-credit courses. Placeholder slots
   ("MATH 4**", "Supporting sequence I") are filled with real courses and each fill is written in `notes`.
   No plan published (always true for minors and certificates): build one from the department's
   requirements page, set `"official": false`, and flag it (step 5).
4. **Harness**: nothing to write. `packages/programs/test/sample-plans.test.ts` runs every fixture: the plan
   must satisfy every requirement, and for each requirement a drop mutant and a replace mutant must make
   the audit fail on that requirement. The registry test checks your line against the loaded Program.
5. **Flags**: when a sample plan fails because the site is stale or disagrees with the department page, do
   NOT bend the encoding. Add the program and failing requirement ids to `KNOWN_FAILURES` in
   `sample-plans.test.ts`, and add one line to `docs/project/owner-review.md` naming the program, the
   requirement and both sources. Same for constructed plans and anything else the owner must decide.

Rules:

- Special programs (honors, LLPs, Scholars) stay in `packages/catalog/special-programs/`; only their
  registry line lives here.
- No 🧪 labels (or any test/debug marker) in production code or UI text. "Unverified" is the only label.
- No student-correction button; the owner decides flagged items.
- Sharing limits (`max_shared_with`): when the catalog caps overlap with other programs, set
  `maxSharedWith` on the Program, e.g. a minor's "no more than 2 courses may also count toward the
  major" is `maxSharedWith: [{ courses: 2 }]`; a credit cap is `[{ credits: 6 }]`; a cap toward
  named programs only is `[{ programs: ["cmsc-major"], courses: 0 }]`. Omitted `programs` means every
  other program; Gen Ed, university and college layers never count. The audit enforces it across all
  programs at once. Put nothing there when the catalog is silent (sharing is then unlimited).
- Run `npm test -w @superterp/programs -- --reporter=dot` while working; the package must stay green.
