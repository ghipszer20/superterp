// The one special-program page on the Academic Catalog (Office of Undergraduate
// Studies) describes its programs in prose and ROTC sample plans (sc_plangrid),
// not requirement tables. parseProgramPage must find no requirement lists there,
// which is why every LLP and special program is transcribed by hand.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseProgramPage } from "../src/program.ts";

const html = readFileSync(new URL("./fixtures/undergraduate-studies.html", import.meta.url), "utf8");

describe("Office of Undergraduate Studies catalog page", () => {
  it("has a plan grid and prose but no requirement tables", () => {
    expect(html).toContain('class="sc_plangrid"');
    const page = parseProgramPage(html);
    expect(page.name).toBe("Office of Undergraduate Studies");
    expect(page.lists).toEqual([]);
  });
});
