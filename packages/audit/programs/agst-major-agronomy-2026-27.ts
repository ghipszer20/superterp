// Agricultural Science and Technology Major, Agronomy Specialization, 2026-27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/
//   plant-sciences-landscape-architecture/agricultural-science-technology-major/ (fetched 2026-09-28).
// See agst-shared-2026-27.ts for the shared Major Core Courses and common review notes; this file
// adds the Agronomy specialization's own requirements.
// Encoded by hand from the catalog alone (no department page names any requirement). UNVERIFIED
// until owner sign-off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { agstCommonReviewNotes, agstCore } from "./agst-shared-2026-27.ts";

export const agstMajorAgronomy: Program = {
  id: "agst-major-agronomy",
  name: "Agricultural Science and Technology Major (Agronomy Specialization)",
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
    "Agronomy's 'Upper level restricted electives' has five separate lines, three of which are " +
      "identically worded 'AGST or PLSC Restricted Elective' (3 credits each, 300-level or above); " +
      "collapsed into one 9-credit choose (`upper-elective-agst-plsc-x3`) rather than three duplicate " +
      "single-course requirements, since the filter is identical for all three.",
    "The 'Multidiscipline Restricted Elective' line is restricted, per its own footnote, to " +
      "'Education, Computer Science or Policy' (the table row itself says 'Computer Application', " +
      "the footnote says 'Computer Science' -- read as the footnote's wording since it is the more " +
      "specific of the two). No UMD subject prefix is named in the source for any of the three areas; " +
      "encoded as departments EDCP (Education), CMSC (Computer Science) and PLCY (Policy) as the best-" +
      "match real UMD subject codes, but this is the builder's inference, not a catalog-stated code. " +
      "Please confirm the intended subjects before verifying (`multidiscipline-elective` in this file).",
    "Every 'This course will be chosen in consultation with the academic advisor' restricted-elective " +
      "line (footnote 1, all five 'Upper level restricted electives' rows) is encoded as a department/ " +
      "number-range choose rather than left out, since each names its eligible department(s) even " +
      "though the specific course is left to advising.",
  ],
  requirements: [
    ...agstCore,
    { kind: "course", id: "math115-agron", name: "Precalculus (MATH115)", options: ["MATH115"] },
    { kind: "course", id: "bsci160-agron", name: "Principles of Ecology and Evolution (BSCI160)", options: ["BSCI160"] },
    {
      kind: "course",
      id: "biology-lab-agron",
      name: "Principles Biology Laboratory or Ecology and Evolution Lab (BSCI180 or BSCI161)",
      options: ["BSCI180", "BSCI161"],
    },
    { kind: "course", id: "plsc112-agron", name: "Introductory Crop Science (PLSC112)", options: ["PLSC112"] },
    { kind: "course", id: "plsc113-agron", name: "Introductory Crop Science Laboratory (PLSC113)", options: ["PLSC113"] },
    { kind: "course", id: "ansc101-agron", name: "Principles of Animal Science (ANSC101)", options: ["ANSC101"] },
    { kind: "course", id: "ansc103-agron", name: "Principles of Animal Science Laboratory (ANSC103)", options: ["ANSC103"] },
    { kind: "course", id: "agst400-agron", name: "Advanced Crop Science (AGST400)", options: ["AGST400"] },
    {
      kind: "course",
      id: "agst401-agron",
      name: "Tractor and Equipment Operation, Safety and Maintenance (AGST401)",
      options: ["AGST401"],
    },
    { kind: "course", id: "arec306-agron", name: "Farm Management and Sustainable Food Production (AREC306)", options: ["AREC306"] },
    {
      kind: "choose",
      id: "animal-management-agron",
      name: "Animal Management Course: Select one (3 credits)",
      count: 1,
      credits: 3,
      from: { courses: ["ANSC220", "ANSC232", "ANSC242", "ANSC245", "ANSC255", "ANSC262", "ANSC282"] },
    },
    {
      kind: "choose",
      id: "upper-elective-agst-plsc-ansc",
      name: "AGST, PLSC or ANSC Restricted Elective, 300-level or above (3 credits)",
      count: 1,
      credits: 3,
      from: { departments: ["AGST", "PLSC", "ANSC"], minNumber: 300 },
    },
    {
      kind: "choose",
      id: "upper-elective-arec-bmgt",
      name: "AREC or BMGT Restricted Elective, 300-level or above (3 credits)",
      count: 1,
      credits: 3,
      from: { departments: ["AREC", "BMGT"], minNumber: 300 },
    },
    {
      kind: "choose",
      id: "upper-elective-agst-plsc-x3",
      name: "AGST or PLSC Restricted Electives, 300-level or above: three courses (9 credits)",
      count: 3,
      credits: 9,
      from: { departments: ["AGST", "PLSC"], minNumber: 300 },
    },
    {
      kind: "choose",
      id: "upper-elective-enst",
      name: "ENST Restricted Elective, 300-level or above (3 credits)",
      count: 1,
      credits: 3,
      from: { departments: ["ENST"], minNumber: 300 },
    },
    {
      kind: "choose",
      id: "multidiscipline-elective",
      name: "Multidiscipline Restricted Elective: Education, Computer Science or Policy (3 credits)",
      count: 1,
      credits: 3,
      from: { departments: ["EDCP", "CMSC", "PLCY"] },
    },
    { kind: "course", id: "plsc389-agron", name: "Internship (PLSC389)", options: ["PLSC389"] },
    { kind: "course", id: "plsc460-agron", name: "Application of Knowledge in Plant Sciences (PLSC460)", options: ["PLSC460"] },
  ],
};

export const agstMajorAgronomyMeta: ProgramMeta = {
  kind: "major",
  college: "AGNR",
  short: "Agricultural Science & Technology (Agronomy)",
  major: "agst",
  track: "Agronomy",
  defaultTrack: true,
  sources: {
    catalog:
      "https://academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/plant-sciences-landscape-architecture/agricultural-science-technology-major/",
    department: "https://psla.umd.edu/",
  },
};
