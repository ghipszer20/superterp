// Agricultural Science and Technology Major, Agricultural and Extension Education Specialization
// (Teaching Certificate variant), 2026-27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/
//   plant-sciences-landscape-architecture/agricultural-science-technology-major/ (fetched 2026-09-28).
// See agst-shared-2026-27.ts for the shared Major Core Courses and common review notes; this file
// adds the Teaching Certificate variant's own requirements. The catalog's "Agricultural and
// Extension Education" specialization has two required-course tables (this one and the sibling
// Extension/Industry variant, agst-major-ag-extension-education-extension-industry-2026-27.ts).
// Encoded by hand from the catalog alone (no department page names any requirement). UNVERIFIED
// until owner sign-off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { agstCommonReviewNotes, agstCore } from "./agst-shared-2026-27.ts";

export const agstMajorAgExtensionEducationTeachingCertificate: Program = {
  id: "agst-major-ag-extension-education-teaching-certificate",
  name: "Agricultural Science and Technology Major (Agricultural and Extension Education: Teaching Certificate)",
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
    "This variant's teacher-certification steps themselves (Maryland teaching license, student- " +
      "teaching placement approval) are not course-based and are not encoded; every line in the " +
      "catalog's own table IS a specific course, however, including the capstone TLPL489 Internship " +
      "in Education, so the entire course table is encoded (nothing here is an unencodable advisor- " +
      "approval or non-course step).",
    "'Environmental Sciences and Natural Resources' names PLSC471 with a parenthetical alternative " +
      "'(or elective focused on Renewable Energy)' that names no specific course; only PLSC471 is " +
      "encoded, matching the 'never invent a course number' rule.",
    "'Power, Structural & Technical' names PLSC235 with no title text in the fetched table (a " +
      "conversion artifact, not a builder omission) alongside 'or INAG235 | Irrigation and Drainage'; " +
      "both are kept as options since the catalog names both course numbers.",
    "'BSCI121' does not appear in this variant's table (it is in the sibling Extension/Industry " +
      "table's 'Agricultural Expanded' section, not here).",
  ],
  requirements: [
    ...agstCore,
    { kind: "course", id: "ansc101-tc", name: "Principles of Animal Science (ANSC101)", options: ["ANSC101"] },
    { kind: "course", id: "ansc103-tc", name: "Principles of Animal Science Laboratory (ANSC103)", options: ["ANSC103"] },
    {
      kind: "choose",
      id: "animal-management-tc",
      name: "Animal Management Course: select one (3 credits)",
      count: 1,
      credits: 3,
      from: { courses: ["ANSC220", "ANSC232", "ANSC242", "ANSC245", "ANSC255", "ANSC262", "ANSC282"] },
    },
    { kind: "course", id: "math113-tc", name: "College Algebra and Trigonometry (MATH113)", options: ["MATH113"] },
    { kind: "course", id: "arec250-tc", name: "Elements of Agricultural and Resource Economics (AREC250)", options: ["AREC250"] },
    { kind: "course", id: "bsci160-tc", name: "Principles of Ecology and Evolution (BSCI160)", options: ["BSCI160"] },
    {
      kind: "course",
      id: "biology-lab-tc",
      name: "Principles Biology Laboratory or Ecology and Evolution Lab (BSCI180 or BSCI161)",
      options: ["BSCI180", "BSCI161"],
    },
    { kind: "course", id: "inag250-tc", name: "Fundamentals of Agricultural Mechanics (INAG250)", options: ["INAG250"] },
    {
      kind: "course",
      id: "irrigation-choice-tc",
      name: "PLSC235 or Irrigation and Drainage (INAG235)",
      options: ["PLSC235", "INAG235"],
    },
    { kind: "course", id: "plsc471-tc", name: "Forest Ecology (PLSC471)", options: ["PLSC471"] },
    {
      kind: "sets",
      id: "plant-sciences-choice-tc",
      name: "Plant Sciences: PLSC110 & PLSC111, or PLSC112 & PLSC113",
      options: [["PLSC110", "PLSC111"], ["PLSC112", "PLSC113"]],
    },
    {
      kind: "course",
      id: "food-science-choice-tc",
      name: "Food: Science and Technology, or How Safe is Your Salad (NFSC112 or PLSC115)",
      options: ["NFSC112", "PLSC115"],
    },
    { kind: "course", id: "agst440-tc", name: "Exploring Maryland Agriculture, Agricultural Industry, and Agricultural Literacy (AGST440)", options: ["AGST440"] },
    { kind: "course", id: "agst442-tc", name: "Examining Leadership in Youth and Volunteers (AGST442)", options: ["AGST442"] },
    { kind: "course", id: "edhd426-tc", name: "Cognitive and Motivational Literacy Content (EDHD426)", options: ["EDHD426"] },
    { kind: "course", id: "tlpl101-tc", name: "Inquiry Approach to Teaching STEM (TLPL101)", options: ["TLPL101"] },
    { kind: "course", id: "tlpl102-tc", name: "Inquiry Teaching of STEM in Middle School (TLPL102)", options: ["TLPL102"] },
    {
      kind: "course",
      id: "education-choice-tc",
      name: "Student-Centered Curriculum and Instruction, or Special Topics in Education (TLPL401 or TLPL488)",
      options: ["TLPL401", "TLPL488"],
    },
    { kind: "course", id: "tlpl414-tc", name: "Knowing and Learning in Mathematics and Science (TLPL414)", options: ["TLPL414"] },
    { kind: "course", id: "tlpl415-tc", name: "Perspectives in Science (TLPL415)", options: ["TLPL415"] },
    {
      kind: "course",
      id: "science-teaching-choice-tc",
      name: "Learning and Teaching in Science, or AGST425 (TLPL425 or AGST425)",
      options: ["TLPL425", "AGST425"],
    },
    { kind: "course", id: "tlpl481-tc", name: "Embracing Diversity in the Classroom Community (TLPL481)", options: ["TLPL481"] },
    { kind: "course", id: "tlpl478-tc", name: "Professional Seminar in Education (TLPL478)", options: ["TLPL478"] },
    { kind: "course", id: "tlpl479-tc", name: "Field Experiences in Education (TLPL479)", options: ["TLPL479"] },
    { kind: "course", id: "tlpl489-tc", name: "Internship in Education (TLPL489)", options: ["TLPL489"] },
  ],
};

export const agstMajorAgExtensionEducationTeachingCertificateMeta: ProgramMeta = {
  kind: "major",
  college: "AGNR",
  short: "Agricultural Science & Technology (Ag & Extension Ed: Teaching Certificate)",
  major: "agst",
  track: "Agricultural and Extension Education: Teaching Certificate",
  sources: {
    catalog:
      "https://academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/plant-sciences-landscape-architecture/agricultural-science-technology-major/",
    department: "https://psla.umd.edu/",
  },
};
