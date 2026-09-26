// Rules shared by every program of one kind, quoted from the source, as review
// notes. None of them is an audit requirement: the engine checks courses, not
// program GPAs, conduct, attendance or residence (see SOURCES.md).

export const CATALOG_YEAR = "2026-27";

export const SCHOLARS_CITATION_URL = "https://scholars.umd.edu/about/curriculum/citation-requirements";

/** Scholars citation rules, same for all 13 programs (page checked 2026-09-25). */
export const SCHOLARS_CITATION_NOTES = [
  `[manual] Timing: "Complete all courses in their program curriculum by the end of the fourth semester" (${SCHOLARS_CITATION_URL}). Not checked; the audit doesn't track which semester a course was taken relative to entry.`,
  `[manual] GPA: "Earn a minimum GPA of 3.0 in their program curriculum, with no mark of XF in any course at the end of the curriculum." A program-curriculum GPA isn't an audit requirement; the student confirms it.`,
  `[manual] Community: "Demonstrate evidence of active participation in and contribution to their program community; and Refrain from behavior destructive to that community." Not a course requirement.`,
  `[manual] Residence: Scholars "live together with others in their program" in the Cambridge Community (UMD Academic Catalog, Office of Undergraduate Studies). Housing is not a course requirement.`,
  `[check] Supporting-course lists and colloquium course numbers come from the program's "Curriculum Requirements" PDF for Fall 2026 (scholars.umd.edu/sites/default/files/2026-05/). Petitioned alternatives, AP/transfer credit the program honors, and "Scholars-only" sections (ENGL101S etc.) are not encoded.`,
];

export const HONORS_CITATION_URL = "https://honors.umd.edu/academics/honors-citation/";

/** Honors College citation rules, same for all eight Honors living-learning programs. */
export const HONORS_CITATION_NOTES = [
  `[manual] GPA: "Students must have a cumulative GPA of at least 3.2" for the Honors Citation (${HONORS_CITATION_URL}). A cumulative GPA isn't an audit requirement; the student confirms it.`,
];
