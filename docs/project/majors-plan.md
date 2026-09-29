# Majors plan (majors session, owner-approved 2026-09-28)

Scope: every unencoded major (College Park first, then Shady Grove / Southern Maryland versions). No minors or certificates (other sessions). Builders: general-purpose + Sonnet with `.claude/agents/major-builder.md` as the standing brief (the `major-builder` agent type loads from the next session on), **3 at once**, branch `feat/<id>`. Owner rulings 2026-09-28: tiny same-college majors (sources under ~8 KB) may share one builder; location versions after the College Park majors. Approving the plan approved these dispatches (section 18). A college's shared-core builder runs before its siblings, never alongside them. Individual Studies is skipped (no requirements in the catalog; flagged).

College keys `PLCY` (School of Public Policy) and `USG` (Universities at Shady Grove) added 2026-09-28.

**Split 2026-09-28 (owner):** Half A (AGNR, ARCH, BMGT, SPHL, INFO, Shady Grove/Southern Maryland) = majors session A, merging in `.claude/worktrees/majors-merge`. Half B (EDUC, PLCY, JOUR, CMNS AI, ARHU OCR re-check) = majors session B, merging in `.claude/worktrees/majors-merge-b`. Each session edits only its own half's rows.

## Half A (majors session A)

| # | id | majors | notes | status |
|---|---|---|---|---|
| 1 | agnr-ensp (resume) | ENSP: 8 remaining concentrations + 3 flagged narrowings | `ensp-shared-2026-27.ts` | merged (114k; all 12 concentrations) |
| 2 | educ-elem | Elementary Education | creates `educ-shared-2026-27.ts` if the catalog shows a teacher-prep core | merged (87k; educ-shared created) |
| 3 | bmgt-omba-scm | Operations Mgmt & Business Analytics + Supply Chain | import `bmgt-core-2026-27.ts` | merged (84k) |
| 4 | agnr-ferm-nfsc | Fermentation Science + Nutrition & Food Science | | merged (99k) |
| 5 | arch-pair | Architecture + Real Estate & Built Environment | | merged (94k) |
| 6 | sphl-kine | Kinesiology | creates `sphl-shared` if SPHL majors share a core | merged (84k; sphl-shared created) |
| 7 | agnr-enst | Environmental Science & Technology | | running |
| 18 | agnr-plsc | Plant Sciences | | running |
| 19 | agnr-larc | Landscape Architecture | | queued |
| 22 | info-infosci | Information Science | | queued |
| 23 | info-tid | Technology & Information Design | | queued |
| 24–27 | sphl-* | Family Health; Global Health; PH Practice (+ PH Science if both small) | after #6 merged | running (Family Health) |
| 31–34 | usg-* | Fermentation (identical: thin re-export) + Info Science + PH Science; Shady Grove Accounting/Management/Marketing; Communication; Southern Maryland EE + ME | college USG; patterns `biocomp-major`, `mechatronics-major`; diff only `## Catalog requirements` first | queued |




## Half B (majors session B)

| # | id | majors | notes | status |
|---|---|---|---|---|
| 8 | educ-a | Early Childhood / Early Childhood Special Ed | 2 tracks; import `educ-shared`, never edit it | running |
| 9 | educ-b | Elementary/Middle Special Ed | 2 tracks | running |
| 10 | educ-c | Middle School Ed | | queued |
| 11 | educ-d | Secondary Ed: Mathematics | | queued |
| 12 | educ-e | Secondary Ed: English | | queued |
| 13 | educ-f | Secondary Ed: Science | | queued |
| 14 | educ-g | Secondary Ed: Social Studies | | queued |
| 15 | educ-h | Secondary Ed: World Language | | queued |
| 16 | educ-i | Secondary Ed: Art | | queued |
| 17 | educ-hdev | Human Development | not teacher-prep | queued |
| 20 | cmns-ai | AI: Computational Structures for AI Systems | | skipped (not yet published; owner 2026-09-28) |
| 21 | jour | Journalism | default (no specialization) + Broadcast, Investigative, Sports tracks | queued |
| 28 | plcy-pp | Public Policy | college PLCY | running |
| 29 | plcy-gfp | Global & Foreign Policy | college PLCY; thematic tracks | queued |
| 30a | ocr-comm | OCR re-check: Communication (5 plans) | read only the OCR plan section | queued |
| 30b | ocr-musc | OCR re-check: Music (Jazz, Perf/Comp) + Composition BM track | | queued |
| 30c | ocr-a | OCR re-check: Chinese, Cinema ×2, Dance | | queued |
| 30d | ocr-b | OCR re-check: Global Culture, HCAI, Immersive Media Design | | queued |
| 30e | ocr-c | OCR re-check: Theatre, WGSS | | queued |
