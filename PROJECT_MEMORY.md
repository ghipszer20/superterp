# SuperTerp — Project Memory

> Single source of truth for project context. Update this file whenever a decision changes.
> Last updated: 2026-09-26 (slimmed: history, feature rulings, legal and roadmap moved to `docs/project/`).
> Read by the main session at the start of every session (builders don't read it; CLAUDE.md), so keep it under ~20 KB (section 18).

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
- **Name:** "SuperTerp" is decided (owner, 2026-09-24). It's free, open-source and a student project, the same pattern as PlanetTerp and Jupiterp, so trademark risk is low. Backup: "Scute". **The project will never make money** (owner, 2026-09-24): no ads and no paid tier (donations allowed, only to cover running costs: owner 2026-09-26), so the Trademarks email is optional. This also keeps Reddit, PlanetTerp and Libraries/DOTS data requests in the non-commercial category. superterp.com is registered but dead (a 404 on old GitHub Pages servers). superterp.app and getsuperterp.com didn't resolve, so they're likely available.
- **Every major must work**, not only CS. Every minor, specialization and special program with course requirements must also be included: Honors College LLPs, Gemstone, College Park Scholars, CIVICUS, other LLPs, citations, certificates, notations, departmental honors, combined BS/MS, ROTC, and **every pre-professional track with its requirements** (pre-med, pre-law, pre-dental, pre-PA, pre-vet, pre-pharmacy, pre-nursing, and others; see module 1).
- **No student-correction button or review queue.** Requirement data is verified before launch by comparing each program with its department's requirements page (owner, 2026-09-26: the owner decides only flagged items; the review tool was dropped). No 🧪 labels in production. After launch, a support email is fine.
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
5. Compare with the department's requirements page (department page wins); the owner decides only flagged items.
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

## 9. Phases and time estimate
Moved to `docs/project/roadmap.md` (phases 0–6, MVP recommendation, hour and calendar estimates, launch schedule: Jan 2027 Campus tab beta → Mar–Apr 2027 schedule builder → Summer 2027 audit + verification → Nov 2027 first verified colleges → Spring 2028 everything + iOS).

## 10. Open to-dos and questions
- [ ] Optional: a courtesy heads-up email to UMD Trademarks & Licensing (not a blocker). Required only if the project starts making money.
- [x] No lawyer review (owner decision, 2026-09-24): a disclaimer is enough. Claude drafts plain-language disclaimer, terms and privacy text.
- [ ] Email UMD Libraries requesting LibCal API credentials.
- [ ] Email UMD DOTS requesting Shuttle-UM real-time data access (a Swiftly GTFS-RT key).
- [ ] Claim a domain (superterp.app or getsuperterp.com), the App Store name and social handles.
- [ ] Decide whether to reuse or partner with Jupiterp (open source; check license).
- [ ] Confirm Expo's native-component support. (Credit caps: owner ruled they vary by college and term; `feat/credit-caps` queued.)
- [ ] Decide: launch everything at once, or in waves by college.
- [x] ~~Expo vs SwiftUI~~: decided website-first with Next.js (section 13); iOS later.
- [x] Monetization: never (section 2). Team: solo owner + Claude.
- [x] Repo created: github.com/ghipszer20/superterp (private, Apache-2.0), local at C:\Users\24GHi\Code\SuperTerp. Git uses HTTPS with the gh credential helper (SSH host key isn't set up in this shell).
- [ ] Before making the repo public: scrub personal details from PROJECT_MEMORY.md (owner's program plans, personal notes) and review git history.

## 11. Legal and trust notes
Moved to `docs/project/legal.md`. Read it before building the disclaimer, accounts, exports or scrapers. The essentials: the 4-year plan / audit needs a typed-name clickwrap agreement first (so the planner needs a umd.edu account); every audit result cites its catalog rule and year; no UMD marks and "Not affiliated with the University of Maryland" everywhere; never ask for or store Testudo credentials; scrape politely.

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

## 14. Current state (replace, don't append; full history in `docs/project/status-log.md`)
Update this section in place when work merges or plans change. Put the dated narrative (what merged, conflicts, process notes) in `docs/project/status-log.md`.
- **Branches:** PR #1 `feat/campus-foundation` (draft); PR #2 `feat/course-data` (draft, stacked on #1) is the working branch everything merges into. CI green as of 2026-09-26 evening.
- **Built (all unverified by the owner unless noted):**
  - Campus tab: dining, libraries (all 6 on Today), study rooms (4 bookable libraries, exact-room Book links), RecWell gyms (Eppley sub-sections: Aquatics, Climbing, Pickleball; SPH gym on Today), Shuttle-UM buses and a Transport tab with a campus stop/route map (MapLibre + OpenFreeMap; old /campus/transit and /campus/buses redirect); daily snapshots with pruning.
  - Schedule tab: builder (gallery, workday filters, side-panel editor with ghosts and grade bars, Plan A/B/C, Build my own), linked to the 4-year plan by course with an "Update your plan?" confirmation.
  - Advisor tab: typed-name disclaimer, College picker with per-college credit caps (`docs/project/credit-caps.md`), What-if (switch/add/drop a major: existing credits count/elective/unused, catalog year, graduation date, CS gateway rule and GPA, Apply with Undo), setup, AP/IB/dual-enrollment credit, plan grid, checks and notices, audit with CS gateway, course sheet with grades, 14 pre-professional tracks (`@superterp/tracks`).
  - Data and engine: SOC parser, prerequisites, catalog parser + drafter (66.3% of rule rows), HiGHS audit, CS / Math Traditional / Math Applied / Gen Ed encoded, 61 special programs (LLPs, Scholars, Honors, 25 Departmental Honors), grade summaries. (Owner review tool being removed.)
- **In progress (2 Sonnet builders):** Math fixes from the department page (`feat/math-dept-page`, `../SuperTerp-wt-math-dept`). Rulings-3 (`feat/rulings-3`, `../SuperTerp-wt-rulings-3`: remove the review tool, gateway W = attempt not failure, no-grade credit counts, pre-professional disclaimer line + consent version bump, credit-load message wording).
- **Queue:** About page (`feat/about`: app info, report issues by email/GitHub, creator info, GitHub link, small donations spot for running costs, contact email; placeholders for owner-supplied text/links); campus polish (`feat/campus-polish`: dining boxes aligned, study rooms "1 person", no "(behind Eppley)", no "(Informal Rec)" anywhere); Transport map v2 (`feat/transport-map-2`: campus-only bounds, off-campus edge markers, no tilt/rotate); department-page comparison for every program (find each department's requirements page, diff against the encoding, fix per "department page wins", flag contradictions); older AP/IB charts (`feat/credit-older-charts`: UMD's charts for exams before May 2023, chosen by exam year; the current tables cover May 2023–May 2026 only; owner's May 2024 AP PDF checked 2026-09-26, same equivalencies as the 2023–2026 chart minus Cybersecurity and Networking); honors retry for 4 unreachable department sites (Criminology's page is https://ccjs.umd.edu/undergraduate/undergraduate-honors-program, reachable 2026-09-26; Neuroscience's is https://neur.umd.edu/landingtopic/honors; Hearing & Speech's is https://hesp.umd.edu/undergraduate/honors-hearing-and-speech-sciences-undergraduate-students; Sociology: owner couldn't find one, builder searches socy.umd.edu and the Honors College directory and records "none found" if it has none) (`feat/honors-retry`, worktree exists); grad courses as an undergrad (600–897 rules, BS/MS double counting).
- **Waiting on the owner:** see `docs/project/owner-review.md` (include it in every progress report; add new items there).
- **Known to-dos:** email a copy of each signed Advisor agreement to the owner's records address (with deployment; address from the owner as an env var); the GTFS feed ends 2026-12-24 (warn in the UI and in a scheduled check first); check the GTFS license before public launch; show last good data when a source is down (needs a database); deployment (Vercel + Supabase accounts from the owner) with pre-warmed data.

## 15. Working notes for Claude
- Git Bash on this PC rewrites leading-slash arguments into Windows paths: prefix commands with `MSYS_NO_PATHCONV=1` when passing URL paths.
- In bash, `"$W\$1"` escapes the `$`; use forward slashes in Windows paths.
- **Never kill processes by image name** (`taskkill /IM node.exe` kills every Node process on the owner's PC). Kill only by PID, e.g. from `netstat -ano | grep :PORT`.
- Headless Edge `--screenshot` can't go below ~500px wide and fires before streamed content arrives. Use `apps/web/scripts/ui-check.mjs` (true mobile emulation, waits for JS).
- Next 16 ships its docs in `node_modules/next/dist/docs/`. Read them before using new APIs (Cache Components, `use cache`, `cacheLife`, `connection()`).
- Removing a worktree can fail on long `node_modules` paths: use the `\\?\` long-path prefix.

## 16. Overtime mode (owner, 2026-09-24/25; renamed from "overnight mode" 2026-09-25)
- **Activation:** only when the owner says to turn on overtime mode, at any time of day or night. It ends when the owner sends their next message (usually "progress report") or the project is finished. When it's off, work normally and check in as usual.
- The rules below apply whenever overtime mode is active.
- **Never ask the owner for permission** for anything while overtime mode is active. Nothing may stop work: no approval requests, no clarifying questions, no waiting.
- **Nothing but the owner's next message or the project being finished ends overtime mode.** Keep building continuously. The owner's return message is usually **"progress report"**: answer with a concise report of everything done since the last report, decisions made (with assumptions), and items for the owner to review.
- The owner will turn it on repeatedly (days and nights) until the project is complete.
- **UI changes:** the owner normally approves major UI changes. In overtime mode, build them anyway (on a separate branch/PR when practical, with `npm run ui-check` screenshots) and list them in the progress report for approval after the fact. Never block on approval.
- Unclear choices: pick the most reasonable option, record the assumption in this file, keep going. Brainstorming questions go into the progress report.
- Use superpowers skills (TDD etc.) and mattpocock domain-modeling per CLAUDE.md.
- Commit and push often to feature branches (never main). Keep section 14 (current state) and `docs/project/status-log.md` current so nothing is lost if context is summarized.
- **Usage limits (owner, 2026-09-26):** follow the builder budget in section 18. Start each overtime run in a fresh main session that reads this file, rather than continuing a long session. If a limit stops work, record in section 14 and the status log which builders were running and what they had pushed, so the next run can resume.

## 17. Owner rulings (cross-cutting only; full text in `docs/project/rulings.md`)
Feature-specific rulings (schedule builder design, plan checker, tracks, campus pages, theme, AP/IB credit, pre-warmed data, grade distributions) live only in `docs/project/rulings.md`. Read the relevant part before designing or reviewing that feature, and quote it in builder briefs. New feature rulings go there; only rulings that apply to all work go here.
Code comments that cite "PROJECT_MEMORY section 17" (e.g. "open question 1") refer to the same text, now in `docs/project/rulings.md`.
- **Superpowers TDD applies strictly** (owner, 2026-09-25), including deleting code written before a failing test and redoing it test-first. Exception: code written before the superpowers plugin was installed (e.g. the SOC course parser) is kept and fixed. Outside that rule, don't rebuild working code unless absolutely necessary; fix it first.
- **Scale:** the site must support thousands of simultaneous users. Heavy work (schedule generation) runs in the browser; campus and course data are pre-built, CDN-cached snapshots; servers do no per-request scraping.
- **Degree rules confirmed by the owner:** CMSC141 counts for CMSC131 and CMSC142 for CMSC132. CS gateway: Fall 2024+ entrants need B- in gateway courses and a 3.0 GPA, earlier entrants C- and 2.7. The owner is in Math **Applied** (verification target: Math Applied + CS; Traditional is the default track); C- minimum for Math major courses; CMSC131 may count for both the programming requirement and Sequence Four. A course may be retaken only after an F or a W.
- **CI:** GitHub Actions runs `npm ci`, test, typecheck, lint and build on every push; the web `typecheck` script runs `next typegen` first.

## 18. How work is split (owner rule, 2026-09-25; efficiency rules 2026-09-26)
- **Every implementation task goes to a subagent**, each in its own git worktree and branch, test-first, pushing to its branch.
- **The main session only talks with the owner, reviews, and merges.** Review = read the diff, check screenshots for UI work, then merge into the working branch and push. The main session does not write feature code itself unless the owner says so for a specific task (e.g. the credit-package fixes, 2026-09-25).
- **Trimmed verification (owner rule, 2026-09-25):** one local test run (tests, typecheck, lint, build) plus CI on GitHub. Don't re-run the suite after merging; CI on the merged branch covers it.
- **Builder budget (owner, 2026-09-26; after builders died at the 5-hour usage limit).** All agents share one account limit, and running more of them at once only reaches it sooner. These rules override the superpowers subagent-driven-development / dispatching-parallel-agents defaults and CLAUDE.md where they conflict:
  - **Builders run on Sonnet** (`model: sonnet` when dispatching). The main session stays on Opus for review and merging. Use Opus for a builder only when a task needs hard reasoning (e.g. new audit-engine semantics), and note why in the status log.
  - **One agent per task.** No per-task spec-reviewer or code-reviewer subagents: the main session's diff review plus CI is the review. `requesting-code-review` means the main session reviews the diff, not a new agent.
  - **At most 2 builders at the same time.** Queue the rest; dispatch the next when one finishes. Prefer critical-path work (owner-facing UI, audit engine) first.
  - **Short briefs.** Each builder gets a 20–40 line brief: goal, files/packages involved, the owner rulings that apply (quoted from `docs/project/rulings.md`), done criteria (tests, typecheck, lint, build, `ui-check` screenshots for UI), and its branch name. Builders build only from the brief: CLAUDE.md tells them not to read this file (owner, 2026-09-26), so anything they need from it must be in the brief. They read other `docs/project/` files only when the brief points to them. The main session checks every builder's work against this file and `docs/project/rulings.md` before merging.
  - **Screenshots are expensive** (images cost far more than text). Builders capture only the pages they changed, at phone and desktop width; the main session reviews those, not the whole app.
  - **Resume, don't restart.** Before dispatching, run `git worktree list`; if a worktree or branch for the task already exists, the builder continues from it.
  - **Push early.** Builders commit and push after the first passing test and at each green step, so a stopped builder leaves recoverable work on GitHub.
- **Keep this file small (owner, 2026-09-26; after it reached 52 KB).** The main session reads this file at the start and carries it in every request for the rest of the session (builders no longer load it). Keep it under ~20 KB: section 14 is replaced in place, never appended to; dated history goes to `docs/project/status-log.md`; feature rulings go to `docs/project/rulings.md`; detail goes to `docs/project/`. If it grows past ~20 KB, move content out before continuing.
