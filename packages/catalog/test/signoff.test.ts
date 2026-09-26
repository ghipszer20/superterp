// Owner sign-offs (PROJECT_MEMORY.md section 6, steps 5 and 6): stored in a committed
// JSON file, with hashes that mark a program "changed since verified" when the
// catalog tables or the drafted requirements change.

import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseProgramPage } from "../src/program.ts";
import {
  applyUpdate,
  catalogHash,
  contentHash,
  itemKey,
  parseSignoffs,
  readSignoffs,
  reviewStatus,
  serializeSignoffs,
  updateSignoffs,
  type Signoff,
  type Signoffs,
} from "../src/signoff.ts";

const csHtml = readFileSync(new URL("./fixtures/cs-major.html", import.meta.url), "utf8");
const current = { catalogYear: "2026-27", catalogHash: "cat1", requirementsHash: "req1" };
const verified: Signoff = {
  status: "verified",
  verifiedAt: "2026-09-25",
  catalogYear: "2026-27",
  catalogHash: "cat1",
  requirementsHash: "req1",
  notes: "",
  items: {},
};

describe("catalogHash", () => {
  it("is the same for the same tables", () => {
    expect(catalogHash(parseProgramPage(csHtml).lists)).toBe(catalogHash(parseProgramPage(csHtml).lists));
  });

  it("ignores changes outside the requirement tables, such as navigation and markup", () => {
    const withNav = csHtml.replace("<body", '<nav><a href="/x">New menu</a></nav><body').replace(/<table class="sc_courselist"/, '<table data-x="1" class="sc_courselist"');
    expect(withNav).not.toBe(csHtml);
    expect(catalogHash(parseProgramPage(withNav).lists)).toBe(catalogHash(parseProgramPage(csHtml).lists));
  });

  it("changes when a row or a footnote changes", () => {
    const base = catalogHash(parseProgramPage(csHtml).lists);
    const lists = parseProgramPage(csHtml).lists;
    const edited = structuredClone(lists);
    edited[0]!.rows.pop();
    expect(catalogHash(edited)).not.toBe(base);
    const footnote = structuredClone(lists);
    const marker = Object.keys(footnote[0]!.footnotes)[0]!;
    footnote[0]!.footnotes[marker] += " Changed.";
    expect(catalogHash(footnote)).not.toBe(base);
  });
});

describe("contentHash", () => {
  it("doesn't depend on key order", () => {
    expect(contentHash({ a: 1, b: [1, { c: 2, d: 3 }] })).toBe(contentHash({ b: [1, { d: 3, c: 2 }], a: 1 }));
    expect(contentHash({ a: 1 })).not.toBe(contentHash({ a: 2 }));
  });
});

describe("itemKey", () => {
  it("is stable for the same item and differs when its text changes", () => {
    const item = { reason: "footnote", text: 'Footnote 1 (on cmsc131): "x"' };
    expect(itemKey(item)).toBe(itemKey({ ...item }));
    expect(itemKey(item)).toMatch(/^footnote-[0-9a-f]{8}$/);
    expect(itemKey({ ...item, text: item.text + "!" })).not.toBe(itemKey(item));
  });
});

describe("reviewStatus", () => {
  it("is not started with no sign-off record", () => {
    expect(reviewStatus(undefined, current)).toBe("not-started");
  });

  it("is in review once the owner has notes or resolved items but hasn't verified", () => {
    expect(reviewStatus({ ...verified, status: "in-review", verifiedAt: null }, current)).toBe("in-review");
  });

  it("is verified while the hashes match", () => {
    expect(reviewStatus(verified, current)).toBe("verified");
  });

  it("is changed since verified when the catalog tables or the requirements changed", () => {
    expect(reviewStatus(verified, { ...current, catalogHash: "cat2" })).toBe("changed");
    expect(reviewStatus(verified, { ...current, requirementsHash: "req2" })).toBe("changed");
  });

  it("compares no catalog hash for a program without a catalog page", () => {
    expect(reviewStatus({ ...verified, catalogHash: null }, { ...current, catalogHash: null })).toBe("verified");
  });
});

describe("applyUpdate", () => {
  const other: Signoffs = { "other/program": verified };

  it("records an item as resolved, starting the review, without touching other programs", () => {
    const next = applyUpdate(other, "a/major", { action: "item", key: "footnote-1234abcd", resolved: true }, current);
    expect(next["other/program"]).toBe(verified);
    expect(next["a/major"]).toEqual({
      status: "in-review",
      verifiedAt: null,
      catalogYear: "2026-27",
      catalogHash: "cat1",
      requirementsHash: "req1",
      notes: "",
      items: { "footnote-1234abcd": { resolved: true, note: "" } },
    });
    expect(other["a/major"]).toBeUndefined();
  });

  it("keeps an item's note when its resolved flag changes, and drops an item with nothing left", () => {
    let s = applyUpdate({}, "p", { action: "item", key: "k", note: "Checked with advisor" }, current);
    s = applyUpdate(s, "p", { action: "item", key: "k", resolved: true }, current);
    expect(s.p!.items.k).toEqual({ resolved: true, note: "Checked with advisor" });
    s = applyUpdate(s, "p", { action: "item", key: "k", resolved: false, note: "" }, current);
    expect(s.p!.items).toEqual({});
  });

  it("saves program notes", () => {
    expect(applyUpdate({}, "p", { action: "notes", notes: "Two tracks" }, current).p!.notes).toBe("Two tracks");
  });

  it("verifies with the date and the current hashes and catalog year", () => {
    const start = applyUpdate({}, "p", { action: "notes", notes: "n" }, { ...current, catalogHash: "old" });
    const s = applyUpdate(start, "p", { action: "verify", date: "2026-09-26" }, { catalogYear: "2027-28", catalogHash: "new", requirementsHash: "r9" });
    expect(s.p).toMatchObject({ status: "verified", verifiedAt: "2026-09-26", catalogYear: "2027-28", catalogHash: "new", requirementsHash: "r9", notes: "n" });
  });

  it("reopens a verified program for review", () => {
    expect(applyUpdate({ p: verified }, "p", { action: "reopen" }, current).p).toMatchObject({ status: "in-review", verifiedAt: null });
  });
});

describe("the sign-off file", () => {
  it("serializes deterministically: sorted keys, two-space indent, trailing newline", () => {
    const a = serializeSignoffs({ z: verified, a: { ...verified, items: { y: { resolved: true, note: "" }, b: { resolved: false, note: "x" } } } });
    expect(a.endsWith("}\n")).toBe(true);
    expect(a.indexOf('"a"')).toBeLessThan(a.indexOf('"z"'));
    expect(a.indexOf('"b"')).toBeLessThan(a.indexOf('"y"'));
    expect(parseSignoffs(a).z).toEqual(verified);
  });

  it("parses an empty file as no sign-offs, and rejects anything but an object", () => {
    expect(parseSignoffs("")).toEqual({});
    expect(() => parseSignoffs("[]")).toThrow(/object/);
  });

  it("reads a missing file as empty, and updates one program without clobbering the others", async () => {
    const file = join(mkdtempSync(join(tmpdir(), "signoffs-")), "signoffs.json");
    expect(await readSignoffs(file)).toEqual({});
    writeFileSync(file, serializeSignoffs({ keep: verified }));
    const saved = await updateSignoffs(file, "p", { action: "verify", date: "2026-09-26" }, current);
    expect(saved).toMatchObject({ status: "verified", verifiedAt: "2026-09-26" });
    const onDisk = parseSignoffs(readFileSync(file, "utf8"));
    expect(onDisk.keep).toEqual(verified);
    expect(onDisk.p).toEqual(saved);
  });
});
