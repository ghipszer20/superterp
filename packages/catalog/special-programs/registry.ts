// Every living-learning program (LLP) and special program found on UMD's own
// sites (see SOURCES.md), with how each was drafted. None is a catalog
// requirement table: they are hand-transcribed from prose pages and PDFs, or
// not drafted, with the reason.

import type { Program } from "@superterp/audit";
import { honorsAces } from "./honors-aces-2026-27.ts";
import { honorsDcc } from "./honors-dcc-2026-27.ts";
import { honorsGemstone } from "./honors-gemstone-2026-27.ts";
import { honorsHglo } from "./honors-hglo-2026-27.ts";
import { honorsHumanities } from "./honors-humanities-2026-27.ts";
import { honorsIbh } from "./honors-ibh-2026-27.ts";
import { honorsIls } from "./honors-ils-2026-27.ts";
import { honorsUh } from "./honors-uh-2026-27.ts";
import { carillon } from "./llp-carillon-2026-27.ts";
import { flexus, virtus } from "./llp-flexus-virtus-2026-27.ts";
import { languageHouse } from "./llp-language-house-2026-27.ts";
import { writersHouse } from "./llp-writers-house-2026-27.ts";
import { scholarsArts } from "./scholars-arts-2026-27.ts";
import { scholarsBse } from "./scholars-bse-2026-27.ts";
import { scholarsCesg } from "./scholars-cesg-2026-27.ts";
import { scholarsDj } from "./scholars-dj-2026-27.ts";
import { scholarsEte } from "./scholars-ete-2026-27.ts";
import { scholarsGph } from "./scholars-gph-2026-27.ts";
import { scholarsIs } from "./scholars-is-2026-27.ts";
import { scholarsJlt } from "./scholars-jlt-2026-27.ts";
import { scholarsLs } from "./scholars-ls-2026-27.ts";
import { scholarsMedia } from "./scholars-media-2026-27.ts";
import { scholarsPl } from "./scholars-pl-2026-27.ts";
import { scholarsSgc } from "./scholars-sgc-2026-27.ts";
import { scholarsSts } from "./scholars-sts-2026-27.ts";
import { fire } from "./special-fire-2026-27.ts";
import { umdFellows } from "./special-umd-fellows-2026-27.ts";

export type SpecialKind = "scholars" | "honors" | "llp" | "special";

/** hand: transcribed into a Program; none: not drafted (why says so). No LLP page is a catalog table. */
export type Drafting = "hand" | "none";

export type SpecialEntry = {
  name: string;
  kind: SpecialKind;
  /** The page (or PDF) stating the requirements, or the program's main page when there is none. */
  source: string;
  drafting: Drafting;
  program?: Program;
  /** Why nothing is drafted. */
  why?: string;
};

const hand = (kind: SpecialKind, program: Program): SpecialEntry => ({
  name: program.name,
  kind,
  source: program.source!,
  drafting: "hand",
  program,
});

const none = (kind: SpecialKind, name: string, source: string, why: string): SpecialEntry => ({ name, kind, source, drafting: "none", why });

const UGST_CATALOG = "https://academiccatalog.umd.edu/undergraduate/colleges-schools/undergraduate-studies/";

export const specialPrograms: SpecialEntry[] = [
  // College Park Scholars (13 programs)
  ...[
    scholarsArts, scholarsBse, scholarsCesg, scholarsDj, scholarsEte, scholarsGph, scholarsIs,
    scholarsJlt, scholarsLs, scholarsMedia, scholarsPl, scholarsSgc, scholarsSts,
  ].map((p) => hand("scholars", p)),

  // Honors College living-learning programs (8)
  ...[honorsAces, honorsDcc, honorsGemstone, honorsHglo, honorsHumanities, honorsIls, honorsIbh, honorsUh].map((p) => hand("honors", p)),

  // Other living-learning programs
  hand("llp", carillon),
  hand("llp", flexus),
  hand("llp", virtus),
  hand("llp", writersHouse),
  hand("llp", languageHouse),
  none(
    "llp",
    "BioFIRE",
    "https://cmns.umd.edu/undergraduate/future-students/living-learning-special-programs/biofire",
    "No course ids or completion requirements are published: the page says only \"Enroll in a one-credit fall and spring seminar\" and take first-year science courses with the cohort.",
  ),

  // Other special programs
  hand("special", fire),
  hand("special", umdFellows),
  none(
    "special",
    "Persian Flagship Program",
    "https://sllc.umd.edu/special-programs/arabic-persian/persian-flagship",
    "No public requirements page: the program pages describe the Language Flagship, funding and a capstone, but list no required courses or credits.",
  ),
  none(
    "special",
    "Southern Management Leadership Program",
    "https://www.smlp.umd.edu/",
    "No stated program requirements: the catalog describes SMLP470–SMLP474 as courses restricted to the program but never says which are required.",
  ),
  none(
    "special",
    "Air Force ROTC",
    UGST_CATALOG,
    "Commissioning program whose requirements are set by the Air Force; the catalog lists no course requirements beyond the Leadership Laboratory (ARSC059) and cadet standards.",
  ),
  none(
    "special",
    "Army ROTC",
    UGST_CATALOG,
    "Commissioning program; its academic part (ARMY301, ARMY302, ARMY401, ARMY402 and military history) is the catalog's Army Leadership Studies minor, which the catalog pipeline drafts.",
  ),
  none(
    "special",
    "Naval ROTC",
    UGST_CATALOG,
    "Commissioning program; the catalog gives sample plans (\"Navy Option students typically will take\") and requirement categories (calculus, physics, English) rather than a course list. The Naval Science minor is drafted by the catalog pipeline.",
  ),
  none(
    "special",
    "C.D. Mote Jr. Incentive Awards Program",
    UGST_CATALOG,
    "A scholarship and mentoring program with no academic course requirements.",
  ),
  none(
    "special",
    "Departmental Honors Programs",
    "https://honors.umd.edu/academics/departmental-honors/",
    "Out of scope for this pass: over 40 programs, each defined by its department (usually on the major's catalog page, which the catalog pipeline drafts).",
  ),
];
