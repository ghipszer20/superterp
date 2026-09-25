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
1. **Degree audit and 4-year planner.**
   - Layered rules: University → Gen Ed → College → Major → Specialization → Minor, second major and special programs.
   - Matching-based assignment that respects double-count rules. Flags missing requirements (with courses that satisfy them), prerequisite and ordering errors, overshoot, and credit caps.
   - Manual ☐ items for things it can't check (thesis, auditions).
   - Catalog-year versioning. Handles AP/transfer credit and the CS limited-enrollment gateway.
   - **Program changes (owner requirement):** switching majors, grad courses as an undergrad, double majors, double degrees, adding and dropping majors and minors.
     - **Data model:** a Student holds Degrees, and each Degree holds Programs (major, minor, certificate, LLP, and so on). Each Program has its own catalog year and a status (declared / planned / what-if / dropped). Gen Ed and university rules apply once; college rules apply per degree.
     - **Double major:** 1 degree, 2 majors, 120-credit minimum. Courses may count toward both majors unless a program's rules limit sharing.
     - **Double degree:** 2 degrees, **150-credit minimum**, and **at least 18 credits in each degree not used for the other**. Satisfies both degrees' requirements in full, including college rules.
     - **Declaration deadline:** a double major or double degree must be declared at least 1 full academic year before graduation. The app warns ahead of it.
     - **Sharing limits** between programs are part of the rule format (e.g. `max_shared_with`). The matching step (ILP) enforces them across every program at once.
     - **Switching majors:** always run it as a what-if first. Show how existing credits apply to the new major (count / become electives / unused), the change in graduation date, the catalog year for the new major, and the internal-transfer requirements (gateway courses and GPA) for limited-enrollment majors. Then commit, with undo.
     - **Adding or dropping a program:** re-run matching. Show freed credits ("drop the minor → graduate a semester early?") and courses that now count toward nothing.
     - **Grad courses as an undergrad:**
       - 600–897 (not 799) are allowed, subject to the offering department's rules.
       - Each grad course is tagged by how its credit counts: undergrad credit / graduate-only (max 9 credits, a petition can add up to 3) / double-counted in a combined BS/MS.
       - A combined BS/MS double-counts up to 35% of the master's credits, only 600+ courses with a grade of B- or better.
       - Grad courses get a badge on the plan grid. Permission-only prerequisites become manual ☐ items.
     - The owner's hand-built test students must include: a major switch in sophomore year, a double major, a double degree, a BS/MS student, and a dropped minor.
   - **Pre-professional tracks (owner requirement):** pre-med (MD/DO), pre-dental, pre-PA, pre-vet, pre-pharmacy, pre-optometry, pre-PT, pre-OT, pre-nursing, pre-law, and others. They're a separate layer type called a "track": prerequisites for applying to a professional school, **not** degree requirements. Tracks can be added to any major, and what-if audits cover them.
     - **Course categories map to UMD courses.** HPAO's medicine list: 8 cr general chem + lab, 8 cr organic chem + lab, biochem, 8–12 cr bio + lab, calculus, statistics, 8 cr physics + lab, 6 cr English. HPAO publishes categories, not UMD codes, so the owner builds the category → UMD course mapping from 4yearplans.umd.edu pre-health plans and HPAO pages, then verifies it.
     - **Optional target-school layer:** add specific schools with their own extra requirements (e.g. a PA school that needs anatomy and physiology; pharmacy from AACP's school table). A later addition; the generic HPAO list comes first.
     - **Transfer tracks** (pre-nursing = 2 years at UMD, then apply to a BSN program elsewhere) get requirements from the UMD catalog's Pre-Health Professions page.
     - **Pre-law:** there are no required courses. The track shows milestones (LSAT timing, application cycle), suggested skill-building courses, and **GPA protection**: it warns when a planned semester's predicted grades could hurt GPA.
     - **Things that aren't courses** become milestone ☐ items on the plan timeline: MCAT/DAT/OAT/GRE/LSAT, clinical, shadowing, research and volunteer hours, and the HPAO committee letter and application cycle. Use HPAO's timeline and dates, verified by the owner.
     - **Timing:** the optimizer gets a deadline rule, e.g. finish MCAT content courses before the planned MCAT term. Gap-year plans are supported.
     - **GPA:** compute overall and **science GPA (BCPM: biology, chemistry, physics, math, AMCAS-style)** from the transcript.
     - **Warnings:** AP credit or pass/fail used for a professional-school prerequisite (many schools won't accept these), and grades below the usual C minimum.
     - Disclaimer: "Confirm with HPAO and each target school."
2. **Prerequisite graph.**
   - Prose from Testudo parsed into AND/OR trees, with corequisites kept separate.
   - A hand-edited overrides file.
   - Which terms each course is offered.
3. **Schedule builder (Coursicle-style).**
   - Week grid, section switching, conflict and gap detection, walking time between buildings.
   - Auto-generator with filters (no 8am classes, days off), ranked by professor rating, GPA or open seats.
   - Plan A/B/C, .ics export, sharing.
   - **Two-way sync with the 4-year plan (owner requirement).** There is one plan model. The builder for a term is a view of that term in the 4-year plan, plus the chosen sections, so there are no copies to keep in sync.
     - **Plan → builder:** a term's planned courses pre-load in the builder with their sections.
     - **Builder → plan:** adding, removing or swapping a course edits that term in the plan immediately.
     - Only the **active** schedule (A/B/C) writes to the plan. The alternatives are sandboxes, and switching the active one applies the difference.
     - Every change re-runs the audit and the prerequisite check for later terms. If something breaks (e.g. dropping CMSC351 breaks 3 later courses), show one-tap fixes from the optimizer (move to summer, shift later courses). Show a change summary ("Plan updated · audit still ✅") and allow undo.
     - Each course in the builder shows what it counts toward (e.g. "DSHU") and what happens to the audit if it's swapped. If a planned course has no sections this term, or they're all full, suggest alternatives that satisfy the same requirement.
     - Past terms are locked (from the transcript). The current term is marked "registered" by the student, since there's no Testudo login. Section-level building works only for terms whose Schedule of Classes is published; later terms are course-level only.
4. **Advising.**
   - 4-year level: what-if audits (minor, major switch, graduate early, abroad), timeline warnings, optimizer.
   - Semester level: which courses to take, which sections, a registration-day priority plan, workload check.
   - Rule: **the rules engine is the source of truth, and the LLM only explains** (via tool use).
5. **Grades and personalization.**
   - Import from the unofficial transcript PDF, pasted Testudo text, or manual entry, with a confirmation screen.
   - Imported grades auto-fill the audit and are checked against minimum-grade and GPA rules.
   - Strength profile = grade relative to the course's PlanetTerp average, grouped by skill area. Grade predictions are shown as ranges. Difficulty scores are personalized.
   - LLM feedback: encouraging tone and honest about how little data it's based on.
   - Privacy: stored on the device by default, explicit consent before anything goes to the LLM, no name or UID sent, one-tap delete.
6. **Difficulty and professors.**
   - Course score from PlanetTerp average GPA, W/F rate and review sentiment. Semester score from total difficulty and credit load.
   - LLM professor summaries cached each term and linked to the current Schedule of Classes.
7. **Reviews (student-written).**
   - Sign-in limited to umd.edu/terpmail addresses; reviews displayed anonymously.
   - One review per course, professor and term for each account.
   - LLM pre-screen, report, block and contact options, as Apple Guideline 1.2 requires.
   - Terms of service covering defamation.
8. **Campus tab.**
   - Dining menus, library hours, RecWell hours and fitness classes.
   - A study-room availability grid covering every library and room type.
9. **Buses (Shuttle-UM, Transit-app style).**
   - Opens to nearby stops, with large countdowns and a clear "live" vs "scheduled" label.
   - Favorite routes, service alerts, and route colors and shapes drawn on the map.
   - Event routes (football, Maryland Day, Commencement) appear only on the days they run.
   - **Class-aware "leave by" times:** "Leave by 9:42 to make CMSC351 in IRB."
   - iOS Live Activity and Dynamic Island countdown for the next bus, plus a widget. Link out to Transit for extras.
10. **Seat and waitlist (spike).**
   - Monitor tracked sections during one registration window.
   - Ship waitlist check-in reminders regardless of the spike's outcome.

## 4. Verified data sources (checked 2026-09-24)
| Data | Source | Notes |
|---|---|---|
| Courses/sections/seats | Testudo Schedule of Classes (app.testudo.umd.edu/soc) | Primary source; umd.io (student-run) is the fallback only |
| Requirements | academiccatalog.umd.edu, 2026–27 catalog | Structured HTML course lists, "select N" groups, footnotes, Graduation Plans tab |
| Sample plans | 4yearplans.umd.edu | Used as golden tests: each official plan must pass |
| Grades/profs/reviews | PlanetTerp API, api.planetterp.com/v1 | No auth; endpoints: courses, professors, grades, search. Credit them, and ask before heavy use |
| Reddit | Reddit Data API | Free only for non-commercial use, needs manual approval (2–4 weeks); optional or dropped |
| Dining | nutrition.umd.edu `longmenu.aspx` | Hall/date/meal/station; items link to `label.aspx?RecNumAndPort=…`. No update feed, so poll every ~30 min and push only when a content hash changes |
| Dining (confirmed 2026-09-24) | `GET https://nutrition.umd.edu/?locationNum={16 South Campus, 19 Yahentamitsi, 51 251 North}&dtdate={M/D/YYYY}` | Meals are tab panes `#pane-1/2/3` (Breakfast/Lunch/Dinner; titles from `.nav-link`). Stations are `.card` with `h3.card-title`. Items are `.menu-item-row` → `a.menu-item-name` (href `label.aspx?RecNumAndPort=…`) plus `img.nutri-icon` alt text (e.g. "Contains pork"). The date dropdown is filled by JS, so generate dates yourself |
| Room availability (confirmed 2026-09-24) | `POST https://umd.libcal.com/spaces/availability/grid`, form `lid, gid, eid=-1, seat=0, seatId=0, zone=0, start=YYYY-MM-DD, end=YYYY-MM-DD, pageIndex=0, pageSize=18`, header `Referer` = the category page | Returns `{slots:[{start,end,itemId,checksum,className?}]}`. A `className` of `s-lc-eq-checkout` means booked; no className means open. Room metadata is embedded in the category page HTML (e.g. `/reserve/mckeldin/carrels-4hr`) as JS objects: `title` ("7209 (Capacity 2)"), `url` `/space/{eid}` (the booking deep link), `eid`, `gid`, `lid`, `grouping`, `capacity`. Undocumented endpoint: read-only, cache it, keep request rates low |
| Library hours | umd.libcal.com/hours (LibCal) | 10 locations, weeks of hours ahead |
| Study rooms | umd.libcal.com/reserve | Booking needs a UMD email, not a password. Location ids: McKeldin 2552, Art 14005, Performing Arts 14006, STEM 6745. McKeldin categories: TLC Group Study 23065, Carrels 23067, Family Room 23082, Faculty Office 23071, Podcasting Lab 30085, Conversation Room 40070 |
| RecWell hours | Public Google Sheet `1y3-5AE7FBNL0JFi4LW459WaBQzYVOdWMvtOVr0DZCmM` | CSV via `/export?format=csv&gid=…`. Indoor gids: 1320933735, 1321604209, 354755843, 83449240, 1348172338, 883167948, 628324683, 180872438. Outdoor gids: 1601669223, 1656075107, 849246933, 836576797. One row per facility or area, one column per date for the whole year. Needs a layout check that alerts the owner when it breaks |
| Group fitness | Semester PDF on recwell.umd.edu | Extract once per semester, then owner review |
| Gym occupancy | Not found publicly | Don't plan on it |
| Bus schedules (static) | Shuttle-UM GTFS `https://feed.actionfigure.ai/university-of-maryland-shuttle-um.zip` (Transitland `f-shuttleum~md~us`) | Downloaded 2026-09-24: 37 routes (including event routes), 361 stops, ~3,050 trips, with shapes. Valid 2026-05-19 to 2026-12-24, so re-fetch every day and alert if the feed nears expiry. Transitland/Interline license |
| Bus real-time | Not public. DOTS uses Swiftly, which powers the official Transit app | Ask DOTS for a Swiftly GTFS-RT key (non-commercial student app). Until then, show scheduled times plus a link out to Transit |
| Metro/regional | WMATA developer API (free key); Metrobus/TheBus GTFS | Optional: College Park Metro connections |
| Waitlist rules | registrar.umd.edu waitlist-hold-file | Opened seats go to the waitlist automatically; daily check-in is mandatory or you lose your spot |

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

## 7. Tech stack (current recommendation)
- TypeScript monorepo with a shared rules-engine package.
- **Expo** (react-native-web) for iOS and web, using native iOS parts: native tabs, SF Symbols, sheets, haptics, the glass look.
- Alternative: SwiftUI + Next.js, decided after the design-phase prototype.
- Supabase (Postgres + Auth, umd.edu email magic links) and Python scrapers on a schedule.
- Claude for LLM features. OR-Tools CP-SAT for the optimizer.

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
- **Parallel building during design (owner, 2026-09-25):** whenever the owner and Claude are working on design, Claude also builds other, independent parts of the project in the background (subagents in isolated worktrees, per superpowers dispatching-parallel-agents / subagent-driven-development), then reviews and merges their work.
  - **Gallery grid scale (owner, 2026-09-25):** all mini-calendars share ONE time scale (earliest to latest class across the results, e.g. 8am–9pm); the owner judged the shrinkage acceptable (no evening tag, no per-grid zoom). **Hour labels every 1 hour.** **Hovering a mini-calendar pops up a larger version** for inspection (touch: press and hold).
