// The review tool's model: what the owner sees for each program, built from the
// catalog cache, the drafter and the hand-encoded programs.

import { copyFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cmscMajor } from "@superterp/audit/programs/cmsc-major-2026-27.ts";
import { parseProgramPage } from "../src/program.ts";
import { PROGRAM_INDEX_URL, type ProgramLink } from "../src/programs-index.ts";
import {
  HAND_ENCODED,
  buildDraftedReview,
  buildHandEncodedReview,
  cacheFileName,
  indexEntry,
  readCatalogCache,
  reviewId,
} from "../src/review.ts";
import { catalogHash, contentHash, itemKey, type Signoff } from "../src/signoff.ts";

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const CS_URL = "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/computer-science/computer-science-major/";
const CS_ID = "colleges-schools/computer-mathematical-natural-sciences/computer-science/computer-science-major";
const csLink: ProgramLink = { name: "Computer Science Major (B.S.)", url: CS_URL, kind: "major" };
const csPage = parseProgramPage(fixture("cs-major.html"));

describe("reviewId", () => {
  it("is the catalog path under /undergraduate/, unique even when programs share a last segment", () => {
    expect(reviewId(CS_URL)).toBe(CS_ID);
    expect(reviewId("https://academiccatalog.umd.edu/undergraduate/a/data-science-minor/")).not.toBe(
      reviewId("https://academiccatalog.umd.edu/undergraduate/b/data-science-minor/"),
    );
  });
});

describe("buildDraftedReview", () => {
  const review = buildDraftedReview(csLink, csPage, "2026-27");

  it("identifies the program and links the live catalog page", () => {
    expect(review).toMatchObject({ id: CS_ID, name: "Computer Science Major (B.S.)", kind: "major", source: "draft", url: CS_URL, catalogYear: "2026-27" });
  });

  it("keeps every catalog table with its rows, total and footnotes", () => {
    expect(review.tables.map((t) => t.rows.length)).toEqual(csPage.lists.map((l) => l.rows.length));
    expect(review.tables[0]!.footnotes).toEqual(Object.entries(csPage.lists[0]!.footnotes).map(([marker, text]) => ({ marker, text })));
    expect(review.tables[0]!.total).toBe(csPage.lists[0]!.total);
  });

  it("describes each drafted requirement in plain language, linked to its rows", () => {
    const math140 = review.tables[0]!.requirements.find((r) => r.id === "math140")!;
    expect(math140).toMatchObject({ name: expect.any(String), text: "MATH140", details: [], notes: [] });
    expect(csPage.lists[0]!.rows[math140.rows[0]!]).toMatchObject({ kind: "course", codes: ["MATH140"] });
  });

  it("keys each review item and links it to its rows", () => {
    const footnote = review.tables[0]!.items.find((i) => i.reason === "footnote")!;
    expect(footnote.key).toBe(itemKey(footnote));
    expect(footnote.rows.length).toBeGreaterThan(0);
  });

  it("hashes the catalog tables and the drafted requirements", () => {
    expect(review.catalogHash).toBe(catalogHash(csPage.lists));
    expect(review.requirementsHash).toMatch(/^[0-9a-f]{16}$/);
  });

  it("tallies converted and review rows and check and manual items", () => {
    const items = review.tables.flatMap((t) => t.items);
    expect(review.stats).toEqual({
      tables: csPage.lists.length,
      converted: review.tables.reduce((a, t) => a + t.stats.converted, 0),
      review: review.tables.reduce((a, t) => a + t.stats.review, 0),
      check: items.filter((i) => i.confidence === "check").length,
      manual: items.filter((i) => i.confidence === "manual").length,
    });
    expect(review.stats.converted).toBeGreaterThan(0);
  });
});

describe("hand-encoded programs", () => {
  it("lists CS, both Math tracks, Gen Ed and the university rules, with their catalog pages", () => {
    expect(HAND_ENCODED.map((h) => h.id)).toEqual([
      "hand-encoded/cmsc-major",
      "hand-encoded/math-major-traditional",
      "hand-encoded/math-major-applied",
      "hand-encoded/gen-ed",
      "hand-encoded/university",
    ]);
    expect(HAND_ENCODED[0]!.catalogUrl).toBe(CS_URL);
    expect(HAND_ENCODED.find((h) => h.id === "hand-encoded/gen-ed")!.catalogUrl).toBeNull();
  });

  it("shows the catalog tables beside the encoded requirements and its review notes", () => {
    const review = buildHandEncodedReview(HAND_ENCODED[0]!, csPage);
    expect(review).toMatchObject({ id: "hand-encoded/cmsc-major", source: "hand-encoded", url: CS_URL, catalogYear: "2026-27" });
    expect(review.tables.length).toBe(csPage.lists.length);
    expect(review.tables.every((t) => t.requirements.length === 0 && t.items.length === 0)).toBe(true);
    expect(review.encoded!.requirements.map((r) => r.id)).toEqual(cmscMajor.requirements.map((r) => r.id));
    expect(review.encoded!.items.map((i) => i.text)).toEqual(cmscMajor.reviewNotes);
    expect(review.encoded!.items[0]!.key).toBe(itemKey({ reason: "note", text: cmscMajor.reviewNotes![0]! }));
    expect(review.catalogHash).toBe(catalogHash(csPage.lists));
    expect(review.requirementsHash).toBe(contentHash(cmscMajor.requirements));
    expect(review.stats.check).toBe(cmscMajor.reviewNotes!.length);
  });

  it("has no catalog hash or tables without a catalog page", () => {
    const review = buildHandEncodedReview(HAND_ENCODED.find((h) => h.id === "hand-encoded/gen-ed")!, null);
    expect(review.catalogHash).toBeNull();
    expect(review.tables).toEqual([]);
  });
});

describe("indexEntry", () => {
  const review = buildDraftedReview(csLink, csPage, "2026-27");
  const signoff: Signoff = {
    status: "verified",
    verifiedAt: "2026-09-25",
    catalogYear: "2026-27",
    catalogHash: review.catalogHash,
    requirementsHash: review.requirementsHash,
    notes: "",
    items: {},
  };

  it("summarizes a program with its sign-off status", () => {
    expect(indexEntry(review, undefined)).toEqual({ id: CS_ID, name: review.name, kind: "major", source: "draft", stats: review.stats, status: "not-started", verifiedAt: null });
    expect(indexEntry(review, signoff)).toMatchObject({ status: "verified", verifiedAt: "2026-09-25" });
    expect(indexEntry(review, { ...signoff, catalogHash: "older" }).status).toBe("changed");
  });
});

describe("readCatalogCache", () => {
  it("reads the program index and pages from the cache directory", () => {
    const dir = mkdtempSync(join(tmpdir(), "catalog-cache-"));
    copyFileSync(new URL("./fixtures/program-index.html", import.meta.url), join(dir, cacheFileName(PROGRAM_INDEX_URL)));
    copyFileSync(new URL("./fixtures/cs-major.html", import.meta.url), join(dir, cacheFileName(CS_URL)));
    const cache = readCatalogCache(dir);
    expect(cache.programs).toContainEqual(expect.objectContaining({ url: CS_URL, kind: "major" }));
    expect(cache.page(CS_URL)).toContain("sc_courselist");
    expect(cache.page("https://academiccatalog.umd.edu/undergraduate/not-cached/")).toBeNull();
  });

  it("is empty when there is no cache (CI)", () => {
    const dir = join(mkdtempSync(join(tmpdir(), "catalog-cache-")), "missing");
    expect(readCatalogCache(dir).programs).toEqual([]);
  });

  it("names cache files like the coverage script", () => {
    expect(cacheFileName(PROGRAM_INDEX_URL)).toBe("undergraduate_programs.html");
  });
});
