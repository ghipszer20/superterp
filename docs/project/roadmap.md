# Roadmap: phases and time estimate

Moved out of PROJECT_MEMORY.md (sections 9 and 12) on 2026-09-26 so it loads only when needed. Update it here when a decision changes.

## Phases
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

## Time estimate (2026-09-24; assumes solo + AI coding help)
- Total ≈ 1,500–2,300 hrs: data 175–270, design 60–120, schedule builder + Campus tab + basics 220–330, audit engine + planner 420–660, **owner verification 250–350 (critical path, can't be delegated)**, advising 80–120, reviews + LLM 120–180, optimizer 80–120, iOS polish 100–150.
- Calendar time: 15 hrs/wk ≈ 2–3 yrs; 25 hrs/wk ≈ 1.2–1.8 yrs; full-time summers + ~15/wk ≈ 18–24 months.
- Launch schedule: Jan 2027 Campus tab web beta → Mar–Apr 2027 schedule builder (Fall 2027 registration) → Summer 2027 audit engine + verification → Nov 2027 audit for first verified colleges → Spring 2028 all colleges, reviews, AI advisor, optimizer, iOS on the App Store.
- Re-estimate once the Campus tab ships.

## Ideas (not scheduled; owner decides after current work)
- **Syllabus → semester timeline (owner idea, 2026-09-26).** Students upload their class syllabi and get one semester schedule with every assignment/project due date and time, midterm and final dates and times, and TA/professor office hours with locations, for all their classes. Claude's feasibility notes (unverified): LLM extraction per upload; resolve "Week 5"-style dates using the student's sections and the UMD academic calendar; fill finals from UMD's published final exam schedule; show a timeline and export an .ics calendar. Risks: accuracy (cite the syllabus line, "check your syllabus", flag uncertain items), syllabi going stale (a student's ELMS/Canvas calendar feed link might keep dates current, if UMD allows it), privacy (keep uploads on-device or in the student's account). Proposed spike: extract from 3–5 of the owner's syllabi and count errors; check the ELMS calendar feed and where the final exam schedule is published.
