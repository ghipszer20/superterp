// Table test: graduation GPA rules encoded as Program.minGpa.
import { describe, expect, it } from "vitest";
import { amstMajor } from "../programs/amst-major-2026-27.ts";
import { arabMinor } from "../programs/arab-minor-2026-27.ts";
import { arthMajor } from "../programs/arth-major-2026-27.ts";
import { arthMinor } from "../programs/arth-minor-2026-27.ts";
import { arttMajorAdvancedSpecialization } from "../programs/artt-major-advanced-specialization-2026-27.ts";
import { arttMajorGraphicDesign } from "../programs/artt-major-graphic-design-2026-27.ts";
import { arttMajorStudio } from "../programs/artt-major-studio-2026-27.ts";
import { chinStudiesMinor } from "../programs/chin-minor-2026-27.ts";
import { clasMajorHumanities } from "../programs/clas-major-humanities-2026-27.ts";
import { clasMajorLatin } from "../programs/clas-major-latin-2026-27.ts";
import { clasMajorLatinGreek } from "../programs/clas-major-latin-greek-2026-27.ts";
import { clasMinorArchaeology, clasMinorGreek, clasMinorMythology } from "../programs/clas-minors-2026-27.ts";
import {
  dancMajorEducation,
  dancMajorPerformanceChoreography,
  dancMajorProduction,
} from "../programs/danc-major-2026-27.ts";
import { frenMajor } from "../programs/fren-major-2026-27.ts";
import { frenMinor } from "../programs/fren-minor-2026-27.ts";
import { gersMinor } from "../programs/germ-minor-2026-27.ts";
import { gersMajor } from "../programs/gers-major-2026-27.ts";
import { glbcMajor } from "../programs/glbc-major-2026-27.ts";

const programs = [
  amstMajor, arabMinor, arthMajor, arthMinor, arttMajorAdvancedSpecialization, arttMajorGraphicDesign,
  arttMajorStudio, chinStudiesMinor, clasMajorHumanities, clasMajorLatin, clasMajorLatinGreek,
  clasMinorArchaeology, clasMinorGreek, clasMinorMythology, dancMajorEducation,
  dancMajorPerformanceChoreography, dancMajorProduction, frenMajor, frenMinor, gersMinor, gersMajor, glbcMajor,
];

describe("program GPA rules (ARHU part A)", () => {
  it("encodes the stated graduation GPA per program", () => {
    expect(programs.map((p) => [p.id, p.minGpa]).sort()).toEqual(
      [
        ["amst-major", 2.0], ["arab-minor", 2.0], ["arth-major", 2.0], ["arth-minor", 2.0],
        ["artt-major-advanced-specialization", 2.0], ["artt-major-graphic-design", 2.0],
        ["artt-major-studio", 2.0], ["chin-minor-studies", 2.0], ["clas-major-humanities", 2.0],
        ["clas-major-latin", 2.0], ["clas-major-latin-greek", 2.0], ["clas-minor-archaeology", 2.0],
        ["clas-minor-greek", 2.0], ["clas-minor-mythology", 2.0], ["danc-major-education", 2.0],
        ["danc-major-performance-choreography", 2.0], ["danc-major-production", 2.0],
        ["fren-major", 2.0], ["fren-minor", 2.0], ["gers-minor", 2.0], ["gers-major", 2.0], ["glbc-major", 2.0],
      ].sort(),
    );
  });
});
