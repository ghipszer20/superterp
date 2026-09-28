# Majors plan (majors session, owner-approved 2026-09-28)

Scope: every unencoded major (College Park first, then Shady Grove / Southern Maryland versions). No minors or certificates (other sessions). Builders: general-purpose + Sonnet with `.claude/agents/major-builder.md` as the standing brief (the `major-builder` agent type loads from the next session on), **3 at once**, branch `feat/<id>`. Owner rulings 2026-09-28: tiny same-college majors (sources under ~8 KB) may share one builder; location versions after the College Park majors. Approving the plan approved these dispatches (section 18). A college's shared-core builder runs before its siblings, never alongside them. Individual Studies is skipped (no requirements in the catalog; flagged).

College keys `PLCY` (School of Public Policy) and `USG` (Universities at Shady Grove) added 2026-09-28.

| # | id | majors | notes | status |
|---|---|---|---|---|
| 1 | agnr-ensp (resume) | ENSP: 8 remaining concentrations + 3 flagged narrowings | `ensp-shared-2026-27.ts` | queued |
| 2 | educ-elem | Elementary Education | creates `educ-shared-2026-27.ts` if the catalog shows a teacher-prep core | queued |
| 3 | bmgt-omba-scm | Operations Mgmt & Business Analytics + Supply Chain | import `bmgt-core-2026-27.ts` | queued |
| 4 | agnr-ferm-nfsc | Fermentation Science + Nutrition & Food Science | | queued |
| 5 | arch-pair | Architecture + Real Estate & Built Environment | | queued |
| 6 | sphl-kine | Kinesiology | creates `sphl-shared` if SPHL majors share a core | queued |
| 7 | agnr-enst | Environmental Science & Technology | | queued |
| 8–16 | educ-a..i | Early Childhood/Special Ed; Elementary/Middle Special Ed; Middle School; Math Ed; English Ed; Science Ed; Social Studies Ed; World Language Ed; Art Ed | after #2 merged | queued |
| 17 | educ-hdev | Human Development | not teacher-prep | queued |
| 18 | agnr-plsc | Plant Sciences | | queued |
| 19 | agnr-larc | Landscape Architecture | | queued |
| 20 | cmns-ai | AI: Computational Structures for AI Systems | `cmsc-major` pattern | queued |
| 21 | jour | Journalism | | queued |
| 22 | info-infosci | Information Science | | queued |
| 23 | info-tid | Technology & Information Design | | queued |
| 24–27 | sphl-* | Family Health; Global Health; PH Practice (+ PH Science if both small) | after #6 merged | queued |
| 28 | plcy-pp | Public Policy | college PLCY | queued |
| 29 | plcy-gfp | Global & Foreign Policy | college PLCY | queued |
| 30 | arhu-ocr-recheck | re-check the 18 OCR-readable ARHU plans (`official: true` where clean); Music Composition BM track | follow-up | queued |
| 31–34 | usg-* | Fermentation (identical: thin re-export) + Info Science + PH Science; Shady Grove Accounting/Management/Marketing; Communication; Southern Maryland EE + ME | college USG; patterns `biocomp-major`, `mechatronics-major`; diff only `## Catalog requirements` first | queued |
