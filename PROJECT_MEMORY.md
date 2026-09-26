# SuperTerp — Project Memory

> Single source of truth for project context. Update this file whenever a decision changes.
> Last updated: 2026-09-24 (initial planning session).

## 1. Vision
An all-in-one iOS app + website for UMD students. It combines:
- Coursicle-style schedule planning
- UMD degree audit
- The UMD Schedule of Classes
- PlanetTerp and Reddit course/professor info
- Advising, campus life info (dining, libraries, gyms) and study-room booking

What sets it apart from Jupiterp, Coursicle and PlanetTerp is the **degree audit + 4-year planner + advising**, all in one app.

## 2. Owner decisions and preferences (do not re-litigate)
- **Open source, no LLC** (owner, 2026-09-24): SuperTerp is open source, with no LLC unless it is absolutely necessary. The code license (MIT or Apache-2.0, not yet chosen) disclaims warranty on the code. The hosted app relies on the clickwrap terms. Secrets (API keys, LibCal/DOTS credentials) stay out of the repo.
- **Name:** "SuperTerp" is decided (owner, 2026-09-24). It's free, open-source and a student project, the same pattern as PlanetTerp and Jupiterp, so trademark risk is low. Backup: "Scute". **The project will never make money** (owner, 2026-09-24): no ads and no paid tier, so the Trademarks email is optional. This also keeps Reddit, PlanetTerp and Libraries/DOTS data requests in the non-commercial category. superterp.com is registered but dead (a 404 on old GitHub Pages servers). superterp.app and getsuperterp.com didn't resolve, so they're likely available.
- **Every major must work**, not only CS. Every minor, specialization and special program with course requirements must also be included: Honors College LLPs, Gemstone, College Park Scholars, CIVICUS, other LLPs, citations, certificates, notations, departmental honors, combined BS/MS, ROTC, and **every pre-professional track with its requirements** (pre-med, pre-law, pre-dental, pre-PA, pre-vet, pre-pharmacy, pre-nursing, and others; see module 1).
- **No student-correction button or review queue.** The owner personally tests and verifies all requirement data before launch. Only programs the owner has signed off (✅) ship, with no 🧪 labels in production. After launch, a support email is fine.
- **Seat alerts were NOT requested by the owner.** Claude suggested them. They're treated as an investigation spike only.
- **The UI must be incredibly sleek and easy to understand, Apple-style quality.** 4-year plan grid styled like the UMD CS 4-year plan, but with lighter, friendlier colors.
- Grade upload is wanted so the LLM can give personalized course-selection feedback.
- Dining hall menus, library hours, all RecWell gym schedules, and booking any study room at any library are all wanted.
- Shuttle-UM bus schedules are wanted, with the Transit app as the design inspiration.
- Changes in the schedule builder must update the 4-year plan (two-way sync; see module 3).
- The 4-year plan feature requires a signed liability agreement (typed-name clickwrap) before first use (see section 11).
- Must handle switching majors, grad courses as an undergrad, double majors, double degrees, and adding or dropping majors and minors (see module 1).

## 3. Feature modules
Moved to `docs/project/feature-modules.md`. Read it before designing or building any feature.

## 4. Verified data sources (checked 2026-09-24)
Moved to `docs/project/data-sources.md`. Read it before touching a scraper or data source.

## 5. Study-room booking plan
- **Level 1 (no permission needed):** a unified availability grid plus smart search. Each slot deep-links to the exact room and date on LibCal.
- **Level 2 (needs UMD Libraries to issue credentials):** in-app one-tap booking through LibCal's official API, plus "My bookings".
- **Never** automate LibCal's public booking form without permission.

## 6. Requirements pipeline (every program)
1. Scrape the catalog.
2. Parse the tables with ordinary code.
3. Use an LLM to extract footnotes and prose into the rule format, with confidence flags.
4. Validate: official plans must pass, and mutation tests (plans broken on purpose) must fail.
5. Owner reviews in a side-by-side review tool and signs off (✅).
6. Re-scrape the catalog each year and diff the changes.

Scale: about 200–300+ programs, roughly 200–300 hours of owner review. Launching in waves by college is an open option.

## 7. Tech stack
See the package.json files: Next.js web app (apps/web), TypeScript packages, HiGHS for the audit. Decisions behind the stack are in section 13.

## 8. UI / design
- **Principles:** show the answer, not the data; one main action per screen; plain language (e.g. "Humanities (DSHU)"); color only when it means something (white and gray, one accent, a pastel for each requirement category); an instant feel (cached data, skeleton loading, springs, haptics); accessibility (Dynamic Type, VoiceOver, dark mode, AA contrast).
- **Navigation (owner decision, 2026-09-24):** THREE main tabs: **Campus · Schedule · Advisor**.
  - **Campus** has a sub-nav: Dining · Transit (Shuttle-UM) · Libraries (hours + study rooms) · Gyms.
  - **Schedule**: the schedule builder, plus course and professor info (replaces the old Explore idea).
  - **Advisor**: the 4-year plan / degree audit plus LLM advising.
  - **Today** summary is the home page (`/`), reached from the SuperTerp logo; it's not a tab.
  - **Accent red #BA0C2F approved** by the owner.
- **Onboarding** in under 60 seconds: major and year → transcript → audit.
- Don't use Testudo or UMD logos. Logo idea: abstract hexagon or shell plates.
- The website gets a desktop layout, not a stretched phone app.

## 9. Phases
| # | Scope |
|---|---|
| 0 | Data: Testudo, catalog (all programs), PlanetTerp, dining, LibCal, RecWell, Shuttle-UM GTFS |
| 0.5 | Design system, Figma prototypes, watching ~5 students use them, performance targets (<100 ms interactions) |
| 1 | Schedule builder and generator + Campus tab (dining, libraries, gyms, room availability, buses with scheduled times and "leave by" times) |
| 2 | Audit and 4-year planner for every program + transcript import + validation harness + review tool |
| 2b | Owner verification pass (can overlap with 3–4) |
| 3 | Advising v1 (what-if audits, semester and section recommendations, strength profile) |
| 4 | Accounts, reviews and moderation, professor summaries, LLM advisor and grade feedback |
| 5 | Optimizer (easier, front-loaded, summer), registration-day plan |
| 6 | iOS extras: widgets, Live Activities for the next bus, dining/booking/waitlist reminders; add live bus data once DOTS grants access |
| Spike | Seat and waitlist monitoring during a registration window |

MVP recommendation: Phases 0–2 plus what-if audits and section recommendations from Phase 3.

## 10. Open to-dos and questions
- [ ] Optional: a courtesy heads-up email to UMD Trademarks & Licensing (not a blocker). Required only if the project starts making money.
- [x] No lawyer review (owner decision, 2026-09-24): a disclaimer is enough. Claude drafts plain-language disclaimer, terms and privacy text.
- [ ] Email UMD Libraries requesting LibCal API credentials.
- [ ] Email UMD DOTS requesting Shuttle-UM real-time data access (a Swiftly GTFS-RT key).
- [ ] Claim a domain (superterp.app or getsuperterp.com), the App Store name and social handles.
- [ ] Decide whether to reuse or partner with Jupiterp (open source; check license).
- [ ] Confirm UMD's per-semester credit cap and Expo's native-component support.
- [ ] Decide: launch everything at once, or in waves by college.
- [x] ~~Expo vs SwiftUI~~: decided website-first with Next.js (section 13); iOS later.
- [x] Monetization: never (section 2). Team: solo owner + Claude.
- [x] Repo created: github.com/ghipszer20/superterp (private, Apache-2.0), local at C:\Users\24GHi\Code\SuperTerp. Git uses HTTPS with the gh credential helper (SSH host key isn't set up in this shell).
- [ ] Before making the repo public: scrub personal details from PROJECT_MEMORY.md (owner's program plans, personal notes) and review git history.

## 11. Legal and trust notes
- **Required liability agreement for the 4-year plan / audit (owner requirement, 2026-09-24).**
  - A clickwrap gate before first use. The student must scroll through a short, plain-language notice, tick the box, **type their full name as a signature** and see the date. There's no way to skip it.
  - Content:
    - Unofficial; not affiliated with UMD; not academic advising.
    - May contain errors or outdated catalog data.
    - The student is responsible for checking with their advisor and UMD's official degree audit before registering or changing programs.
    - No warranty, and limitation of liability (e.g. for extra semesters or costs).
    - Covers the advisor, optimizer, LLM feedback and pre-professional tracks too.
  - **Proof of consent:** store the agreement version, timestamp, account, and a hash of the typed name on the server. So the planner **requires a umd.edu account** (a change from "no account needed"; other tabs stay usable without one). Ask for re-consent when the wording changes materially.
  - **Protection inside the product too, not only the signature:**
    - Every audit result cites its catalog rule and catalog year.
    - "Verify with your advisor" prompts at high-stakes moments: committing a program change or dropping a course that delays graduation.
    - Exported PDFs carry a disclaimer footer and are laid out to take to an advisor.
  - **No lawyer review and no LLC** (owner decision, 2026-09-24): the disclaimer is enough. Assumption: the typed-name agreement stays, since it is the disclaimer in its strongest form; confirm with the owner if in doubt. Claude writes the wording. A signature reduces risk but doesn't remove it, especially for negligence. **Accuracy plus the owner's verification pass is the real protection.**
- Show a "not official advising" disclaimer and the catalog year used.
- No UMD marks: no Testudo, no official logos, no official color scheme that suggests affiliation. Show "Not affiliated with the University of Maryland" in the app, on the website and in the App Store listing.
- Never ask for or store Testudo credentials, and never auto-register students.
- Be polite when scraping: cache results, back off on errors, and poll only what's needed.

## 12. Time estimate (2026-09-24; assumes solo + AI coding help)
- Total ≈ 1,500–2,300 hrs: data 175–270, design 60–120, schedule builder + Campus tab + basics 220–330, audit engine + planner 420–660, **owner verification 250–350 (critical path, can't be delegated)**, advising 80–120, reviews + LLM 120–180, optimizer 80–120, iOS polish 100–150.
- Calendar time: 15 hrs/wk ≈ 2–3 yrs; 25 hrs/wk ≈ 1.2–1.8 yrs; full-time summers + ~15/wk ≈ 18–24 months.
- Launch schedule: Jan 2027 Campus tab web beta → Mar–Apr 2027 schedule builder (Fall 2027 registration) → Summer 2027 audit engine + verification → Nov 2027 audit for first verified colleges → Spring 2028 all colleges, reviews, AI advisor, optimizer, iOS on the App Store.
- Re-estimate once the Campus tab ships.

## 13. Build decisions (owner, 2026-09-24): locked for the start
- **Platform:** website first. Next.js installable web app (PWA). The rules engine, scrapers and data are separate packages, so an iOS app can reuse them later.
- **First build:** the Campus tab (dining, library hours, RecWell, buses, study-room availability). It also sets up the repo, design system and scraper infrastructure.
- **Repo:** private at `ghipszer20/superterp` until launch, then public. License **Apache-2.0**.
- **Hosting:** free tiers only. Vercel (web), Supabase (DB and auth), GitHub Actions (scheduled scrapers). The owner creates the accounts when deployment needs them.
- **Workflow (updated 2026-09-24):** NO PR reviews. Claude works autonomously on long-running branches with draft PRs; the owner merges whenever they like, without reviewing (Claude can never push or merge to main). Check in with the owner ONLY for: (1) any **major UI change**, which the owner must approve (show screenshots or a local preview first); (2) design or functionality changes the owner wants; (3) problems or blockers; (4) something turning out infeasible; (5) a good new idea. Everything else: decide, note the assumption, keep going. PRs still explain web-specific choices, since the owner knows Python and less web.
- **Design:** Claude drafts an Apple-style design system; the owner reviews visually and approves. Accent color: **(PRODUCT)RED iPhone red, `#BA0C2F`** (owner approved 2026-09-24). Full strength only on buttons, active tabs and highlights; pale tints for backgrounds; a brighter variant in dark mode for contrast. Soft whites and grays, light and dark mode.
- **Owner profile:** Math major, CS minor, adding a CS dual degree. **First verification target: Math + CS double major.** Also build a Math + CS double-degree test student.
- **Transcript:** the owner will provide their unofficial transcript during the Phase 2 parser work. It stays local only and is never committed (gitignored).
- **Tooling on the owner's PC:** git, gh (logged in as ghipszer20), Node 24, npm, Python 3.13 via `py` (no `python` or `python3` on PATH), no Docker (so use hosted Supabase, not local).

## 14. Status log
- **2026-09-24, PR #1 (`feat/campus-foundation`, draft):** repo foundation + Campus tab.
  - `packages/campus-data`: dining, libraries (LibCal JSON feed `api_hours_grid.php?iid=1504`), RecWell sheet, study rooms (LibCal catalog + grid), Shuttle-UM GTFS. 38 fixture tests; `npm run smoke` checks the live sites (all 5 passed 2026-09-24).
  - `apps/web` (Next.js 16, Cache Components): Today, Campus hub, Dining, Study Rooms, Buses, Libraries, Gyms & Rec, plus placeholder Schedule/Plan/Explore. `next build`, `tsc` and ESLint are clean; `npm run ui-check` (headless Edge over DevTools at iPhone size) shows 0 console errors on all 8 pages.
  - Owner approved the red and set the navigation (Campus · Schedule · Advisor, with Today at `/`). Implemented 2026-09-24: Campus sub-nav, Dining · Transit · Libraries (+ study rooms) · Gyms; redirects from /plan, /explore, /campus/buses.
  - **Waiting on owner:** a final look at the restructured navigation (screenshots in `apps/web/.ui-check/`).
  - **Review to-dos (not blocking PR 1):**
    - The GTFS feed ends 2026-12-24. `validUntil` is parsed but not shown, so after it expires the app would say "No Shuttle-UM service". Warn in the UI and in a scheduled check before that date.
    - Before public launch, check the GTFS feed's license (Interline/actionfigure) for republishing schedules.
    - Add GitHub Actions CI (test, lint, build). Web `tsc --noEmit` fails on a fresh clone until Next generates `LayoutProps` (run `next typegen` or build first).
    - If a source is down, show the last good data (needs a database).
- **2026-09-24/25 overnight, PR #2 (`feat/course-data`, draft, stacked on #1):**
  - `packages/course-data`: Testudo SOC parser (Spring 2027 snapshot: 4,375 courses, 7,221 sections, gitignored `.cache/`); prerequisite parser (100% course-code retention over 1,363 prerequisites) and `checkRequirement` (met/unmet/confirm).
  - `packages/catalog`: catalog requirement-table parser (CS and Math fixtures).
  - `packages/audit`: HiGHS-based audit (course, choose N/credits, distribution, concentration, min grade, multi-program sharing limit); CS major 2026–27 encoded (`programs/cmsc-major-2026-27.ts`, unverified, with review notes) and golden-tested.
  - `CONTEXT.md` glossary, `docs/adr/0001`, `0002`.
  - Tests: 96 passing across 4 packages.
  - 2026-09-25 day: schedule generator (all combinations, grouped into distinct layouts; freshman example 190,688 schedules → 17,936 layouts in 26 ms); audit gained 'sets' and overlay requirements; **Math major Traditional Track encoded** (`programs/math-major-2026-27.ts`, unverified, 8 review notes); **Math + CS double-major golden test passes**.
  - **Open question for owner:** which Math track are they in? (Traditional encoded as the default.)
  - Gen Ed + university rules encoded (`programs/gen-ed-2026-27.ts`, unverified): FS with FSAW C-, DS one-category-per-course, DSNL/second lab, Big Question and Diversity as overlays; 120-credit total. Engine gained Gen Ed filters, any-course filter, per-requirement minimum grades. Tests: 126 passing.
  - **Next:** the schedule builder UI (design needs owner approval), transcript import, then deployment + pre-warmed data.
  - **Next up (per plan):** Phase 1 schedule builder on the shared plan model; deploy to Vercel once the owner creates an account.
- **2026-09-25 afternoon (merged into `feat/course-data`, CI green):** doctor cleanup (PROJECT_MEMORY split into `docs/project/`); catalog program index + footnotes + coverage report (270 programs); `@superterp/credit` (AP/IB/dual enrollment; one calculus award; overlapping credit counts once); schedule filters/sort/empty-state explanations (`packages/course-data`); campus snapshots (`@superterp/campus-data/snapshots`, dining split 495→241 KB); catalog drafter (`packages/catalog/src/draft.ts`, 66.1% of rows automatic); audit shapes (alternatives, counted sets, filter members; Sequence Twelve); `@superterp/plan` (plan checker + double major / dual degree notices). Tests: 708.
- **Overtime mode ON (2026-09-25 evening).** Running: grade summaries (`feat/grade-summaries`), owner review tool (`feat/review-tool`), LLP/special programs (`feat/special-programs`). Queue: (1) rulings cleanup: repeat-only-if-failed in the plan checker, gateway AP/W assumptions, Traditional Sequence Four CMSC141/142; (2) schedule builder UI (gallery v3, workday filters, side-panel editor with ghost sections, "Build my own"); (3) Advisor: 4-year plan UI with plan checker, audit, AP/IB entry and the typed-name disclaimer; (4) grade-distribution UI once summaries merge.
- **Overtime progress (2026-09-25 night), merged into `feat/course-data`, CI green:** grade summaries (`@superterp/ratings`: 4,375 courses fetched, 3,230 with data, one file per department; raw cache kept in the main checkout's `packages/ratings/.cache/`); 36 LLPs/special programs found, 28 drafted by hand (`packages/catalog/special-programs/`; Departmental Honors deferred); owner review tool (`/review`, dev or `SUPERTERP_REVIEW=1` only; sign-offs in `packages/catalog/review/signoffs.json`); rulings cleanup (retake only after F; gateway no-grade credit met and W = not taken; Traditional Sequence Four accepts CMSC141/142; each assumption is a named constant). Grade-distribution UI folded into the schedule and Advisor UI builders.
  - **Assumption (overtime):** the review tool marks a verified program "changed since verified" when either the catalog tables OR the drafted/hand-encoded requirements change (safer, but a drafter improvement re-flags every verified drafted program). Owner may prefer catalog-only.
  - Running: schedule builder UI (`feat/schedule-ui`), Advisor 4-year plan UI (`feat/advisor-ui`), pre-professional tracks (`feat/tracks`). Later queue: Departmental Honors programs; drafter conversion of "sequence with a rule" rows; snapshot cleanup of old dated files.
- **2026-09-25 ~9:45pm ET: builders stopped, most likely at the usage limit.** The account's 5-hour usage limit showed as reached (reset 2:20am ET 2026-09-26) right after `feat/schedule-ui`, `feat/advisor-ui` and `feat/tracks` were dispatched; none of the three pushed a commit. The 7-day limit is also close. **To resume:** run `git worktree list` in the main checkout first and continue any partial worktree instead of restarting; then run schedule-ui and advisor-ui (critical path), and tracks after one of them finishes. The builder rules in section 18 were rewritten to prevent a repeat.
- **2026-09-26: partial work saved and resumed.** The three worktrees held uncommitted work (schedule-ui: 3 commits + 28 files of UI; advisor-ui: 5 commits + 7 screen files; tracks: 13 files, pre-med in progress). Each was committed as an unverified WIP snapshot and pushed: `feat/schedule-ui` `5e9e075`, `feat/advisor-ui` `b4c0d70`, `feat/tracks` `8488741`. Resumed per section 18 (Sonnet, 2 at once, short briefs, continuing in the existing worktrees): schedule-ui and advisor-ui running; tracks queued for the next free slot.
- **2026-09-26 ~3am ET: schedule builder merged** (`b9081a6`, CI green). The WIP snapshot was nearly complete; the resumed builder fixed a lint error and a phone bug (the bottom-sheet panel was pinned to the top of the screen). Works end to end: course picker, gallery (shared time scale, teacher strip with ratings, workday filters with "Day off" buttons, Best-first sort, full sections hidden, empty state naming the blocker), editor with side panel (grade bars per professor, ghost previews, red outline, Switch), Plan A/B/C save slots, and "Build my own" (same calendar and panel; overlaps allowed but flagged). Merge conflict in `apps/web/next.config.ts` and the lockfile (both review tool and schedule builder added packages) resolved by keeping both. For owner review: mini-calendar blocks in the gallery carry no text (too small); Build-my-own design; Plan A/B/C slots. Overtime mode ON again; tracks builder resumed (Sonnet) in the freed slot.
- **2026-09-26 ~3:20am ET: Advisor tab merged** (`ebea9c7`, CI green). Typed-name disclaimer ("Before you plan", 5 points, version-gated so a wording change re-asks), setup with "Unverified" badges, prior credit (AP/IB/dual enrollment with Counted / No credit / Not counted / Overkill statuses), plan grid (add, move, remove, completed + grade), course sheet (prerequisites, course-wide grade distribution), checks panel and positive notices, audit view with CS gateway. The resumed builder fixed a phone clipping bug in the course sheet. Merge conflicts again in `next.config.ts` and the lockfile, plus duplicate dependency keys the auto-merge left in `apps/web/package.json`; all resolved. For owner review: disclaimer wording (`apps/web/lib/advisor/consent.ts`). Next running: schedule ↔ plan link (`feat/plan-schedule-link`, Sonnet) and tracks.
- **2026-09-26 ~4am ET: pre-professional tracks merged** (`5127426`). `@superterp/tracks`: 11 tracks (pre-med, pre-dental, pre-PA, pre-vet, pre-pharmacy, pre-optometry, pre-podiatry, pre-PT, pre-OT, pre-nursing transfer, pre-law), ~85 requirement categories, ~55 milestones, `checkTrack` (exam timing, AP/IB or pass/fail used for a prerequisite, grades below C, milestone reminders, pre-law GPA protection), `scienceGpa`/`amcasGpa` (BCPM). Review caught the builder dropping real course alternatives (PHYS141/142, BSCI161/171/330, CHEM146/177/247) only because they weren't in the Spring 2027 data; restored with review notes and tests. For owner review: every HPAO category → UMD course mapping (`packages/tracks/tracks/common.ts` `MAPPING_NOTES`), whether to keep pre-podiatry, CHEM146/177/247 course numbers, optometry reusing the med/dental committee milestones. Tracks have no UI yet (Advisor integration queued). Now running: schedule ↔ plan link, Departmental Honors (`feat/dept-honors`, Sonnet). Queue: tracks in the Advisor UI; drafter "sequence with a rule" rows; snapshot cleanup.
- **2026-09-26 morning: builders stopped again at the usage limit (reset 7:20am ET), resumed on the owner's "resume overtime mode".** Schedule ↔ plan link merged (`75c6e17`, CI green on its branch): the plan term matching the builder's term IS the builder's course list (derived, never copied); courses added/removed in the builder update that plan term (created if missing); section changes never touch the plan; courses from the plan are labeled "From your 4-year plan", with "Also planned for Fall 2027" when a course sits in another term too; shared `?c=` links only add to a linked term. Removed the now-unreachable Advisor gateway note. Now running: Departmental Honors, tracks in the Advisor UI (`feat/tracks-ui`, Sonnet).
- **2026-09-26 ~9am ET: Departmental Honors merged** (`76baee5`). The Honors College directory lists 39 programs: 25 drafted by hand in `packages/catalog/special-programs/` (kind "departmental"; GPA, thesis, defense and approvals as manual notes), 14 "none" (9 publish no course list, including Computer Science; 4 department sites unreachable: Criminology, Hearing & Speech, Neuroscience, Sociology — retry later; ECE points to the shared Engineering program). Special programs now total 61 entries. Worktree removal needed the `\\?\` long-path prefix (node_modules paths too long for git on Windows). Now running: tracks UI, drafter "sequence with a rule" (`feat/drafter-seqrule`, Sonnet). Queue: snapshot cleanup; retry the 4 unreachable honors sites.
- **2026-09-26 ~9:30am ET: tracks in the Advisor merged** (`fd0f5a6`). Setup picks tracks ("Unverified" badges; one exam-term picker per exam, shared across tracks; pre-law expected grades per term); track issues grouped by track in Checks; a "Tracks" audit section with requirement status, manual categories, milestones bucketed on the plan's terms, BCPM science GPA and each track's own disclaimer. Tracks never feed degree audits or notices (regression test). Builder fixed GPA protection never firing (plan courses had no credits; now resolved from the catalog). `@superterp/tracks/list` keeps HiGHS out of the main bundle. For owner review: science GPA shown on every track card (including pre-law); the MCAT term picker drives the timing check but doesn't move the milestone timeline. Now running: drafter "sequence with a rule", snapshot cleanup (`feat/snapshot-cleanup`, Sonnet). Queue: retry the 4 unreachable honors sites.
- **2026-09-26 ~9:45am ET: snapshot cleanup merged** (`11b8822`). `pruneSnapshots` keeps dated room/dining snapshots from yesterday through tomorrow (plus their `status/` entries) and never touches undated keys; runs at the end of the daily job and via `npm run snapshots -- prune`; `SnapshotStore` gained `list`/`delete`. Now running: drafter "sequence with a rule", what-if program changes in the Advisor (`feat/what-if`, Sonnet: switch major / add / drop, credits counted vs elective vs unused, graduation-date change, gateway, apply with one-level undo). Queue: retry the 4 unreachable honors sites; grad courses as an undergrad (600–897 rules, BS/MS double counting).
- **2026-09-26 ~10am ET: drafter "sequence with a rule" merged** (`17952e4`). Sequences with one nested rule now draft as a `sets` member with a filter part ("Select N From:" + a course list, or a course pattern such as "AOSC4xx" / "two additional 400-level AOSC"), each with a "check" review note (`sequence-filter`). Math Applied drafts at 91% (was 81%), Secondary Ed 97%, catalog 66.3%. Sequence Twelve's draft matches the hand encoding exactly; Sequence Eleven matches once expanded. Limits: prose or leading-code patterns without a count word default to 1; one nested rule per sequence. Process note: the builder didn't load the TDD skill and landed its main change as one commit (it still wrote failing tests first). Now running: what-if, honors retry (`feat/honors-retry`, Sonnet). Queue: grad courses as an undergrad.

## 15. Working notes for Claude
- Git Bash on this PC rewrites leading-slash arguments into Windows paths: prefix commands with `MSYS_NO_PATHCONV=1` when passing URL paths.
- In bash, `"$W\$1"` escapes the `$`; use forward slashes in Windows paths.
- **Never kill processes by image name** (`taskkill /IM node.exe` kills every Node process on the owner's PC). Kill only by PID, e.g. from `netstat -ano | grep :PORT`.
- Headless Edge `--screenshot` can't go below ~500px wide and fires before streamed content arrives. Use `apps/web/scripts/ui-check.mjs` (true mobile emulation, waits for JS).
- Next 16 ships its docs in `node_modules/next/dist/docs/`. Read them before using new APIs (Cache Components, `use cache`, `cacheLife`, `connection()`).

## 16. Overtime mode (owner, 2026-09-24/25; renamed from "overnight mode" 2026-09-25)
- **Activation:** only when the owner says to turn on overtime mode, at any time of day or night. It ends when the owner sends their next message (usually "progress report") or the project is finished. When it's off, work normally and check in as usual.
- The rules below apply whenever overtime mode is active.
- **Never ask the owner for permission** for anything while overtime mode is active. Nothing may stop work: no approval requests, no clarifying questions, no waiting.
- **Nothing but the owner's next message or the project being finished ends overtime mode.** Keep building continuously. The owner's return message is usually **"progress report"**: answer with a concise report of everything done since the last report, decisions made (with assumptions), and items for the owner to review.
- The owner will turn it on repeatedly (days and nights) until the project is complete.
- **UI changes:** the owner normally approves major UI changes. In overtime mode, build them anyway (on a separate branch/PR when practical, with `npm run ui-check` screenshots) and list them in the progress report for approval after the fact. Never block on approval.
- Unclear choices: pick the most reasonable option, record the assumption in this file, keep going. Brainstorming questions go into the progress report.
- Use superpowers skills (TDD etc.) and mattpocock domain-modeling per CLAUDE.md.
- Commit and push often to feature branches (never main). Keep the status log (section 14) current so nothing is lost if context is summarized.
- **Usage limits (owner, 2026-09-26):** follow the builder budget in section 18. Start each overtime run in a fresh main session that reads this file, rather than continuing a long session. If a limit stops work, record in section 14 which builders were running and what they had pushed, so the next run can resume.

## 17. Owner rulings (2026-09-25 morning)
- **Superpowers TDD applies strictly from now on**, including its rule to delete code written before a failing test and redo it test-first (owner, 2026-09-25). The one exception: code written before the superpowers plugin was installed (e.g. the SOC course parser) is kept; fix it rather than rebuild it.
- Outside that TDD rule, don't rebuild working code unless absolutely necessary; fix it first.
- **CMSC141 counts for CMSC131, and CMSC142 counts for CMSC132** (confirmed by owner).
- **CS gateway rule confirmed:** students who matriculated Fall 2024 or later need B- or better in gateway courses and a 3.0 cumulative GPA to apply to the CS LEP; earlier students need C- and 2.7.
- **Schedule builder: all-combinations browser (owner idea, 2026-09-25).** When a student picks courses for a term, SuperTerp generates every conflict-free combination of sections and lets them scroll through all of them; building a schedule by hand stays available too.
  - Engine notes (Claude): combinations can explode (5 courses × 20 sections = 3.2M), so generate lazily with backtracking that prunes conflicts. Group combinations with identical meeting times, so the student scrolls distinct weekly layouts, with the section choices inside each. Show the total count. Filters and sorting (no 8ams, days off, open seats, professor rating) narrow the list. Scrolling must stay instant.
- **Pre-warmed campus data (owner idea + Claude refinements, 2026-09-25).** No student should ever wait on a cold fetch.
  - A scheduled job (~5am daily) gathers stable data: room catalog, all dining menus, library and gym hours, bus schedule. It writes snapshots to a durable shared store (Supabase or the host's shared data cache, not per-instance memory). Pages read only from snapshots.
  - Fast-changing data is refreshed in the background on top: room availability every ~5 min, menus re-checked every ~30 min. Students always get the latest snapshot instantly (stale-while-revalidate).
  - Scheduler: GitHub Actions cron (free, frequent) calling a protected warm endpoint. Check Vercel cron free-tier limits before relying on it.
  - Dining payload: send only the hall and meal being viewed (currently ~490 KB for all three halls); load others on tap. Pre-warming keeps taps instant.
  - Build this together with deployment (Vercel + Supabase accounts needed from the owner).
- **Math rulings (owner, 2026-09-25):** Traditional is the right default track. **The owner is in the Applied Mathematics track**, so the verification target is Math (Applied) + CS; the Applied track needs encoding. **C- minimum for Math major courses is confirmed.** **CMSC131 may count for both** the programming requirement and supporting Sequence Four.
- **Schedule builder brief (owner-confirmed 2026-09-25):**
  - For a student before registration who wants a schedule they like in minutes. E.g. "CMSC351, STAT400, ENGL394, no 8ams, Fridays off" should lead quickly to a short list of layouts they like.
  - Filters and best-first sort lead; scrolling browses what's left. Seats, PlanetTerp ratings and walking distance appear on sections; reviews come later.
  - Web first; sections for the current registration term.
  - **Only course changes update the 4-year plan; section-number changes never do.**
- **Scale requirement (owner, 2026-09-25): the site must support thousands of simultaneous users.** Heavy work (schedule generation) runs in the student's browser; campus and course data are served as pre-built, CDN-cached snapshots; servers do no per-request scraping.
- **Schedule builder design decisions (owner, 2026-09-25, brainstorming):**
  - Approach A: a vertical gallery of mini week-calendars, one per distinct layout. **No text summary line.**
  - Filters: **days off (any weekday, multi-select)**, No 8ams, Open seats only. **Sort** (Best first, …).
  - **Teacher info: option B**, a compact strip under each mini-calendar listing each course's professor and PlanetTerp rating, color-matched to the course's blocks; blocks show course number only.
  - Found with real data: CMSC351 + STAT400 + ENGL394 has 494 layouts and none with Fridays off, so an empty state for over-filtering is needed.
  - **Editor (tap a layout): option A, popover.** Tapping a class opens a popover of its section choices: "same lecture, other discussion", then "other lecture times", each with professor, rating, time and open seats.
  - **Ghost sections (owner idea):** hovering or focusing a choice shows that section's meetings on the calendar as muted "ghost" blocks. **The current (committed) section does not change appearance at all while previewing** (owner correction 2026-09-25: fading it too was confusing). Clicking commits it, and the ghost turns full color. On touch devices, the first tap previews and a second tap (or a "Switch" button) commits.
  - **Editor approved (owner, 2026-09-25)**, including the red outline marking the class the panel is for.
  - **Section chooser is a side panel, not a popover (owner, 2026-09-25):** clicking a class opens a panel beside the calendar (never covering it) with the same ghost-preview behavior and an ✕ close button. Phones: a half-height bottom sheet, so the week stays visible above it.
- **Parallel building during design (owner, 2026-09-25):** whenever the owner and Claude are working on design, Claude also builds other, independent parts of the project in the background (subagents in isolated worktrees, per superpowers dispatching-parallel-agents / subagent-driven-development), then reviews and merges their work. The limits in section 18 apply (at most 2 builders at once).
  - **Gallery grid scale (owner, 2026-09-25):** all mini-calendars share ONE time scale (earliest to latest class across the results, e.g. 8am–9pm); the owner judged the shrinkage acceptable (no evening tag, no per-grid zoom). **Hour labels every 1 hour.** **Hovering a mini-calendar pops up a larger version** for inspection (touch: press and hold).
- **Merged 2026-09-25 (parallel builders):** Math Applied Track (`programs/math-major-applied-2026-27.ts`, 15 review notes; the double-major test is now Applied + CS), `@superterp/ratings` (PlanetTerp: professor, course, grades; not-found returns HTTP 400), "Instructor: TBA" fix, `checkCsGateway` (B-/3.0 for Fall 2024+ entry, C-/2.7 before). Tests: 202 passing.
- **Open questions for owner (raised by builders):**
  1. Gateway course completed **without a letter grade** (AP/transfer credit): currently "below-minimum", so ineligible. **Assumed (overtime, 2026-09-25): counts as met**; owner to confirm.
  2. A **W** on a gateway with no other attempt: currently below-minimum. **Assumed (overtime, 2026-09-25): treated as "missing" (not yet taken)**; owner to confirm.
  3. ~~Math Applied **Sequence Twelve** can't be expressed~~ Resolved (feat/engine-shapes): the engine now has set members that are a filter with a count, and Sequence Twelve is encoded as AOSC200, AOSC201 and any two 400–499 AOSC courses. The same branch added "or" alternatives on choose and a count on sets; the catalog drafter now converts 66.1% of rule rows (was 64.5%) and has no engine gaps left.
  4. Traditional track's Sequence Four doesn't yet accept CMSC141/142 (Applied does). **Assumed (overtime, 2026-09-25): yes, make them consistent** (the owner ruled CMSC141/142 substitute for CMSC131/132 generally); owner to confirm.
  - **Gallery v3 (owner, 2026-09-25):** larger spacing between cards so previews don't open by accident, plus a short hover delay (~300 ms) before the enlarged preview. **Filters are workday-focused:** each weekday is either **Off** or has a **desired workday window** (e.g. Mon 8am–1pm), replacing "No 8ams" and merging "days off". A "same hours every day" shortcut sets all days at once. A layout matches only if every class on a day falls inside that day's window.
  - **Day-off control (owner, 2026-09-25, revised):** a compact toggle button always labeled "Day off" (no physical switch; too bulky). Unselected = light outlined pill; selected = filled red with a small ✓. The label never changes; only its appearance does.
  - **Full sections and "Best first" (owner, 2026-09-25):** the gallery never shows layouts that use an already-full section (full sections are excluded by default, not an optional filter). **"Best first"** ranks by (1) highest PlanetTerp professor rating, (2) fewer gaps between classes, (3) more condensed and toward the middle of the day (no fixed "best" hours; that depends on the student, who can set per-day workday windows). Open seats are not part of the ranking.
- **Grade distributions (owner idea, 2026-09-25):** students see a class's grade distribution (from PlanetTerp) while building their schedule and their 4-year plan. Split approved by owner (2026-09-25); visual design still to be mocked up with "Build my own": per-professor distribution for that course in the schedule builder's section panel (A–F/W bars, average GPA, student count); course-wide distribution in the 4-year plan's course detail. Data comes from pre-built snapshots refreshed each term (`@superterp/ratings` already fetches and summarizes grades), never live PlanetTerp calls per page view.
- **No overshoot flag (owner ruling, 2026-09-25):** the 4-year plan checker does not flag total credits beyond the degree minimum (120, or 150 for a double degree). It still checks prerequisite/corequisite timing, repeated courses and per-term credit load.
  - **Instead, a positive notice (owner, 2026-09-25):** when the plan makes the student a double major or dual degree, or eligible for one, say so (info, never a warning). Double major = the plan completes a second major (declared or not). Dual degree = both degrees complete, ≥150 credits, ≥18 credits in each degree not used for the other; otherwise say what's missing. Also "you're N courses from a Y major" when within 2 courses (Claude's threshold; owner may change). Declared-eligible messages mention the declare-a-year-before-graduation rule.
- **Repeated courses (owner ruling, 2026-09-25):** a course may appear twice in a plan only when the student failed the earlier attempt; any other repeat is an error (not a "check with the department" item). Claude's assumptions (overtime): courses the catalog marks repeatable stay allowed up to their credit limit; a W does not count as failed (owner may relax this).
- **Credit caps per term:** the plan checker's defaults (Fall 20, Spring 20, Winter 4, Summer 16) are unconfirmed placeholders; owner to confirm UMD's real limits.
  - **Borders and spacing (owner, 2026-09-25):** cards and popups must stay distinguishable under dark-mode extensions (e.g. Dark Reader), which flatten shadows. Every card gets a real thin border (not just a shadow). The enlarged preview gets a stronger, distinct border (a thin accent-tinted ring) plus a deeper shadow. Spacing between gallery cards increased again. Test with an inverted or dark rendering, not just light mode.
  - **Block styling (owner, 2026-09-25):** discussion/lab meetings look exactly like the rest of their course (same fill, solid edges). **The dashed/faded look is reserved for ghost previews only.** Labels in small blocks must never be clipped: vertically centered, tight line height, and hidden (not cut) when a block is too short.
- **CI live (2026-09-25):** GitHub Actions runs `npm ci`, test, typecheck, lint and build on every push (first run on `feat/ci` passed in ~1 min). The owner granted the gh `workflow` scope. The web `typecheck` script runs `next typegen` first.
- **Theme choice (owner, 2026-09-25, approved):** only **Light and Dark** (no "System" option). First visit starts in the device's mode (Claude's assumption); afterwards the saved choice sticks. Desktop: bottom of the sidebar. Phones: in the top-right menu (future Profile). Saved per device and applied before first paint (no flash). All screens already use shared tokens. More themes (high contrast, OLED black) possible later.
- **AP / IB / dual-enrollment credit (owner requirement, 2026-09-25):** students enter it while building their 4-year plan (exam + score, or a college course taken in high school). It maps to the UMD courses and Gen Ed credit it earns, using UMD's official equivalency tables (AP and IB tables; dual enrollment via UMD Transfer Credit Services), and counts in the audit as completed credit without a letter grade. It ties into the open gateway question (does AP credit meet a gateway minimum?).
  - **Overlapping credit (owner ruling, 2026-09-25):** no source "wins". If a student has credit for a course, they have it, whether from AP, IB, dual enrollment or a combination. It counts once; extra credit for the same course is overkill and is shown as such. Only one of Calculus AB / BC / BC's AB subscore counts (UMD's chart).

## 18. How work is split (owner rule, 2026-09-25; efficiency rules 2026-09-26)
- **Every implementation task goes to a subagent**, each in its own git worktree and branch, test-first, pushing to its branch.
- **The main session only talks with the owner, reviews, and merges.** Review = read the diff, check screenshots for UI work, then merge into the working branch and push. The main session does not write feature code itself unless the owner says so for a specific task (e.g. the credit-package fixes, 2026-09-25).
- **Trimmed verification (owner rule, 2026-09-25):** one local test run (tests, typecheck, lint, build) plus CI on GitHub. Don't re-run the suite after merging; CI on the merged branch covers it.
- **Builder budget (owner, 2026-09-26; after builders died at the 5-hour usage limit).** All agents share one account limit, and running more of them at once only reaches it sooner. These rules override the superpowers subagent-driven-development / dispatching-parallel-agents defaults and CLAUDE.md where they conflict:
  - **Builders run on Sonnet** (`model: sonnet` when dispatching). The main session stays on Opus for review and merging. Use Opus for a builder only when a task needs hard reasoning (e.g. new audit-engine semantics), and note why in section 14.
  - **One agent per task.** No per-task spec-reviewer or code-reviewer subagents: the main session's diff review plus CI is the review. `requesting-code-review` means the main session reviews the diff, not a new agent.
  - **At most 2 builders at the same time.** Queue the rest; dispatch the next when one finishes. Prefer critical-path work (owner-facing UI, audit engine) first.
  - **Short briefs, not the whole memory.** Each builder gets a 20–40 line brief: goal, files/packages involved, the owner rulings that apply (quoted), done criteria (tests, typecheck, lint, build, `ui-check` screenshots for UI), and its branch name. Tell it not to read PROJECT_MEMORY.md or `docs/project/` unless the brief points to a specific section.
  - **Resume, don't restart.** Before dispatching, run `git worktree list`; if a worktree or branch for the task already exists, the builder continues from it.
  - **Push early.** Builders commit and push after the first passing test and at each green step, so a stopped builder leaves recoverable work on GitHub.
