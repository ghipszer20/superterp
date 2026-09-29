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
import { hebrMinor } from "../programs/hebr-minor-2026-27.ts";
import { histMajor } from "../programs/hist-major-2026-27.ts";
import { isrlMinor } from "../programs/isrl-minor-2026-27.ts";
import { italMajor } from "../programs/ital-major-2026-27.ts";
import { italMinor } from "../programs/ital-minor-2026-27.ts";
import { japnMajor } from "../programs/japn-major-2026-27.ts";
import { japnMinor } from "../programs/japn-minor-2026-27.ts";
import { koreMinor } from "../programs/kore-minor-2026-27.ts";
import { lingMinor } from "../programs/ling-minor-2026-27.ts";
import { mestMinor } from "../programs/mest-minor-2026-27.ts";
import { muscMinorCulture, muscMinorPerformance } from "../programs/musc-minors-2026-27.ts";
import { persMinor } from "../programs/pers-minor-2026-27.ts";
import { portMinor } from "../programs/port-minor-2026-27.ts";
import { ppeMajor } from "../programs/ppe-major-2026-27.ts";
import { russMajor } from "../programs/russ-major-2026-27.ts";
import { russMinor } from "../programs/russ-minor-2026-27.ts";
import { thetMajor } from "../programs/thet-major-2026-27.ts";
import { wgssMajor } from "../programs/wgss-major-2026-27.ts";
import { arabMajor } from "../programs/arab-major-2026-27.ts";
import { chinMajor } from "../programs/chin-major-2026-27.ts";
import { englMajorCreativeWriting } from "../programs/engl-major-creative-writing-2026-27.ts";
import { englMajorLanguageWritingRhetoric } from "../programs/engl-major-language-writing-rhetoric-2026-27.ts";
import { englMajorLiteraryCulturalStudies } from "../programs/engl-major-literary-cultural-studies-2026-27.ts";
import { englMajorMediaStudies } from "../programs/engl-major-media-studies-2026-27.ts";
import { imdmMajorComputing } from "../programs/imdm-major-computing-2026-27.ts";
import { imdmMajorEmergingCreatives } from "../programs/imdm-major-emerging-creatives-2026-27.ts";
import { lingMajorGrammarsCognition } from "../programs/ling-major-grammars-cognition-2026-27.ts";
import { lingMajorLanguage } from "../programs/ling-major-language-2026-27.ts";
import { romlMajorFrenchItalian } from "../programs/roml-major-french-italian-2026-27.ts";
import { romlMajorFrenchSpanish } from "../programs/roml-major-french-spanish-2026-27.ts";
import { romlMajorItalianSpanish } from "../programs/roml-major-italian-spanish-2026-27.ts";
import { spanMajorLanguageCultureProfessionalContexts } from "../programs/span-major-language-culture-professional-contexts-2026-27.ts";
import { spanMajorLinguisticsCultureEducation } from "../programs/span-major-linguistics-culture-education-2026-27.ts";
import { spanMajorLiteratureCultureMedia } from "../programs/span-major-literature-culture-media-2026-27.ts";

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

const partB = [
  hebrMinor,
  histMajor,
  isrlMinor,
  italMajor,
  italMinor,
  japnMajor,
  japnMinor,
  koreMinor,
  lingMinor,
  mestMinor,
  muscMinorCulture,
  muscMinorPerformance,
  persMinor,
  portMinor,
  ppeMajor,
  russMajor,
  russMinor,
  thetMajor,
  wgssMajor,
  arabMajor,
  chinMajor,
  englMajorCreativeWriting,
  englMajorLanguageWritingRhetoric,
  englMajorLiteraryCulturalStudies,
  englMajorMediaStudies,
  imdmMajorComputing,
  imdmMajorEmergingCreatives,
  lingMajorGrammarsCognition,
  lingMajorLanguage,
  romlMajorFrenchItalian,
  romlMajorFrenchSpanish,
  romlMajorItalianSpanish,
  spanMajorLanguageCultureProfessionalContexts,
  spanMajorLinguisticsCultureEducation,
  spanMajorLiteratureCultureMedia,
];

describe("program GPA rules (ARHU part B)", () => {
  it("encodes the stated graduation GPA per program", () => {
    expect(partB.map((p) => [p.id, p.minGpa]).sort()).toEqual(
      [
        ["hebr-minor", 2.0],
        ["hist-major", 2.0],
        ["isrl-minor", 2.0],
        ["ital-major", 2.0],
        ["ital-minor", 2.0],
        ["japn-major", 2.0],
        ["japn-minor", 2.0],
        ["kore-minor-studies", 2.0],
        ["ling-minor", 2.0],
        ["mest-minor", 2.0],
        ["musc-minor-culture", 2.0],
        ["musc-minor-performance", 2.0],
        ["pers-minor", 2.0],
        ["port-minor", 2.0],
        ["ppe-major", 2.0],
        ["russ-major", 2.0],
        ["russ-minor", 2.0],
        ["thet-major", 2.0],
        ["wgss-major", 2.0],
        ["arab-major", 2.0],
        ["chin-major", 2.0],
        ["engl-major-creative-writing", 2.0],
        ["engl-major-language-writing-rhetoric", 2.0],
        ["engl-major-literary-cultural-studies", 2.0],
        ["engl-major-media-studies", 2.0],
        ["imdm-major-computing", 2.0],
        ["imdm-major-emerging-creatives", 2.0],
        ["ling-major-grammars-cognition", 2.0],
        ["ling-major-language", 2.0],
        ["roml-major-french-italian", 2.0],
        ["roml-major-french-spanish", 2.0],
        ["roml-major-italian-spanish", 2.0],
        ["span-major-language-culture-professional-contexts", 2.0],
        ["span-major-linguistics-culture-education", 2.0],
        ["span-major-literature-culture-media", 2.0],
      ].sort(),
    );
  });
});
