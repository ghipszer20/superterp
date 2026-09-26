# Draft programs report

Generated 2026-09-26 by `packages/catalog/scripts/draft-all.ts`, which drafts every cached program page
(see `coverage.ts`) into audit Programs with `draftProgram` (`src/draft.ts`). Drafts are never verified;
they are not committed. This report is what the deterministic drafter converts and what it leaves to the owner.

## Overall

- Programs: **270**, with at least one requirement table: **252**; drafted tables: **467**
- Converted automatically: **5739 of 8660** rule rows (**66.3%**); sent to review: 2921. Plain section headers (753) are not counted.
- Requirements drafted: **3466** (course 3321, choose 99, sets 45, distribution 1)
- Review items: **1174** manual (not drafted), **453** check (drafted, confirm)

## Why rows went to review

Ranked by rows sent to review. Check items send no rows; they flag drafted requirements.

| Reason | Meaning | Items | Rows to review | Engine gap |
| --- | --- | --- | --- | --- |
| unrecognized-rule | A text or header rule the drafter doesn't parse (prose), with the course rows under it | 823 | 2667 |  |
| empty-group | A 'Select …' rule followed by labelled groups rather than courses (options, tracks) | 17 | 177 |  |
| course-pattern | An unlinked course pattern such as STAT4xx (a filter is suggested) | 32 | 33 |  |
| ambiguous-code | A code like PLSC110/111 (cross-listing or pair?) | 5 | 22 |  |
| group-boundary | A 'Select …' group whose end is unclear (member credits differ) | 2 | 17 |  |
| must-include | An umbrella count over the rows after it ('eight courses … must include:'), an overlay | 4 | 4 |  |
| stray-or | An 'or' with nothing above it to attach to | 1 | 1 |  |
| footnote | A footnote on a drafted row or section (check it doesn't change the rule) | 449 | 0 |  |
| multiple-lists | Several tables on one page: tracks, specializations or parts of one program? | 290 | 0 |  |
| sequence-filter | A sequence's nested rule converted into a course-count filter part of its set (confirm the count and range) | 3 | 0 |  |
| alternatives-flattened | 'or' alternatives inside a distribution area listed separately | 1 | 0 |  |

## Engine gaps

Rule shapes the audit engine (`packages/audit/src/audit.ts`) can't express even by hand. Everything else sent to review can be
encoded with the existing requirement kinds once someone reads the prose.

| Reason | Shape | Items | Rows | Programs |
| --- | --- | --- | --- | --- |
| none | | | | |

## Top 30 unrecognized phrasings

Lead rows of unrecognized-rule items; course codes become COURSE and numbers N.

| Count | Phrasing |
| --- | --- |
| 58 | College Requirements |
| 9 | Total Credits |
| 7 | Primary WL Area |
| 6 | For a comprehensive list of electives see website. |
| 6 | Special Topics Courses |
| 4 | Completion of a foreign language through the entire elementary level |
| 4 | ELECTIVE |
| 4 | Elective Courses |
| 4 | Elective Courses (N Credits) |
| 4 | One course in National/International Cinemas |
| 4 | Select one Nxx-level ARTT elective |
| 4 | TECHNICAL ELECTIVE |
| 3 | AGST or PLSC Restricted Elective |
| 3 | Departmental Honors Seminars |
| 3 | Electives Courses |
| 3 | Focus/PLCY Elective Course N |
| 3 | Foundations Courses |
| 3 | Minimum N credits from any N- or N-level BSCI, CHEM, or BCHM course. |
| 3 | Other upper-level AREC courses with permission of advisor. |
| 3 | PHYSNXY |
| 3 | Quantitative Skills course |
| 3 | Select an Option: |
| 3 | Select electives: N-level MATH/AMSC/STAT course |
| 3 | Select four of the following specialization electives: |
| 3 | Select one of the following specializations: |
| 3 | Select one of the following tracks: |
| 3 | Select one upper-level human geography course |
| 3 | Select one upper-level physical geography course |
| 3 | Select three courses from one of the following fields: |
| 3 | Supporting courses approved by GEOG advisor |

591 distinct phrasings in all.

## Per program

One line per requirement table. Converted: rule rows drafted automatically, of all rule rows.

| Program | Kind | Requirements | Manual | Check | Converted |
| --- | --- | --- | --- | --- | --- |
| Accounting Major | major | 3 | 3 | 0 | 3/7 (43%) |
| Accounting Major (Public Accounting Track) | major | 5 | 1 | 1 | 11/11 (100%) |
| Accounting Major (Business and Accounting Advisory Track) | major | 2 | 2 | 0 | 20/31 (65%) |
| Accounting Major at Shady Grove | major | 3 | 3 | 0 | 3/7 (43%) |
| Accounting Major at Shady Grove (Public Accounting Track) | major | 5 | 1 | 1 | 11/11 (100%) |
| Accounting Major at Shady Grove (Business and Accounting Advisory Track) | major | 2 | 2 | 1 | 20/30 (67%) |
| Aerospace Engineering Major (Aerospace Electives) | major | 10 | 0 | 1 | 10/10 (100%) |
| African American and Africana Studies Major | major | 7 | 4 | 1 | 11/14 (79%) |
| African American and Africana Studies Major (African-American and Africana Studies Major) | major | 0 | 2 | 0 | 0/5 (0%) |
| African American and Africana Studies Major (Public Policy Concentration) | major | 3 | 2 | 0 | 4/11 (36%) |
| Agricultural and Resource Economics Major | major | 4 | 6 | 0 | 7/18 (39%) |
| Agricultural and Resource Economics Major (Agribusiness) | major | 1 | 3 | 0 | 14/19 (74%) |
| Agricultural and Resource Economics Major (Agricultural and Resource Economics) | major | 1 | 3 | 0 | 21/27 (78%) |
| Agricultural and Resource Economics Major (Environmental and Resource Economics) | major | 1 | 3 | 0 | 13/19 (68%) |
| Agricultural and Resource Economics Major (Advanced Degree Preparation) | major | 1 | 2 | 0 | 12/13 (92%) |
| Agricultural and Resource Economics Major (Agricultural, Food and Natural Resource Systems) | major | 1 | 1 | 0 | 12/12 (100%) |
| Agricultural and Resource Economics Major (Business Management) | major | 1 | 1 | 1 | 5/5 (100%) |
| Agricultural and Resource Economics Major (Agricultural Management and Entrepreneurship) | major | 1 | 1 | 0 | 11/11 (100%) |
| Agricultural and Resource Economics Major (Global Hunger, Poverty and Sustainable Development) | major | 1 | 1 | 0 | 10/10 (100%) |
| Agricultural and Resource Economics Major (Environmental Data Science) | major | 1 | 1 | 0 | 10/10 (100%) |
| Agricultural and Resource Economics Major (Environmental and Resource Management and Policy) | major | 8 | 1 | 0 | 9/9 (100%) |
| Agricultural and Resource Economics Major (Student Designed Field) | major | 0 | 2 | 1 | 0/1 (0%) |
| Agricultural Science and Technology Major | major | 9 | 2 | 0 | 12/16 (75%) |
| Agricultural Science and Technology Major (Agronomy) | major | 13 | 8 | 6 | 19/26 (73%) |
| Agricultural Science and Technology Major (Environmental Horticulture) | major | 10 | 6 | 4 | 49/60 (82%) |
| Agricultural Science and Technology Major (Agricultural and Extension Education: Teaching Certificate) | major | 25 | 1 | 0 | 38/38 (100%) |
| Agricultural Science and Technology Major (Agricultural and Extension education: Extension/Industry) | major | 23 | 2 | 1 | 34/35 (97%) |
| American Studies Major | major | 3 | 5 | 4 | 3/16 (19%) |
| Animal Sciences Major | major | 14 | 2 | 0 | 15/18 (83%) |
| Animal Sciences Major (Animal Care and Management) | major | 8 | 1 | 0 | 38/38 (100%) |
| Animal Sciences Major (Science/Professional & Combined Ag-Veterinary Medicine) | major | 12 | 1 | 0 | 41/41 (100%) |
| Anthropology Major (Anthropology Degree Requirements) | major | 2 | 6 | 1 | 10/27 (37%) |
| Anthropology Major (Bachelor of Arts) | major | 1 | 1 | 1 | 10/10 (100%) |
| Anthropology Major (Bachelor of Science) | major | 1 | 1 | 0 | 6/6 (100%) |
| Anthropology Major (Bachelor of Arts) | major | 0 | 2 | 0 | 0/1 (0%) |
| Anthropology Major (Bachelor of Science) | major | 1 | 1 | 4 | 46/46 (100%) |
| Arabic Studies Major | major | 6 | 3 | 0 | 6/8 (75%) |
| Arabic Studies Major (Foundation Electives (a minimum of 9 credits)) | major | 6 | 1 | 0 | 6/6 (100%) |
| Arabic Studies Major (Optional Electives (a maximum of 9 credits, including at least one 3-credit course taught in Arabic)) | major | 8 | 1 | 0 | 8/8 (100%) |
| Architecture Major | major | 11 | 1 | 0 | 12/12 (100%) |
| Architecture Major | major | 7 | 2 | 0 | 7/8 (88%) |
| Architecture Major | major | 0 | 3 | 0 | 0/2 (0%) |
| Art History Major | major | 1 | 4 | 3 | 2/6 (33%) |
| Artificial Intelligence: Computational Structures for AI Systems Major (Requirements:) | major | 8 | 9 | 0 | 10/39 (26%) |
| Artificial Intelligence: Computational Structures for AI Systems Major (General Specialization) | major | 2 | 1 | 0 | 18/18 (100%) |
| Artificial Intelligence: Computational Structures for AI Systems Major (Generative AI Specialization) | major | 5 | 1 | 0 | 17/17 (100%) |
| Artificial Intelligence: Computational Structures for AI Systems Major (AI, Society, and Decision Making Specialization) | major | 5 | 1 | 0 | 19/19 (100%) |
| Artificial Intelligence: Computational Structures for AI Systems Major (AI Algorithms Specialization) | major | 5 | 1 | 0 | 12/12 (100%) |
| Artificial Intelligence: Computational Structures for AI Systems Major (Accessibility Specialization) | major | 4 | 1 | 0 | 11/11 (100%) |
| Astronomy Major (Courses Required for All Specializations) | major | 14 | 1 | 2 | 14/14 (100%) |
| Astronomy Major (Astrophysics Specialization) | major | 5 | 2 | 1 | 17/22 (77%) |
| Astronomy Major (Astronomy - Data Science Specialization) | major | 4 | 2 | 2 | 20/21 (95%) |
| Astronomy Major (Astronomy - Physical Science Specialization) | major | 2 | 2 | 2 | 41/81 (51%) |
| Atmospheric and Oceanic Science Major | major | 21 | 1 | 4 | 26/27 (96%) |
| Biochemistry Major | major | 24 | 1 | 1 | 20/21 (95%) |
| Biocomputational Engineering Major (Prior Study) | major | 11 | 3 | 0 | 12/14 (86%) |
| Biocomputational Engineering Major (Required Courses) | major | 16 | 3 | 0 | 16/18 (89%) |
| Biocomputational Engineering Major (Elective Courses) | major | 10 | 1 | 0 | 10/10 (100%) |
| Biocomputational Engineering Major at Shady Grove (Prior Study) | major | 11 | 3 | 0 | 12/14 (86%) |
| Biocomputational Engineering Major at Shady Grove (Required Courses) | major | 16 | 3 | 0 | 16/18 (89%) |
| Biocomputational Engineering Major at Shady Grove (Elective Courses) | major | 10 | 1 | 0 | 10/10 (100%) |
| Biological Sciences Major | major | 16 | 2 | 1 | 18/19 (95%) |
| Biological Sciences Major (Cell Biology & Genetics 0404A) | major | 44 | 5 | 4 | 44/48 (92%) |
| Biological Sciences Major (Ecology & Evolution 0404B) | major | 40 | 6 | 2 | 42/47 (89%) |
| Biological Sciences Major (General Biology 0404C) | major | 75 | 6 | 2 | 81/86 (94%) |
| Biological Sciences Major (Microbiology 0404D) | major | 16 | 5 | 1 | 18/22 (82%) |
| Biological Sciences Major (Physiology & Neurobiology 0404E) | major | 40 | 5 | 2 | 41/45 (91%) |
| Biological Sciences Major at Shady Grove | major | 17 | 4 | 2 | 17/20 (85%) |
| Biological Sciences Major at Shady Grove (Advanced Program in Physiology and Neurobiology) | major | 45 | 5 | 6 | 45/58 (78%) |
| Chemistry Major (B.A., B.S.) (Requirements for the Bachelor of Science In Chemistry (B.S.)) | major | 21 | 2 | 1 | 17/18 (94%) |
| Chemistry Major (B.A., B.S.) (Requirements for the Bachelor of Arts in Chemistry (B.A.)) | major | 15 | 3 | 0 | 13/18 (72%) |
| Chinese Major | major | 10 | 0 | 3 | 14/14 (100%) |
| Cinema and Media Studies Major (ENGL) (Core Program) | major | 3 | 7 | 2 | 3/9 (33%) |
| Cinema and Media Studies Major (ENGL) (Critical Studies Track (18 Credits)) | major | 0 | 4 | 2 | 0/3 (0%) |
| Cinema and Media Studies Major (ENGL) (Film Production Track (18 Credits)) | major | 4 | 2 | 1 | 4/5 (80%) |
| Cinema and Media Studies Major (SLLC) (Core Program) | major | 3 | 7 | 2 | 3/9 (33%) |
| Cinema and Media Studies Major (SLLC) (Critical Studies Track (18 Credits)) | major | 0 | 4 | 2 | 0/3 (0%) |
| Cinema and Media Studies Major (SLLC) (Film Production Track (18 Credits)) | major | 4 | 2 | 1 | 4/5 (80%) |
| Classical Languages and Literatures Major | major | 0 | 3 | 0 | 0/5 (0%) |
| Classical Languages and Literatures Major (Option A: Latin) | major | 0 | 4 | 0 | 0/3 (0%) |
| Classical Languages and Literatures Major (Option B: Latin and Greek) | major | 0 | 2 | 2 | 0/8 (0%) |
| Classical Languages and Literatures Major (Option C: Classics in Translation (Classical Humanities)) | major | 0 | 3 | 2 | 0/3 (0%) |
| Communication Major | major | 4 | 3 | 0 | 13/20 (65%) |
| Communication Major (Communication Studies) | major | 7 | 2 | 0 | 51/52 (98%) |
| Communication Major (Health and Science Communication) | major | 16 | 2 | 1 | 59/60 (98%) |
| Communication Major (Media and Digital Communication) | major | 8 | 2 | 1 | 50/61 (82%) |
| Communication Major (Political Communication and Public Advocacy) | major | 8 | 2 | 1 | 51/64 (80%) |
| Communication Major (Public Relations) | major | 12 | 1 | 0 | 41/41 (100%) |
| Communication Major at Shady Grove | major | 14 | 1 | 0 | 63/64 (98%) |
| Computer Science Major | major | 9 | 4 | 6 | 43/46 (93%) |
| Computer Science Major (Cybersecurity Specialization) | major | 3 | 2 | 1 | 9/10 (90%) |
| Computer Science Major (Data Science Specialization) | major | 6 | 1 | 0 | 24/24 (100%) |
| Computer Science Major (Machine Learning Specialization) | major | 4 | 2 | 1 | 13/14 (93%) |
| Computer Science Major (Quantum Information Specialization) | major | 2 | 3 | 0 | 2/32 (6%) |
| Criminology and Criminal Justice Major | major | 8 | 2 | 3 | 16/21 (76%) |
| Criminology and Criminal Justice Major at Shady Grove | major | 8 | 1 | 2 | 16/17 (94%) |
| Cyber-Physical Systems Engineering Major (First & Second Year) | major | 8 | 4 | 1 | 8/14 (57%) |
| Cyber-Physical Systems Engineering Major (Hardware Track) | major | 2 | 1 | 0 | 9/9 (100%) |
| Cyber-Physical Systems Engineering Major (Computational Track) | major | 2 | 1 | 0 | 9/9 (100%) |
| Cyber-Physical Systems Engineering Major (Security Track) | major | 2 | 1 | 0 | 9/9 (100%) |
| Cyber-Physical Systems Engineering Major at Shady Grove (First & Second Year) | major | 8 | 4 | 1 | 8/14 (57%) |
| Cyber-Physical Systems Engineering Major at Shady Grove (Hardware Track) | major | 2 | 1 | 0 | 9/9 (100%) |
| Cyber-Physical Systems Engineering Major at Shady Grove (Computational Track) | major | 2 | 1 | 0 | 9/9 (100%) |
| Cyber-Physical Systems Engineering Major at Shady Grove (Security Track) | major | 2 | 1 | 0 | 9/9 (100%) |
| Dance Major | major | 12 | 3 | 0 | 15/22 (68%) |
| Dance Major (Performance and Choreography) | major | 4 | 2 | 2 | 14/15 (93%) |
| Dance Major (Production) | major | 2 | 1 | 2 | 12/12 (100%) |
| Dance Major (Education) | major | 5 | 1 | 0 | 5/5 (100%) |
| Early Childhood/Early Childhood Special Education Major (Pre-Professional Requirements) | major | 7 | 6 | 0 | 8/20 (40%) |
| Early Childhood/Early Childhood Special Education Major (Professional Courses) | major | 16 | 5 | 0 | 17/25 (68%) |
| Economics Major (Bachelor of Arts) | major | 8 | 6 | 1 | 16/21 (76%) |
| Economics Major (Bachelor of Science) | major | 8 | 6 | 0 | 10/15 (67%) |
| Elementary Education Major | major | 28 | 8 | 4 | 31/48 (65%) |
| Elementary/Middle Special Education Major (Admission to the Major) | major | 8 | 3 | 1 | 9/11 (82%) |
| Elementary/Middle Special Education Major | major | 46 | 15 | 2 | 55/69 (80%) |
| English Language and Literature Major | major | 1 | 9 | 1 | 1/13 (8%) |
| English Language and Literature Major (Literary and Cultural Studies Track) | major | 0 | 2 | 0 | 0/3 (0%) |
| English Language and Literature Major (Language, Writing, and Rhetoric Track) | major | 0 | 2 | 0 | 0/3 (0%) |
| English Language and Literature Major (Media Studies Track) | major | 0 | 2 | 0 | 0/5 (0%) |
| English Language and Literature Major (Creative Writing Track) | major | 0 | 2 | 0 | 0/5 (0%) |
| Environmental Science and Policy Major | major | 6 | 2 | 3 | 21/41 (51%) |
| Environmental Science and Policy Major (Environment and Agriculture (AGNR)) | major | 0 | 5 | 1 | 0/21 (0%) |
| Environmental Science and Policy Major (Environmental Economics (AGNR)) | major | 0 | 4 | 1 | 0/27 (0%) |
| Environmental Science and Policy Major (Soil, Water, and Land Resources (AGNR)) | major | 5 | 2 | 1 | 19/20 (95%) |
| Environmental Science and Policy Major (Wildlife Ecology and Management (AGNR)) | major | 11 | 2 | 1 | 12/15 (80%) |
| Environmental Science and Policy Major (Culture and Environment (BSOS)) | major | 3 | 3 | 1 | 4/6 (67%) |
| Environmental Science and Policy Major (Environmental Politics and Policy (BSOS)) | major | 7 | 2 | 1 | 7/8 (88%) |
| Environmental Science and Policy Major (Global Environmental Change (BSOS)) | major | 0 | 4 | 1 | 0/26 (0%) |
| Environmental Science and Policy Major (Land Use (BSOS)) | major | 2 | 4 | 1 | 2/15 (13%) |
| Environmental Science and Policy Major (Marine and Coastal Management (BSOS)) | major | 7 | 2 | 1 | 8/9 (89%) |
| Environmental Science and Policy Major (Biodiversity and Conservation Biology (CMNS)) | major | 12 | 2 | 1 | 13/14 (93%) |
| Environmental Science and Policy Major (Environmental Geosciences and Restoration (CMNS)) | major | 9 | 2 | 1 | 10/15 (67%) |
| Environmental Science and Policy Major (Environmental Justice (SPHL)) | major | 12 | 1 | 1 | 14/14 (100%) |
| Environmental Science and Technology Major | major | 14 | 3 | 0 | 15/21 (71%) |
| Environmental Science and Technology Major (Ecological Technology Design) | major | 13 | 5 | 1 | 17/38 (45%) |
| Environmental Science and Technology Major (Ecosystem Health) | major | 8 | 7 | 1 | 9/37 (24%) |
| Environmental Science and Technology Major (Applied Ecology and Natural Resources) | major | 4 | 7 | 3 | 6/43 (14%) |
| Environmental Science and Technology Major (Soil and Watershed Science) | major | 10 | 5 | 2 | 12/37 (32%) |
| Family Health Major | major | 19 | 2 | 0 | 31/33 (94%) |
| Fermentation Science Major | major | 26 | 6 | 1 | 28/33 (85%) |
| Fermentation Science Major | major | 16 | 1 | 1 | 16/16 (100%) |
| Fermentation Science Major at Shady Grove | major | 26 | 6 | 1 | 28/33 (85%) |
| Fermentation Science Major at Shady Grove | major | 16 | 1 | 1 | 16/16 (100%) |
| Finance Major | major | 5 | 4 | 0 | 19/26 (73%) |
| Fire Protection Engineering Major | major | 29 | 4 | 2 | 30/33 (91%) |
| Fire Protection Engineering Major | major | 15 | 3 | 3 | 15/34 (44%) |
| French Language and Literature Major | major | 7 | 2 | 0 | 12/14 (86%) |
| Geographical Sciences Major | major | 6 | 7 | 1 | 5/11 (45%) |
| Geographical Sciences Major (Geospatial Data Science Specialization) | major | 10 | 6 | 1 | 16/21 (76%) |
| Geographical Sciences Major (Computational Earth Observation Science Specialization) | major | 11 | 5 | 2 | 26/30 (87%) |
| Geology Major (Professional Track) | major | 21 | 2 | 1 | 42/43 (98%) |
| Geology Major (Earth and Environmental Sciences Track) | major | 15 | 8 | 2 | 32/63 (51%) |
| Geology Major (Geophysics Track) | major | 19 | 1 | 1 | 54/54 (100%) |
| German Studies Major | major | 3 | 5 | 2 | 3/36 (8%) |
| Global and Foreign Policy Major | major | 6 | 11 | 4 | 6/21 (29%) |
| Global and Foreign Policy Major (Security, Conflict, and Diplomacy) | major | 0 | 4 | 0 | 0/3 (0%) |
| Global and Foreign Policy Major (Human Security and Migration) | major | 0 | 4 | 0 | 0/3 (0%) |
| Global and Foreign Policy Major (Development and Sustainability) | major | 0 | 4 | 0 | 0/3 (0%) |
| Global Culture and Thought Major | major | 2 | 5 | 4 | 2/8 (25%) |
| Global Health Major | major | 20 | 4 | 5 | 22/26 (85%) |
| Government and Politics Major | major | 5 | 7 | 2 | 13/19 (68%) |
| Government and Politics Major (Requirements for the Bachelor of Science) | major | 6 | 8 | 3 | 17/24 (71%) |
| Hearing and Speech Sciences Major | major | 14 | 4 | 4 | 32/39 (82%) |
| History Major | major | 2 | 2 | 1 | 2/4 (50%) |
| Human Development Major | major | 9 | 2 | 3 | 28/29 (97%) |
| Human Development Major (Psychology Electives) | major | 13 | 1 | 0 | 13/13 (100%) |
| Human Development Major (Sociology Electives) | major | 8 | 1 | 0 | 8/8 (100%) |
| Human Development Major (Family Science Electives) | major | 6 | 1 | 0 | 6/6 (100%) |
| Human-Centered Artificial Intelligence Major | major | 10 | 1 | 1 | 10/81 (12%) |
| Immersive Media Design Major (ARTT) (Computing Track) | major | 20 | 4 | 0 | 26/29 (90%) |
| Immersive Media Design Major (ARTT) (Emerging Creatives Track) | major | 18 | 2 | 0 | 24/25 (96%) |
| Immersive Media Design Major (CMSC) (Computing Track) | major | 20 | 4 | 0 | 26/29 (90%) |
| Immersive Media Design Major (CMSC) (Emerging Creatives Track) | major | 18 | 2 | 0 | 24/25 (96%) |
| Information Science Major | major | 14 | 1 | 2 | 14/17 (82%) |
| Information Science Major at Shady Grove (Benchmark Courses) | major | 4 | 1 | 1 | 4/4 (100%) |
| Information Science Major at Shady Grove (BSIS Curriculum) | major | 1 | 3 | 0 | 11/13 (85%) |
| Information Systems Major | major | 4 | 2 | 5 | 4/19 (21%) |
| International Business Major | major | 3 | 2 | 0 | 12/25 (48%) |
| International Relations Major | major | 7 | 8 | 2 | 16/23 (70%) |
| International Relations Major | major | 7 | 10 | 3 | 16/25 (64%) |
| Italian Studies Major | major | 8 | 2 | 1 | 9/11 (82%) |
| Japanese Major | major | 4 | 6 | 1 | 4/32 (13%) |
| Jewish Studies Major (Required of All Students) | major | 1 | 5 | 0 | 3/23 (13%) |
| Jewish Studies Major (Major Tracks) | major | 0 | 3 | 0 | 0/2 (0%) |
| Jewish Studies Major (Major Tracks) | major | 0 | 5 | 1 | 0/4 (0%) |
| Journalism Major | major | 7 | 5 | 4 | 7/59 (12%) |
| Journalism Major (Broadcast Specialization) | major | 2 | 2 | 1 | 2/3 (67%) |
| Journalism Major (Investigative Reporting Specialization) | major | 2 | 2 | 0 | 3/4 (75%) |
| Journalism Major (Sports Specialization) | major | 0 | 5 | 1 | 0/4 (0%) |
| Kinesiology Major | major | 14 | 3 | 2 | 15/18 (83%) |
| Landscape Architecture Major | major | 29 | 0 | 0 | 27/27 (100%) |
| Linguistics Major | major | 5 | 3 | 0 | 11/15 (73%) |
| Linguistics Major (Grammars and Cognition Track) | major | 2 | 2 | 0 | 3/4 (75%) |
| Linguistics Major (Language Track) | major | 0 | 2 | 1 | 0/1 (0%) |
| Management Major | major | 3 | 1 | 1 | 10/11 (91%) |
| Management Major at Shady Grove | major | 3 | 1 | 1 | 10/11 (91%) |
| Marketing Major | major | 4 | 1 | 0 | 13/14 (93%) |
| Marketing Major at Shady Grove | major | 4 | 1 | 0 | 13/14 (93%) |
| Mathematics Major (Traditional Track) | major | 11 | 5 | 5 | 62/71 (87%) |
| Mathematics Major (Applied Mathematics Track) | major | 13 | 5 | 6 | 92/101 (91%) |
| Mathematics Major (Secondary Education Track) | major | 16 | 3 | 6 | 59/61 (97%) |
| Mathematics Major (Statistics Track) | major | 14 | 3 | 4 | 63/70 (90%) |
| Mathematics Major (1. Pure Mathematics) | major | 22 | 2 | 0 | 24/25 (96%) |
| Mathematics Major (2. Secondary Teaching) | major | 5 | 1 | 0 | 5/5 (100%) |
| Mathematics Major (4. Computational Mathematics) | major | 6 | 1 | 0 | 6/6 (100%) |
| Mathematics Major (5. Applied Mathematics) | major | 6 | 1 | 0 | 6/6 (100%) |
| Mechatronics Engineering Major (Prior Study) | major | 17 | 2 | 0 | 18/19 (95%) |
| Mechatronics Engineering Major (Required Courses) | major | 14 | 7 | 2 | 14/20 (70%) |
| Mechatronics Engineering Major at Shady Grove (Prior Study) | major | 17 | 2 | 0 | 18/19 (95%) |
| Mechatronics Engineering Major at Shady Grove (Required Courses) | major | 14 | 7 | 2 | 14/20 (70%) |
| Middle School Education Major | major | 30 | 1 | 2 | 29/33 (88%) |
| Neuroscience Major (BSOS) | major | 18 | 6 | 6 | 24/90 (27%) |
| Neuroscience Major (CMNS) | major | 18 | 6 | 6 | 24/90 (27%) |
| Nutrition and Food Science Major | major | 13 | 2 | 0 | 14/18 (78%) |
| Nutrition and Food Science Major (Dietetics) | major | 18 | 2 | 0 | 19/33 (58%) |
| Nutrition and Food Science Major (Food Science) | major | 15 | 2 | 0 | 17/28 (61%) |
| Nutrition and Food Science Major (Nutritional Science) | major | 15 | 2 | 0 | 15/24 (63%) |
| Nutrition and Food Science Major (Nutritional Science restricted elective list) | major | 7 | 2 | 0 | 7/8 (88%) |
| Operations Management & Business Analytics Major | major | 4 | 2 | 0 | 4/15 (27%) |
| Persian Studies Major | major | 6 | 1 | 2 | 24/25 (96%) |
| Philosophy Major | major | 0 | 2 | 1 | 0/8 (0%) |
| Philosophy, Politics, and Economics Major | major | 9 | 2 | 1 | 9/41 (22%) |
| Physics Major | major | 11 | 1 | 1 | 12/12 (100%) |
| Physics Major (Additional Courses for Specializations) | major | 9 | 3 | 2 | 9/11 (82%) |
| Physics Major (Additional Courses for Specializations) | major | 10 | 2 | 0 | 14/15 (93%) |
| Physics Major (Additional Courses for Specializations) | major | 17 | 4 | 0 | 19/22 (86%) |
| Physics Major (Additional Courses for Specializations) | major | 10 | 2 | 0 | 12/13 (92%) |
| Plant Sciences Major | major | 8 | 2 | 1 | 9/13 (69%) |
| Plant Sciences Major (Plant Biology) | major | 17 | 1 | 0 | 30/30 (100%) |
| Plant Sciences Major (Turf and Golf Course Management) | major | 17 | 1 | 0 | 17/17 (100%) |
| Plant Sciences Major (Urban Forestry) | major | 18 | 1 | 0 | 21/21 (100%) |
| Plant Sciences Major (Suggested General Education Courses and Electives for urban forestry) | major | 27 | 2 | 1 | 28/29 (97%) |
| Psychology Major | major | 3 | 2 | 1 | 3/11 (27%) |
| Public Health Practice Major | major | 17 | 1 | 0 | 19/20 (95%) |
| Public Health Science Major | major | 21 | 0 | 1 | 20/20 (100%) |
| Public Health Science Major at Shady Grove (Discontinued) | major | 21 | 0 | 1 | 20/20 (100%) |
| Public Policy Major | major | 15 | 6 | 3 | 15/21 (71%) |
| Real Estate and the Built Environment Major | major | 8 | 3 | 2 | 14/67 (21%) |
| Religions of the Ancient Middle East Major | major | 1 | 3 | 1 | 1/23 (4%) |
| Romance Languages Major | major | 0 | 4 | 0 | 0/6 (0%) |
| Romance Languages Major (French Requirements) | major | 5 | 2 | 0 | 5/6 (83%) |
| Romance Languages Major (Italian Requirements) | major | 2 | 3 | 0 | 2/8 (25%) |
| Romance Languages Major (Spanish Requirements) | major | 3 | 2 | 0 | 3/13 (23%) |
| Russian Language and Literature Major | major | 6 | 5 | 1 | 6/11 (55%) |
| Secondary Education Major - Art | major | 24 | 2 | 4 | 30/32 (94%) |
| Secondary Education Major - English | major | 13 | 2 | 4 | 17/42 (40%) |
| Secondary Education Major - Mathematics | major | 14 | 1 | 0 | 16/17 (94%) |
| Secondary Education Major - Science | major | 13 | 1 | 1 | 15/16 (94%) |
| Secondary Education Major - Social Studies (Option I: History) | major | 18 | 8 | 3 | 27/34 (79%) |
| Secondary Education Major - Social Studies (Option II: Geography) | major | 15 | 4 | 1 | 17/41 (41%) |
| Secondary Education Major - Social Studies (Option III: Government and Politics) | major | 18 | 11 | 1 | 25/37 (68%) |
| Secondary Education Major - World Language | major | 10 | 9 | 4 | 12/24 (50%) |
| Social Data Science Major (BSOS) (Social Data Sciences Requirements) | major | 10 | 3 | 0 | 12/18 (67%) |
| Social Data Science Major (BSOS) (African American Studies Track) | major | 4 | 1 | 0 | 16/16 (100%) |
| Social Data Science Major (BSOS) (Anthropology Track) | major | 9 | 10 | 0 | 9/37 (24%) |
| Social Data Science Major (BSOS) (Criminology Track) | major | 5 | 1 | 0 | 18/18 (100%) |
| Social Data Science Major (BSOS) (Economics Track) | major | 4 | 2 | 2 | 5/6 (83%) |
| Social Data Science Major (BSOS) (Geographical Sciences Track) | major | 3 | 2 | 0 | 3/17 (18%) |
| Social Data Science Major (BSOS) (Government and Politics Track) | major | 4 | 2 | 0 | 4/5 (80%) |
| Social Data Science Major (BSOS) (Psychology Track) | major | 3 | 2 | 1 | 3/4 (75%) |
| Social Data Science Major (BSOS) (Public Health Track) | major | 5 | 1 | 0 | 20/20 (100%) |
| Social Data Science Major (BSOS) (Sociology Track) | major | 3 | 2 | 0 | 3/4 (75%) |
| Social Data Science Major (INFO) (Social Data Sciences Requirements) | major | 10 | 3 | 0 | 12/18 (67%) |
| Social Data Science Major (INFO) (African American Studies Track) | major | 4 | 1 | 0 | 16/16 (100%) |
| Social Data Science Major (INFO) (Anthropology Track) | major | 9 | 10 | 0 | 9/37 (24%) |
| Social Data Science Major (INFO) (Criminology Track) | major | 5 | 1 | 0 | 18/18 (100%) |
| Social Data Science Major (INFO) (Economics Track) | major | 4 | 2 | 2 | 5/6 (83%) |
| Social Data Science Major (INFO) (Geographical Sciences Track) | major | 3 | 2 | 0 | 3/17 (18%) |
| Social Data Science Major (INFO) (Government and Politics Track) | major | 4 | 2 | 0 | 4/5 (80%) |
| Social Data Science Major (INFO) (Psychology Track) | major | 3 | 2 | 1 | 3/4 (75%) |
| Social Data Science Major (INFO) (Public Health Track) | major | 5 | 1 | 0 | 20/20 (100%) |
| Social Data Science Major (INFO) (Sociology Track) | major | 3 | 2 | 0 | 3/4 (75%) |
| Sociology Major | major | 7 | 4 | 2 | 9/13 (69%) |
| Spanish Language, Literatures, and Culture Major (Prerequisites) | major | 3 | 1 | 0 | 3/3 (100%) |
| Spanish Language, Literatures, and Culture Major (Core sequence) | major | 5 | 4 | 2 | 16/22 (73%) |
| Spanish Language, Literatures, and Culture Major (Track 1: Spanish and Latin American Literature, Culture, and Media (15 Credits)) | major | 1 | 2 | 0 | 9/10 (90%) |
| Spanish Language, Literatures, and Culture Major (Track 2: Spanish Linguistics, Culture, and Education) | major | 3 | 2 | 0 | 3/4 (75%) |
| Spanish Language, Literatures, and Culture Major (Track 3: Spanish Language, Culture, and Professional Contexts) | major | 1 | 3 | 0 | 3/12 (25%) |
| Spanish Language, Literatures, and Culture Major (Courses for Heritage Learners) | major | 3 | 1 | 0 | 3/3 (100%) |
| Studio Art Major (Track 1: B.A. in Studio Art) | major | 6 | 9 | 1 | 6/26 (23%) |
| Studio Art Major (Track 2: B.A. in Studio Art with an Advanced Specialization) | major | 6 | 10 | 1 | 6/32 (19%) |
| Studio Art Major (Digital Media) | major | 3 | 2 | 2 | 6/8 (75%) |
| Studio Art Major (Painting) | major | 2 | 1 | 1 | 2/2 (100%) |
| Studio Art Major (Printmaking) | major | 0 | 2 | 1 | 0/5 (0%) |
| Studio Art Major (Sculpture) | major | 0 | 2 | 1 | 0/6 (0%) |
| Studio Art Major (Intermedia) | major | 1 | 2 | 2 | 1/2 (50%) |
| Studio Art Major (Track 3: B.A. in Studio Art w/ Concentration in Graphic Design) | major | 8 | 6 | 2 | 9/14 (64%) |
| Studio Art Major (Graphic Design Elective Courses) | major | 6 | 1 | 0 | 6/6 (100%) |
| Supply Chain Management Major | major | 4 | 1 | 3 | 19/20 (95%) |
| Technology and Information Design Major | major | 23 | 2 | 0 | 24/25 (96%) |
| Technology and Information Design Major | major | 6 | 3 | 0 | 6/8 (75%) |
| Theatre Major | major | 5 | 4 | 4 | 5/16 (31%) |
| Theatre Major (Performance Area) | major | 14 | 1 | 1 | 14/14 (100%) |
| Theatre Major (Design/Production Area) | major | 19 | 1 | 0 | 19/19 (100%) |
| Theatre Major (History/Theory Area) | major | 5 | 1 | 0 | 5/5 (100%) |
| Women, Gender, and Sexuality Studies Major | major | 3 | 7 | 0 | 9/133 (7%) |
| Actuarial Mathematics Minor | minor | 3 | 1 | 0 | 4/14 (29%) |
| Advanced Cybersecurity Experience for Students Minor | minor | 2 | 5 | 0 | 2/9 (22%) |
| Advanced Cybersecurity Experience for Students Minor | minor | 1 | 5 | 0 | 1/8 (13%) |
| Advanced Cybersecurity Experience for Students Minor | minor | 3 | 5 | 0 | 3/10 (30%) |
| African Studies Minor | minor | 4 | 1 | 1 | 4/27 (15%) |
| Agricultural Science and Technology Minor | minor | 18 | 1 | 0 | 20/21 (95%) |
| American Sign Language (ASL) Minor | minor | 4 | 1 | 0 | 4/17 (24%) |
| Anti-Black Racism Minor | minor | 7 | 9 | 2 | 7/20 (35%) |
| Anti-Black Racism Minor | minor | 61 | 1 | 1 | 62/62 (100%) |
| Arabic Minor | minor | 4 | 1 | 1 | 4/5 (80%) |
| Army Leadership Studies Minor | minor | 5 | 0 | 0 | 6/6 (100%) |
| Art History Minor | minor | 0 | 2 | 1 | 0/2 (0%) |
| Artificial Intelligence in Architecture Minor | minor | 5 | 0 | 0 | 5/5 (100%) |
| Arts Leadership Minor | minor | 3 | 2 | 0 | 4/10 (40%) |
| Asian American Studies Minor | minor | 2 | 5 | 2 | 4/28 (14%) |
| Astronomy Minor | minor | 3 | 1 | 1 | 15/16 (94%) |
| Atmospheric Chemistry Minor | minor | 0 | 4 | 0 | 0/15 (0%) |
| Atmospheric Sciences Minor | minor | 2 | 3 | 0 | 2/13 (15%) |
| Black Women's Studies Minor (ARHU) | minor | 2 | 0 | 0 | 8/8 (100%) |
| Black Women's Studies Minor (BSOS) | minor | 2 | 0 | 0 | 8/8 (100%) |
| Business Analytics Minor (Prerequisite Courses) | minor | 3 | 1 | 1 | 4/4 (100%) |
| Business Analytics Minor (Required Courses) | minor | 3 | 5 | 9 | 3/23 (13%) |
| Chesapeake Bay: Watersheds and Water Resources Minor (ENST) | minor | 2 | 1 | 0 | 2/20 (10%) |
| Chesapeake Bay: Watersheds and Water Resources Minor (GEPS) | minor | 2 | 1 | 0 | 2/20 (10%) |
| Chinese Studies Minor | minor | 5 | 0 | 2 | 5/5 (100%) |
| Classical Mythology Minor | minor | 2 | 1 | 0 | 2/8 (25%) |
| Climate Change Fluency Minor | minor | 2 | 1 | 0 | 2/11 (18%) |
| Computational Finance Minor (BMGT) | minor | 5 | 0 | 0 | 13/13 (100%) |
| Computational Finance Minor (CMSC) | minor | 5 | 0 | 0 | 13/13 (100%) |
| Computer Engineering Minor | minor | 5 | 0 | 0 | 15/15 (100%) |
| Computer Science Minor | minor | 6 | 0 | 2 | 34/34 (100%) |
| Construction Project Management Minor (ARCH) | minor | 5 | 0 | 4 | 12/12 (100%) |
| Construction Project Management Minor (ENGR) | minor | 5 | 0 | 4 | 12/12 (100%) |
| Creative Placemaking Minor (ARCH) | minor | 1 | 2 | 2 | 1/10 (10%) |
| Creative Placemaking Minor (ARHU) | minor | 1 | 2 | 2 | 1/10 (10%) |
| Creative Writing Minor | minor | 1 | 3 | 0 | 3/12 (25%) |
| Criminal Justice Minor at Shady Grove | minor | 17 | 0 | 0 | 21/21 (100%) |
| Data Science Minor (CMSC) | minor | 7 | 0 | 3 | 7/7 (100%) |
| Data Science Minor (MATH) | minor | 7 | 0 | 3 | 7/7 (100%) |
| Demography Minor | minor | 3 | 3 | 2 | 3/23 (13%) |
| Digital Storytelling and Poetics Minor | minor | 1 | 3 | 2 | 1/6 (17%) |
| Disability Studies Minor | minor | 3 | 0 | 3 | 22/22 (100%) |
| Earth History Minor | minor | 3 | 0 | 0 | 11/11 (100%) |
| Earth Material Properties Minor | minor | 3 | 0 | 0 | 12/12 (100%) |
| Economics Minor (Courses Required for the Minor) | minor | 2 | 3 | 1 | 2/5 (40%) |
| Education Policy, Equity, and Justice Minor (EDUC) | minor | 3 | 0 | 1 | 3/3 (100%) |
| Education Policy, Equity, and Justice Minor (PLCY) | minor | 3 | 0 | 1 | 3/3 (100%) |
| Entomology Minor | minor | 1 | 1 | 0 | 1/1 (100%) |
| Entomology Minor | minor | 7 | 1 | 0 | 7/7 (100%) |
| Entomology Minor | minor | 7 | 1 | 0 | 6/6 (100%) |
| Entomology Minor | minor | 2 | 1 | 0 | 2/2 (100%) |
| Entomology Minor | minor | 8 | 1 | 0 | 8/8 (100%) |
| Entomology Minor | minor | 10 | 1 | 0 | 10/10 (100%) |
| Entrepreneurial Leadership Minor | minor | 3 | 2 | 1 | 3/13 (23%) |
| French Studies Minor | minor | 5 | 1 | 1 | 11/12 (92%) |
| General Business Minor | minor | 4 | 2 | 2 | 4/8 (50%) |
| Geochemistry Minor | minor | 4 | 0 | 1 | 15/15 (100%) |
| Geographic Information Science Minor | minor | 4 | 1 | 0 | 19/20 (95%) |
| Geophysics Minor | minor | 3 | 0 | 1 | 16/16 (100%) |
| Global Engineering Leadership Minor | minor | 4 | 2 | 0 | 7/9 (78%) |
| Global Poverty Minor | minor | 36 | 3 | 0 | 36/68 (53%) |
| Global Terrorism Studies Minor | minor | 5 | 1 | 1 | 28/29 (97%) |
| Hearing and Speech Sciences Minor | minor | 5 | 4 | 0 | 5/16 (31%) |
| Hebrew Studies Minor (JWST) (Prerequisites) | minor | 3 | 1 | 0 | 3/3 (100%) |
| Hebrew Studies Minor (JWST) (Requirements for the Minor) | minor | 15 | 1 | 1 | 15/15 (100%) |
| Hebrew Studies Minor (SLLC) (Prerequisites) | minor | 3 | 1 | 0 | 3/3 (100%) |
| Hebrew Studies Minor (SLLC) (Requirements for the Minor) | minor | 15 | 1 | 1 | 15/15 (100%) |
| History and Theory of Architecture Minor | minor | 14 | 0 | 1 | 14/14 (100%) |
| Human Development Minor | minor | 2 | 2 | 2 | 2/6 (33%) |
| Human Development Minor (Area 1: Cognitive) | minor | 10 | 1 | 0 | 10/10 (100%) |
| Human Development Minor (Area 2: Social) | minor | 3 | 1 | 0 | 3/3 (100%) |
| Human Development Minor (Area 3: Research) | minor | 1 | 1 | 0 | 1/1 (100%) |
| Human Development Minor (Area 4: Lifespan) | minor | 8 | 1 | 0 | 8/8 (100%) |
| Humanities, Health, and Medicine Minor | minor | 2 | 8 | 2 | 3/11 (27%) |
| Hydrology Minor | minor | 4 | 0 | 0 | 11/11 (100%) |
| Information Risk Management, Ethics, and Privacy Minor | minor | 5 | 0 | 0 | 5/5 (100%) |
| Information Risk Management, Ethics, and Privacy Minor at Shady Grove | minor | 5 | 0 | 0 | 5/5 (100%) |
| International Development and Conflict Management Minor | minor | 4 | 2 | 0 | 4/6 (67%) |
| Israel Studies Minor | minor | 3 | 1 | 3 | 23/26 (88%) |
| Italian Language and Culture Minor | minor | 4 | 1 | 0 | 4/5 (80%) |
| Japanese Minor | minor | 0 | 4 | 0 | 0/24 (0%) |
| Jewish Studies Minor | minor | 0 | 4 | 0 | 0/4 (0%) |
| Kinesiology: Biomechanics and Motor Control Minor | minor | 1 | 1 | 0 | 12/13 (92%) |
| Kinesiology: Exercise Physiology Minor | minor | 1 | 1 | 0 | 12/13 (92%) |
| Kinesiology: Sport, Commerce, & Culture Minor | minor | 2 | 1 | 0 | 10/11 (91%) |
| Korean Studies Minor | minor | 0 | 2 | 3 | 0/19 (0%) |
| Landscape Management Minor | minor | 6 | 0 | 0 | 10/10 (100%) |
| Latin American and Caribbean Studies Minor | minor | 3 | 1 | 2 | 8/9 (89%) |
| Latin Language and Literature Minor | minor | 3 | 2 | 0 | 3/5 (60%) |
| Law and Society Minor | minor | 4 | 1 | 0 | 4/5 (80%) |
| Leadership Studies Minor | minor | 3 | 2 | 0 | 3/5 (60%) |
| LGBTQ Studies Minor | minor | 0 | 3 | 1 | 0/6 (0%) |
| Linguistics Minor | minor | 4 | 1 | 0 | 4/5 (80%) |
| Mathematics Minor | minor | 3 | 5 | 0 | 7/28 (25%) |
| Media, Technology and Democracy Minor | minor | 1 | 2 | 0 | 1/23 (4%) |
| Meteorology Minor | minor | 2 | 5 | 0 | 2/12 (17%) |
| Middle East Studies Minor | minor | 0 | 3 | 3 | 0/8 (0%) |
| Military Studies Minor | minor | 5 | 1 | 2 | 18/27 (67%) |
| Music and Culture Minor | minor | 5 | 2 | 3 | 5/21 (24%) |
| Music Performance Minor | minor | 5 | 2 | 0 | 5/17 (29%) |
| Naval Science Minor | minor | 0 | 3 | 1 | 0/20 (0%) |
| Neuroscience Minor (Prerequisites) | minor | 4 | 1 | 0 | 4/4 (100%) |
| Neuroscience Minor (Minor Requirements) | minor | 5 | 1 | 2 | 14/14 (100%) |
| Nonprofit Leadership and Social Innovation Minor | minor | 0 | 3 | 0 | 0/17 (0%) |
| Nuclear Engineering Minor | minor | 4 | 2 | 1 | 4/6 (67%) |
| Paleobiology Minor (ENTM) | minor | 5 | 2 | 1 | 15/29 (52%) |
| Paleobiology Minor (GEPS) | minor | 5 | 2 | 1 | 15/29 (52%) |
| Persian Studies Minor | minor | 5 | 0 | 0 | 9/9 (100%) |
| Philosophy Minor | minor | 0 | 4 | 2 | 0/4 (0%) |
| Physics Minor (Courses Required for the Minor) | minor | 5 | 0 | 0 | 21/21 (100%) |
| Planetary Sciences Minor (ASTR) | minor | 4 | 1 | 2 | 21/22 (95%) |
| Planetary Sciences Minor (GEPS) | minor | 4 | 1 | 2 | 21/22 (95%) |
| Portuguese and Brazilian Studies Minor | minor | 1 | 0 | 1 | 23/23 (100%) |
| Professional Writing Minor | minor | 1 | 2 | 2 | 1/3 (33%) |
| Project Management Minor | minor | 2 | 4 | 0 | 2/17 (12%) |
| Public Leadership Minor | minor | 1 | 1 | 1 | 3/4 (75%) |
| Quantum Science and Engineering Minor | minor | 5 | 0 | 1 | 24/24 (100%) |
| Real Estate Development Minor | minor | 4 | 1 | 2 | 4/5 (80%) |
| Religious Studies Minor | minor | 1 | 3 | 2 | 1/3 (33%) |
| Religious Studies Minor | minor | 27 | 2 | 0 | 27/28 (96%) |
| Remote Sensing of Environmental Change Minor | minor | 2 | 1 | 0 | 6/14 (43%) |
| Rhetoric Minor (COMM) | minor | 0 | 3 | 0 | 0/3 (0%) |
| Rhetoric Minor (ENGL) | minor | 0 | 3 | 0 | 0/3 (0%) |
| Robotics and Autonomous Systems Minor (CMSC) (Prerequisites) | minor | 2 | 1 | 0 | 7/7 (100%) |
| Robotics and Autonomous Systems Minor (CMSC) (Requirements) | minor | 4 | 3 | 1 | 4/39 (10%) |
| Robotics and Autonomous Systems Minor (ENGR) (Prerequisites) | minor | 2 | 1 | 0 | 7/7 (100%) |
| Robotics and Autonomous Systems Minor (ENGR) (Requirements) | minor | 4 | 3 | 1 | 4/39 (10%) |
| Russian Studies Minor | minor | 0 | 1 | 1 | 0/31 (0%) |
| Science, Technology, Ethics and Policy Minor (ENGR) (Track 1: Socio-political Dimensions of Science and Technology Development) | minor | 2 | 3 | 2 | 2/4 (50%) |
| Science, Technology, Ethics and Policy Minor (ENGR) | minor | 2 | 3 | 2 | 2/4 (50%) |
| Science, Technology, Ethics and Policy Minor (INFO) (Track 1: Socio-political Dimensions of Science and Technology Development) | minor | 2 | 3 | 2 | 2/4 (50%) |
| Science, Technology, Ethics and Policy Minor (INFO) | minor | 2 | 3 | 2 | 2/4 (50%) |
| Science, Technology, Ethics and Policy Minor (PLCY) (Track 1: Socio-political Dimensions of Science and Technology Development) | minor | 2 | 3 | 2 | 2/4 (50%) |
| Science, Technology, Ethics and Policy Minor (PLCY) | minor | 2 | 3 | 2 | 2/4 (50%) |
| Secondary Education Minor | minor | 3 | 4 | 0 | 8/35 (23%) |
| Sociology Minor | minor | 3 | 1 | 0 | 7/8 (88%) |
| Soil Science Minor | minor | 1 | 1 | 0 | 1/15 (7%) |
| Spanish Minor 1: Literature, Linguistics, and Culture | minor | 5 | 1 | 0 | 13/17 (76%) |
| Spanish Minor 2: Language, Culture, and Professional Contexts | minor | 5 | 1 | 1 | 12/21 (57%) |
| Spanish Minor 3: Heritage Language and Latina/o Culture | minor | 5 | 1 | 1 | 14/29 (48%) |
| Statistics Minor | minor | 1 | 2 | 0 | 2/16 (13%) |
| Surficial Geology Minor | minor | 4 | 0 | 0 | 14/14 (100%) |
| Survey Methodology Minor | minor | 5 | 2 | 3 | 25/26 (96%) |
| Survey Methodology Minor (Additional Survey Methodology Courses (4-5 credits)) | minor | 3 | 1 | 0 | 3/3 (100%) |
| Sustainability Studies Minor (AGNR) | minor | 1 | 1 | 3 | 1/6 (17%) |
| Sustainability Studies Minor (PLCY) | minor | 1 | 1 | 3 | 1/6 (17%) |
| Teaching English for Speakers of Other Languages (TESOL) and Dual Language Education Minor | minor | 6 | 2 | 1 | 6/8 (75%) |
| Technology Entrepreneurship and Corporate Innovation Minor | minor | 17 | 0 | 0 | 17/17 (100%) |
| Technology Innovation Leadership Minor | minor | 5 | 0 | 0 | 5/5 (100%) |
| Technology Innovation Leadership Minor at Shady Grove | minor | 5 | 0 | 0 | 5/5 (100%) |
| U.S. Latina/o Studies Minor | minor | 3 | 1 | 1 | 3/4 (75%) |
| Video Production and Documentary Filmmaking Minor | minor | 2 | 2 | 0 | 3/18 (17%) |
| Women, Gender, and Sexuality Studies Minor | minor | 2 | 2 | 2 | 8/10 (80%) |
| African American and Africana Studies Certificate | certificate | 4 | 1 | 0 | 5/6 (83%) |
| Applied Agriculture Certificate (Agricultural Business Management) | certificate | 14 | 3 | 0 | 14/21 (67%) |
| Applied Agriculture Certificate (Agricultural Leadership and Communication) | certificate | 18 | 4 | 0 | 23/31 (74%) |
| Applied Agriculture Certificate (Sustainable FOOD SYSTEMS) | certificate | 10 | 5 | 0 | 10/35 (29%) |
| Applied Agriculture Certificate (Environmental Stewardship) | certificate | 13 | 2 | 0 | 21/22 (95%) |
| Applied Agriculture Certificate (​Landscape Management) | certificate | 19 | 2 | 0 | 19/21 (90%) |
| Applied Agriculture Certificate (Ornamental Horticulture) | certificate | 16 | 3 | 0 | 16/19 (84%) |
| Applied Agriculture Certificate (Golf Course Management) | certificate | 19 | 1 | 0 | 20/20 (100%) |
| Applied Agriculture Certificate (Sports Turf Management) | certificate | 19 | 1 | 0 | 19/19 (100%) |
| Applied Agriculture Certificate (General Turfgrass Management) | certificate | 17 | 2 | 0 | 17/18 (94%) |
| East Asian Studies Certificate (HIST) | certificate | 2 | 1 | 1 | 2/17 (12%) |
| East Asian Studies Certificate (SLLC) | certificate | 2 | 1 | 1 | 2/17 (12%) |
| International Agriculture and Natural Resources Certificate | certificate | 1 | 3 | 2 | 14/17 (82%) |
| Latin American and Caribbean Studies Certificate | certificate | 4 | 1 | 2 | 8/9 (89%) |
| Leadership Studies Certificate | certificate | 5 | 2 | 0 | 5/7 (71%) |
| LGBTQ Studies Certificate | certificate | 1 | 2 | 1 | 3/6 (50%) |
| Secondary Education Certificate | certificate | 4 | 4 | 0 | 5/13 (38%) |
| Women, Gender, and Sexuality Studies Certificate | certificate | 4 | 1 | 1 | 9/10 (90%) |

## Programs with no requirement table

Nothing to draft (plan grid or prose only; see coverage-report.md).

- Bioengineering Major
- Chemical Engineering Major
- Civil Engineering Major
- Computer Engineering Major
- Electrical Engineering Major
- Electrical Engineering Major at USMSM
- Individual Studies Program
- Materials Science and Engineering Major
- Mechanical Engineering Major
- Mechanical Engineering Major at USMSM
- Music Major
- Archaeology Minor (ARTH)
- Archaeology Minor (CLAS)
- German Studies Minor
- Global Studies Minor
- Greek Language and Culture Minor
- History Minor
- Nanoscale Science and Technology Minor

## Errors

None.
