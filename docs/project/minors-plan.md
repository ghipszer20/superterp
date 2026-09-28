# Minors plan (minors session, owner-approved 2026-09-28)

Scope: every unencoded minor (97 unique after cross-listings). No majors, no certificates (other sessions). Builders: general-purpose + Sonnet with `.claude/agents/minor-builder.md` as the standing brief (the `minor-builder` agent type itself loads from the next session on), 3 at once, branch `feat/minors-<id>`. Approving the plan approved these dispatches (section 18).

## Batch table (36 builders; branch `feat/minors-<id>`; approving this plan = the section 18 dispatch approval)
Tiny bundles:
| id | minors (source KB) |
|---|---|
| t-bsos1 | GIS 2.7, Remote Sensing 2.3, Intl Development & Conflict Mgmt 2.5, Law & Society 2.1 |
| t-bsos2 | Economics 1.8, Sociology 0.6, Demography 2.2, African Studies 2.6 |
| t-educ | ASL 1.3, Disability Studies 2.1, Secondary Education minor 3.0, TESOL 1.1, Ed Policy (EDUC+PLCY) 4.9 |
| t-sph-jour | Kinesiology ×3 (~1 each), Media Tech & Democracy 2.3, Video Production 0.3 |
| t-rotc | Army Leadership 1.2, Military Studies 4.3, Naval Science 1.4 |
| t-engr | Computer Eng 1.6, Nuclear Eng 4.5, Project Mgmt 4.4, Technology Entrepreneurship 3.8 |
| t-info-usg | IRMEP 1.6, Tech Innovation Leadership 1.5, ACES 4.4, Criminal Justice (Shady Grove) 1.2 |
| t-arhu | Philosophy 3.8, Arts Leadership 0.9, Humanities Health & Medicine 1.9, WGSS minor 2.2, LGBT Studies 6.5 |
| t-clas | Greek 4.7, Latin 4.5, Classical Mythology 4.6, Classical Archaeology 8.7 |
| t-agnr-arch | Soil Science 2.2, AI in Architecture 0.7, Construction PM (ARCH+ENGR) 5.3 |

Medium:
| id | minors |
|---|---|
| arth | Art History, Archaeology |
| engl1 | Rhetoric (COMM+ENGL), Digital Storytelling & Poetics, Creative Writing |
| engl-hist | Professional Writing, History |
| jwst1 | Jewish Studies, Religious Studies |
| hebrew | Hebrew Studies (JWST+SLLC) |
| mideast | Israel Studies, Middle Eastern Studies |
| sllc-me | Arabic, Persian |
| sllc-ea | Chinese, Japanese, Korean |
| sllc-rom | French, Italian, Portuguese & Brazilian |
| sllc-eur | German, Russian |
| sllc-span | Spanish 1, 2, 3 (reuse `span-shared-2026-27.ts`) |
| amst-lasc | US Latina/o Studies, Latin American Studies |
| ling-musc | Linguistics, Music & Culture, Music Performance |
| bws | Black Women's Studies (WGSS+AAAS), Anti-Black Racism |
| bsos-a | Global Terrorism Studies, Hearing & Speech Sciences |
| bsos-b | Neuroscience, Survey Methodology |
| agnr-a | Global Poverty, Sustainability Studies (AGNR+PLCY) |
| agnr-b | Agricultural Science & Tech, Landscape Management |
| arch | History & Theory of Arch, Real Estate Development, Creative Placemaking (ARCH+ARHU) |
| bmgt-a | Business Analytics |
| bmgt-b | Entrepreneurial Leadership, General Business |
| engr-b | Global Engineering Leadership, Nanoscale S&T, Quantum S&E |
| step-plcy | Science, Technology, Ethics & Policy (ENGR+INFO+PLCY), Public Leadership |
| nonprofit | Nonprofit Leadership & Social Innovation |
| educ-b | Leadership Studies minor, Human Development |
| usg | Global Studies, Asian American Studies |

Order: the tiny bundles first (fastest registry growth, and they prove the brief), then the medium batches
college by college. At most 3 builders run at once, and the next one starts whenever one is merged.

## Status
- Merged (2026-09-28): t-bsos2 (85k tokens), t-bsos1 (80k), t-educ (88k). 13 minors.
- Running: t-sph-jour, t-rotc, t-engr.
- Rule added after round 1: slots with no published list are left out of `requirements` and tagged `OPEN SLOT:` in reviewNotes (see roadmap Known to-dos).
