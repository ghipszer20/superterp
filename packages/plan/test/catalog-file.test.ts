// The plan catalog as a static file: built once from a Schedule of Classes snapshot, served from a
// CDN, and turned back into a PlanCatalog in the browser without any text parsing.

import { describe, expect, it } from "vitest";
import { buildCatalog } from "../src/catalog.ts";
import { CATALOG_FILE_VERSION, decodeCatalogFile, encodeCatalogFile } from "../src/catalog-file.ts";
import { SPRING_2027 } from "./helpers.ts";

const catalog = buildCatalog(SPRING_2027);
const meta = { term: "202701", generatedAt: "2026-09-25T00:00:00.000Z" };

describe("catalog file", () => {
  it("round-trips every course exactly", () => {
    const file = JSON.parse(JSON.stringify(encodeCatalogFile(catalog, meta)));
    const back = decodeCatalogFile(file);
    expect(back.term).toBe("202701");
    expect([...back.catalog.keys()]).toEqual([...catalog.keys()]);
    for (const [id, course] of catalog) expect(back.catalog.get(id)).toEqual(course);
  });

  it("keeps repeatability, with and without a credit limit", () => {
    const repeatable = [...catalog.values()].filter((c) => c.repeat.kind === "repeatable");
    expect(repeatable.length).toBeGreaterThan(0);
    const back = decodeCatalogFile(JSON.parse(JSON.stringify(encodeCatalogFile(catalog, meta)))).catalog;
    for (const c of repeatable) expect(back.get(c.id)!.repeat).toEqual(c.repeat);
  });

  it("leaves out empty fields so the file stays small", () => {
    const file = encodeCatalogFile(catalog, meta);
    expect(file.v).toBe(CATALOG_FILE_VERSION);
    const cmsc250 = file.courses.find((c) => c.i === "CMSC250")!;
    expect(cmsc250).not.toHaveProperty("p");
    expect(JSON.stringify(file)).not.toContain("null");
  });

  it("rejects a file of another version", () => {
    expect(() => decodeCatalogFile({ v: 99, term: "202701", generatedAt: "", courses: [] })).toThrow(/version/);
    expect(() => decodeCatalogFile(null)).toThrow(/version/);
  });
});
