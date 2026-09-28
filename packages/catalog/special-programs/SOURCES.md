# Sources: living-learning and special programs

Found 2026-09-25 from UMD's own sites. Raw pages and PDFs are cached (git-ignored) in
`packages/catalog/.cache/special/` by `scripts/fetch-special.ts`: one request at a time, 500 ms apart,
each page fetched once.

## Where the list comes from

- **Department of Resident Life, "Living-Learning Programs"** (https://reslife.umd.edu/explore-halls/living-learning-programs):
  ACES, BioFIRE, Carillon Communities, College Park Scholars, Design Cultures & Creativity, Flexus, Gemstone,
  Honors College, Honors Humanities, Integrated Life Sciences, Interdisciplinary Business Honors,
  Jiménez-Porter Writers' House, Language House, University Honors, Virtus.
- **Office of Undergraduate Studies, "Living Learning Programs"** (https://ugst.umd.edu/llsop/index.html):
  the same programs plus **FIRE** ("living-learning and other special programs such as FIRE").
- **Honors College, "Programs at a Glance"** (https://honors.umd.edu/living-learning-programs/honors-living-learning-programs-at-a-glance-1/)
  and **"Honors Citation"** (https://honors.umd.edu/academics/honors-citation/, which links each program's
  citation requirements): ACES, DCC, Gemstone, HGLO, Honors Humanities, ILS, IBH, University Honors.
- **College Park Scholars, "Citation Requirements"** (https://scholars.umd.edu/about/curriculum/citation-requirements):
  the 13 programs and a "Curriculum Requirements" PDF for each (Fall 2026 PDFs uploaded 2026-05).
- **UMD Academic Catalog 2026-27, Office of Undergraduate Studies**
  (https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/): Carillon,
  Scholars (13 programs listed), Honors College, UMD Fellows Program, Southern Management Leadership Program,
  Incentive Awards, the ROTC programs, and the Global Studies minors.
- **SLLC special programs** (https://sllc.umd.edu/special-programs): Language House, Persian Flagship,
  Summer Language Institutes.
- **Honors College, "Departmental Honors"** (https://honors.umd.edu/academics/departmental-honors/, fetched 2026-09-26):
  the "Departmental Honors contacts" list of 39 department (or college-wide) programs, each with its own
  requirements page (see "Departmental honors programs" below).

**Renamed or gone (not missing):**
- CIVICUS relaunched in Fall 2024 as the Scholars program **Civic Engagement for Social Good** (Scholars news, 2024-01-29).
- **Honors Global Communities** is now **Honors Global Challenges & Solutions (HGLO)**; the catalog course prefix is still titled "HGLO - Honors Global Communities".
- The Scholars program **Science, Discovery and the Universe** has no curriculum after 2021.
- **Business, Society and the Economy** is now **Business, Society and Entrepreneurship**.
- The only **Language Flagship** program at UMD is Persian. Arabic has Summer Language Institutes, not a Flagship.

**Not LLPs, covered elsewhere:** the Global Studies minors (International Development and Conflict Management,
International Engineering, Global Poverty, Global Terrorism Studies) and the ROTC-related minors are catalog
minors with requirement tables, so the catalog pipeline drafts them. The First Year Book Program, National
Scholarships Office and Academic Common Market are not programs with requirements.

**No CourseLeaf tables:** none of these requirement pages is a catalog `sc_courselist` table. The one catalog
page (Office of Undergraduate Studies) has only `sc_plangrid` sample plans for ROTC, which `parseProgramPage`
correctly ignores (see `test/special-sources.test.ts`). So everything is transcribed by hand.

## Departmental honors programs

The Honors College's "Departmental Honors contacts" list (https://honors.umd.edu/academics/departmental-honors/)
names 39 department or college-wide programs, each with its own director and (usually) its own requirements page
on the department's site — not the Academic Catalog, and not one shared format. This pass adds a `"departmental"`
`SpecialKind` (report label "Departmental Honors") for them, drafting every one whose page names specific course
ids; the rest are `none` entries quoting why (no course ids published, or the department's site did not respond
to a fetch as of 2026-09-26 — see the per-program `why` in `registry.ts`). GPA minimums, thesis documents, oral
defenses and faculty/committee approvals are never audit requirements; they are `[manual]` review notes.

Four department sites (`ccjs.umd.edu`, `hesp.umd.edu`, `socy.umd.edu`, `neur.umd.edu`) timed out on every attempt
(`fetch failed` / `UND_ERR_CONNECT_TIMEOUT`) as of 2026-09-26 even though sibling BSOS/CMNS domains and the
department's own root page (where checked) responded. A retry on 2026-09-27 found all four sites reachable again:
Criminology & Criminal Justice, Hearing & Speech Sciences and Neuroscience each publish specific course ids and
are now drafted by hand. Sociology's page is reachable too, but (as on other prose-only pages, e.g. Astronomy)
publishes no course ids, credits or thesis requirement, so it stays a `none` entry, now citing that rather than
the earlier fetch failure.

## Programs

Format: **PDF** = a PDF checklist (hand-transcribed); **prose** = an HTML page of prose, lists or a plain HTML
table (hand-transcribed); **none** = no requirement list published.

| Name | Kind | Requirement page | What it contains | Format | Year / date |
| --- | --- | --- | --- | --- | --- |
| College Park Scholars: Arts | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsArts2026.pdf | Colloquia CPSA100–201, practicum (one of 3), 3 supporting courses from a list or 12 approved prefixes, DVCC/DVUP rule | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Business, Society and Entrepreneurship | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsBSE2026_0.pdf | Colloquia, BMGT161, BMGT461S, CPBE225, practicum, one DVCC/DVUP course | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Civic Engagement for Social Good | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsCESG2026_0.pdf | Colloquia, CPCV225, CHSE228C, practicum, one supporting course from a list | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Data Justice | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsDJ2026_1.pdf | Colloquia, INST204S, practicum, one supporting course from a list | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Environment, Technology and Economy | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsETE2026_0.pdf | Colloquia, practicum, two supporting courses from a 150-course list, AP exception | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Global Public Health | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsGPH2026.pdf | Colloquia, FMSC110S, CPGH210, two proposed supporting courses (examples only) | PDF | Fall 2026 (2026-05) |
| College Park Scholars: International Studies | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsIS2026.pdf | Colloquia, GVPT200 or 241, practicum, dialogue course, one supporting course | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Justice and Legal Thought | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsJLT2026.pdf | Colloquia, MLAW100, MLAW150, practicum, one supporting course (one is a two-course pair) | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Life Sciences | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsLS2026.pdf | Colloquia, BSCI160/170/180S, CHEM131/132S, CMNS100, CPSF230; regular grading | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Media, Self and Society | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsMedia2026.pdf | Colloquia, CPMS225, practicum, two supporting courses with "or" groups | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Public Leadership | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsPL2026_0.pdf | Colloquia, PLCY201S, an FSOC course, a practicum described in prose | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Science and Global Change | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsSGC2026_0.pdf | Colloquia, practicum, CDP (DVCC/DVUP) course, supporting courses A/B/C from lists | PDF | Fall 2026 (2026-05) |
| College Park Scholars: Science, Technology and Society | Scholars | https://scholars.umd.edu/sites/default/files/2026-05/CurriculumRequirementsSTS2026.pdf | Colloquia, practicum (one of 6), capstone, one supporting course from a 110-course list | PDF | Fall 2026 (2026-05) |
| Advanced Cybersecurity Experience for Students (ACES) | Honors | https://aces.umd.edu/llp-course-requirements | HACS100/101/200, two HACS208 seminars, 3 credits of HACS287/297; 15 credits | prose | undated, fetched 2026-09-25 |
| Design Cultures & Creativity | Honors | https://dcc.umd.edu/learning/curriculum/ | HDCC105/106/201/208/209 + a 3-credit option; C- in HDCC; 16 credits | prose | undated (mentions Fall 2026), fetched 2026-09-25 |
| Gemstone | Honors | https://www.gemstone.umd.edu/current-students/earning-gemstone-citation | GEMS101–497 (17 credits), C- minimum, team thesis | prose | undated, fetched 2026-09-25 |
| Honors Global Challenges & Solutions | Honors | https://hglo.umd.edu/currentstudents/academicrequirements | Links the "Advising Guide for Fall 2026 Incoming Cohort" (Google Doc): HGLO100/101, GVPT201, two tracks, a supporting course; C- | prose | Fall 2026 cohort guide |
| Honors Humanities | Honors | https://arhu.umd.edu/academics/undergraduate-studies/living-and-learning-programs/honors-humanities/prospective-students/academics | HHUM105/106/205/206 + a 3-credit experience; C- in each | prose | undated, fetched 2026-09-25 |
| Integrated Life Sciences | Honors | https://www.ils.umd.edu/courses | HLSC100/280/322/102 + one fall and one spring second-year course; 16 credits | prose (HTML table) | undated, fetched 2026-09-25 |
| Interdisciplinary Business Honors | Honors | https://ibh.umd.edu/academics | HBUS100/105/200/205 + one elective; 15 credits | prose | undated, fetched 2026-09-25 |
| University Honors | Honors | https://universityhonors.umd.edu/curriculum/ | HNUH100, HNUH300, two HNUH2xx pairs (12 credits); cluster/track lists on sub-pages | prose | Fall 2026–Spring 2028 clusters, fetched 2026-09-25 |
| Carillon Communities | Other LLP | https://carillon.umd.edu/carillon-experience/year-carillon | Studio (CRLN101) + a 3-credit community course (no id published) | prose | undated, fetched 2026-09-25 |
| Flexus: Women in Engineering | Other LLP | https://eng.umd.edu/women/current-students/communities/flexus | Four 1-credit seminars ENED115, ENES114/116, ENED215, ENES214/216 | prose (HTML table) | Fall 2026 cohort, fetched 2026-09-25 |
| Virtus: Men in Engineering | Other LLP | https://eng.umd.edu/women/current-students/communities/virtus | Same four seminars as Flexus | prose (HTML table) | Fall 2026 cohort, fetched 2026-09-25 |
| Jiménez-Porter Writers' House | Other LLP | https://arhu.umd.edu/academics/undergraduate-studies/living-and-learning-programs/jimenez-porter-writers-house/current-students/handbook | Notation track: ARHU300/309/318/319/320 + a supporting course from a list; B or better; 12 credits | prose | undated, fetched 2026-09-25 |
| Language House | Other LLP | https://sllc.umd.edu/special-programs/language-house/info-current-students-mentors | SLLC329 each semester + a 3-credit target-language course with B or better | prose | undated, fetched 2026-09-25 |
| BioFIRE | Other LLP | https://cmns.umd.edu/undergraduate/future-students/living-learning-special-programs/biofire | "a one-credit fall and spring seminar" (no course ids) | none | fetched 2026-09-25 (the CMNS LLP index returned HTTP 403) |
| FIRE: First-Year Innovation & Research Experience | Other special program | https://www.fire.umd.edu/about | FIRE120, FIRE198, FIRE298 | prose | undated, fetched 2026-09-25 |
| UMD Fellows Program | Other special program | https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/ | Seminar (13 cross-listed options), internship FGSM398/HNUH398P, two approved supporting courses; 3.0 GPA to apply | prose (catalog) | 2026-27 catalog |
| Persian Flagship Program | Other special program | https://sllc.umd.edu/special-programs/arabic-persian/persian-flagship | Program description, capstone projects; no requirements list | none | fetched 2026-09-25 |
| Southern Management Leadership Program | Other special program | https://www.smlp.umd.edu/ | Catalog lists SMLP470–474 (restricted to the program); no stated requirements | none | 2026-27 catalog |
| Air Force ROTC | Other special program | https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/ | GMC/POC structure, Leadership Laboratory ARSC059, cadet standards | none | 2026-27 catalog |
| Army ROTC | Other special program | https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/ | ARMY105–402 plan grid (24 credits) + military history; = Army Leadership Studies minor | none | 2026-27 catalog |
| Naval ROTC | Other special program | https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/ | Sample NAVY plans, NAVY108 lab each term, categories of core courses | none | 2026-27 catalog |
| C.D. Mote Jr. Incentive Awards Program | Other special program | https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/ | Scholarship and mentoring; no course requirements | none | 2026-27 catalog |
| Departmental Honors: Aerospace Engineering | Departmental Honors | https://aero.umd.edu/undergraduate/ae-honors-program | ENAE283H, ENAE410H, ENAE423H, ENAE398H (3cr) | prose | undated, fetched 2026-09-26 |
| Departmental Honors: American Studies | Departmental Honors | https://amst.umd.edu/academic-programs/undergraduate/honors-program | 6 credits of AMST388 (thesis); flexible 6-credit coursework not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Anthropology | Departmental Honors | https://anth.umd.edu/undergraduate/honors-program | ANTH485, ANTH486, ANTH487 (9 credits) | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Art | Departmental Honors | https://art.umd.edu/academic-programs/honors-programs | ARTT480H, ARTT498H; two unlisted studio honors electives not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Art History & Archaeology | Departmental Honors | https://arthistory.umd.edu/academics/undergraduate/honors | ARTH498 (2cr), ARTH499 (3cr) | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Astronomy | Departmental Honors | https://www.astro.umd.edu/undergrad/major.html | No course ids: research project, written report, oral exam | none | undated, fetched 2026-09-26 |
| Departmental Honors: Bioengineering | Departmental Honors | https://bioe.umd.edu/undergraduate/honors | BIOE399H (6cr), BIOE489H (3 semesters); 1 600-level elective not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Biology | Departmental Honors | https://biology.umd.edu/undergraduate/current-students/honors/program-requirements | BSCI399H (research), BSCI398H (seminar), each semester; no fixed credit total | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Cell Biology & Molecular Genetics | Departmental Honors | https://cbmg.umd.edu/education/undergraduate/undergrad-honors/ | BSCI379H (6cr), BSCI378H (3cr); 7cr of approved lecture courses not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Chemistry and Biochemistry | Departmental Honors | https://www.chem.umd.edu/undergraduateprogram/current-students/chemistry-biochemistry-honors-program | CHEM399 (3cr), CHEM398 (final semester) | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Communication | Departmental Honors | https://communication.umd.edu/academics/undergraduate/honors | COMM399 (6 credits); admissions currently suspended | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Electrical and Computer Engineering | Departmental Honors | https://www.eng.umd.edu/current/honors-program | HTTP 403 on ECE's own page; ECE participates in the Clark School's shared Engineering Honors Program | none | fetched 2026-09-26 |
| Departmental Honors: Engineering (Clark School) | Departmental Honors | https://www.eng.umd.edu/current/honors-program | ENES480, ENES481 (1cr each); research course from a 9-course department list | prose | undated, fetched 2026-09-26 |
| Departmental Honors: English | Departmental Honors | https://www.english.umd.edu/academics/undergraduate/honors | ENGL370, ENGL373, ENGL495, ENGL428 (twice); 12 credits | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Entomology | Departmental Honors | https://entomology.umd.edu/honors-program.html | BSCI389H (6 credits); flexible 2-course requirement not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Environmental Science and Policy | Departmental Honors | https://www.ensp.umd.edu/research/honors-ensp | ENSP499 (6 credits); flexible 9-credit coursework not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Economics | Departmental Honors | https://www.econ.umd.edu/undergraduate/departmental-honors-program | ECON396, ECON397 | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Geology | Departmental Honors | https://www.geol.umd.edu/undergraduate/ugdhonors.php | GEOL497H (3cr), GEOL393 (3cr), GEOL394 (3cr); 6cr elective not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Germanic Studies | Departmental Honors | https://sllc.umd.edu/fields/german/undergraduate/honors | GERS398H (3cr), GERS499H (3cr); flexible 6-credit coursework not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Government & Politics | Departmental Honors | https://gvpt.umd.edu/undergraduate/gvpt-honors-program | GVPT396, GVPT397; flexible 2-course requirement not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: History | Departmental Honors | https://history.umd.edu/academics/undergraduate/honors | HIST395, HIST396, HIST398, HIST399 (12 credits) | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Kinesiology | Departmental Honors | https://sph.umd.edu/academics/departments-units/department-kinesiology/student-resources-kinesiology/kinesiology-honors-program | KNES478 (3cr), KNES476 (3cr), KNES477 (3cr); flexible 6cr not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Mathematics | Departmental Honors | https://www-math.umd.edu/undergraduate/opportunities.html?id=101 | Thesis option: 2 breadth courses from a 9-course list, 6 credits of MATH498 | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Physics | Departmental Honors | https://umdphysics.umd.edu/academics/undergraduate/ugrad-phys-honors.html | Research course (3cr) from a 4-course list; 3cr H-version course not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Psychology | Departmental Honors | https://psyc.umd.edu/undergraduate/psyc-honors-program | PSYC468H (3cr), PSYC469H, PSYC498H, PSYC499H | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Spanish & Portuguese | Departmental Honors | https://sllc.umd.edu/fields/spanish/undergraduate/honors | SPAN479 (6 credits); flexible "H"-version coursework not drafted | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Women, Gender, and Sexuality Studies | Departmental Honors | https://wgss.umd.edu/academic-programs/undergraduate/experiential-learning | WGSS487 (3cr), WGSS489A (6cr) | prose | undated, fetched 2026-09-26 |
| Departmental Honors: Agriculture & Natural Resources | Departmental Honors | https://agnr.umd.edu/academics/undergraduate-honors | College-wide; "DEPARTMENTAL 388" varies by major, not enumerable | none | undated, fetched 2026-09-26 |
| Departmental Honors: Behavioral and Community Health | Departmental Honors | https://sph.umd.edu/academics/departments-units/department-behavioral-and-community-health/student-resources-and-programs-behavioral-and-community-health/undergraduate-student-resources-community-health | No honors section on the linked page | none | fetched 2026-09-26 |
| Departmental Honors: Criminology & Criminal Justice | Departmental Honors | https://ccjs.umd.edu/undergraduate/undergraduate-honors-program | CCJS388H, CCJS389H, CCJS489H (6cr, fall+spring senior year); min grade B | prose | undated, fetched 2026-09-27 |
| Departmental Honors: Computer Science | Departmental Honors | https://undergrad.cs.umd.edu/honors/requirements | No enumerated qualifying/honors course list; research credit "not strictly required" | none | undated, fetched 2026-09-26 |
| Departmental Honors: Family Health | Departmental Honors | https://sph.umd.edu/academics/departments-units/department-family-science/student-resources-family-science/undergraduate-student-resources-family-health | No course ids: "special honors courses... honors option work" | none | fetched 2026-09-26 |
| Departmental Honors: French | Departmental Honors | https://sllc.umd.edu/fields/french | No dedicated honors-program page found | none | fetched 2026-09-26 |
| Departmental Honors: Hearing & Speech Sciences | Departmental Honors | https://hesp.umd.edu/undergraduate/honors-hearing-and-speech-sciences-undergraduate-students | HESP468H (3cr), HESP499H (3cr), HESP469A, HESP469B, one of PSYC200/EDMS451/BIOM301 | prose | undated, fetched 2026-09-27 |
| Departmental Honors: Human Development | Departmental Honors | https://education.umd.edu/human-development-honors-program | No course ids published | none | fetched 2026-09-26 |
| Departmental Honors: Linguistics | Departmental Honors | https://linguistics.umd.edu/academic-programs/undergraduate/honors-programs | LING499 only "optional"; no required course | none | fetched 2026-09-26 |
| Departmental Honors: Neuroscience | Departmental Honors | https://neur.umd.edu/opportunities/honors-requirements | NEUR379H/479H (9cr research), NEUR398H seminar | prose | undated, fetched 2026-09-27 |
| Departmental Honors: Philosophy | Departmental Honors | https://philosophy.umd.edu/ | No honors page found; directory links only the department homepage | none | fetched 2026-09-26 |
| Departmental Honors: Sociology | Departmental Honors | https://socy.umd.edu/undergraduate/honors-program | Reachable but prose-only: eligibility GPA only, no course ids | none | fetched 2026-09-27 |
