// Agricultural Science and Technology Major, Agricultural and Extension Education Specialization
// (Extension/Industry variant), 2026-27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/
//   plant-sciences-landscape-architecture/agricultural-science-technology-major/ (fetched 2026-09-28).
// See agst-shared-2026-27.ts for the shared Major Core Courses and common review notes; this file
// adds the Extension/Industry variant's own requirements. The catalog's "Agricultural and Extension
// Education" specialization has two required-course tables (this one and the sibling Teaching
// Certificate variant, agst-major-ag-extension-education-teaching-certificate-2026-27.ts).
// Encoded by hand from the catalog alone (no department page names any requirement). UNVERIFIED
// until owner sign-off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { agstCommonReviewNotes, agstCore } from "./agst-shared-2026-27.ts";

export const agstMajorAgExtensionEducationExtensionIndustry: Program = {
  id: "agst-major-ag-extension-education-extension-industry",
  name: "Agricultural Science and Technology Major (Agricultural and Extension Education: Extension/Industry)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Agricultural Science and Technology Major, " +
    "https://academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/plant-sciences-landscape-architecture/agricultural-science-technology-major/ " +
    "(fetched 2026-09-28); department pages (psla.umd.edu, one faculty profile) name no requirement " +
    "(see program-sources/agricultural-science-technology-major.md)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...agstCommonReviewNotes,
    "This variant's Animal Management Course list has six options (no ANSC255), unlike the sibling " +
      "Teaching Certificate variant's seven (which includes ANSC255), because ANSC255 (Introduction " +
      "to Aquaculture) is instead a required course here, in this variant's own 'Agricultural " +
      "Expanded' section; both lists are copied exactly as each table states them.",
    "'BSCI121' is named in the catalog table with only a credit value ('BSCI121 | 2'), no title text " +
      "(a conversion artifact, not a builder omission); kept as a valid option since the catalog names " +
      "the course number directly.",
    "The footnoted 'AGST Internship or Elective' (6 credits total: 'either two internships for a " +
      "total of 6 credits, or one internship for 3 credits and take a different elective course for 3 " +
      "credits') is printed as the same course, AGST489, on both of its rows; encoded as one 6-credit " +
      "choose over AGST489 (count: 2), which a student can satisfy with two separate AGST489 " +
      "enrollments (matching the footnote's 'two internships' reading) since the audit treats each " +
      "completed course entry as its own slot even when the course id repeats. The footnote's other " +
      "path (one AGST489 internship plus a different, unnamed 3-credit elective) is not separately " +
      "encoded since no elective course is named for it.",
  ],
  requirements: [
    ...agstCore,
    { kind: "course", id: "ansc101-ei", name: "Principles of Animal Science (ANSC101)", options: ["ANSC101"] },
    { kind: "course", id: "ansc103-ei", name: "Principles of Animal Science Laboratory (ANSC103)", options: ["ANSC103"] },
    {
      kind: "choose",
      id: "animal-management-ei",
      name: "Animal Management Course: select one (3 credits)",
      count: 1,
      credits: 3,
      from: { courses: ["ANSC220", "ANSC232", "ANSC242", "ANSC245", "ANSC262", "ANSC282"] },
    },
    { kind: "course", id: "math113-ei", name: "College Algebra and Trigonometry (MATH113)", options: ["MATH113"] },
    { kind: "course", id: "arec250-ei", name: "Elements of Agricultural and Resource Economics (AREC250)", options: ["AREC250"] },
    { kind: "course", id: "bsci160-ei", name: "Principles of Ecology and Evolution (BSCI160)", options: ["BSCI160"] },
    {
      kind: "course",
      id: "biology-lab-ei",
      name: "Principles Biology Laboratory or Ecology and Evolution Lab (BSCI180 or BSCI161)",
      options: ["BSCI180", "BSCI161"],
    },
    { kind: "course", id: "inag250-ei", name: "Fundamentals of Agricultural Mechanics (INAG250)", options: ["INAG250"] },
    {
      kind: "course",
      id: "irrigation-choice-ei",
      name: "PLSC235 or Irrigation and Drainage (INAG235)",
      options: ["PLSC235", "INAG235"],
    },
    { kind: "course", id: "plsc471-ei", name: "Forest Ecology (PLSC471)", options: ["PLSC471"] },
    {
      kind: "sets",
      id: "plant-sciences-choice-ei",
      name: "Plant Sciences: PLSC110 & PLSC111, or PLSC112 & PLSC113",
      options: [["PLSC110", "PLSC111"], ["PLSC112", "PLSC113"]],
    },
    {
      kind: "course",
      id: "food-science-choice-ei",
      name: "Food: Science and Technology, or How Safe is Your Salad (NFSC112 or PLSC115)",
      options: ["NFSC112", "PLSC115"],
    },
    { kind: "course", id: "agst442-ei", name: "Examining Leadership in Youth and Volunteers (AGST442)", options: ["AGST442"] },
    { kind: "course", id: "agst440-ei", name: "Exploring Maryland Agriculture, Agricultural Industry, and Agricultural Literacy (AGST440)", options: ["AGST440"] },
    { kind: "course", id: "tlpl101-ei", name: "Inquiry Approach to Teaching STEM (TLPL101)", options: ["TLPL101"] },
    { kind: "course", id: "tlpl102-ei", name: "Inquiry Teaching of STEM in Middle School (TLPL102)", options: ["TLPL102"] },
    {
      kind: "course",
      id: "education-choice-ei",
      name: "Special Topics in Education, or Student-Centered Curriculum and Instruction (TLPL488 or TLPL401)",
      options: ["TLPL488", "TLPL401"],
    },
    { kind: "course", id: "tlpl414-ei", name: "Knowing and Learning in Mathematics and Science (TLPL414)", options: ["TLPL414"] },
    { kind: "course", id: "ansc255-ei", name: "Introduction to Aquaculture (ANSC255)", options: ["ANSC255"] },
    { kind: "course", id: "bsci121-ei", name: "BSCI121", options: ["BSCI121"] },
    { kind: "course", id: "inag252-ei", name: "Agricultural Public Relations (INAG252)", options: ["INAG252"] },
    {
      kind: "choose",
      id: "arec-plsc-larc-elective-ei",
      name: "AREC/PLSC/LARC Restricted Elective (6 credits)",
      count: 2,
      credits: 6,
      from: { departments: ["AREC", "PLSC", "LARC"] },
    },
    {
      kind: "choose",
      id: "agst-internship-or-elective-ei",
      name: "AGST Internship or Elective: AGST489 (6 credits)",
      count: 2,
      credits: 6,
      from: { courses: ["AGST489"] },
    },
  ],
};

export const agstMajorAgExtensionEducationExtensionIndustryMeta: ProgramMeta = {
  kind: "major",
  college: "AGNR",
  short: "Agricultural Science & Technology (Ag & Extension Ed: Extension/Industry)",
  major: "agst",
  track: "Agricultural and Extension Education: Extension/Industry",
  sources: {
    catalog:
      "https://academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/plant-sciences-landscape-architecture/agricultural-science-technology-major/",
    department: "https://psla.umd.edu/",
  },
};
