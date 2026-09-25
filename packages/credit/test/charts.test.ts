// Mechanical checks on the hand-transcribed charts, to catch slips that spot checks miss.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AP_EXAMS, IB_EXAMS, normalizeName, type AwardPart, type ChartRow } from "../src/index.ts";

const squash = (s: string) => s.replace(/\s+/g, "");
const fixture = (name: string) => squash(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8"));
const COURSE_ID = /^[A-Z]{4}\d{3}$/;

const partCredits = (p: AwardPart) => p.credits;
const partIds = (p: AwardPart) => (p.kind === "course" ? [p.id] : p.kind === "choice" ? p.options.map((o) => o.id) : []);

const apRows = AP_EXAMS.flatMap((e) => e.rows.map((r) => ({ label: `AP ${e.name} ${r.scores.join(",")}`, row: r, max: 5 })));
const ibRows = IB_EXAMS.flatMap((e) =>
  Object.entries(e.levels).flatMap(([level, rows]) => rows.map((r) => ({ label: `IB ${e.name} ${level} ${r.scores.join(",")}`, row: r, max: 7 }))),
);

function checkRow({ label, row, max }: { label: string; row: ChartRow; max: number }) {
  expect(row.parts.length, label).toBeGreaterThan(0);
  expect(row.parts.map(partCredits).reduce((a, b) => a + b, 0), `${label}: parts sum to the chart's credits`).toBe(row.credits);
  for (const s of row.scores) expect(Number.isInteger(s) && s >= 1 && s <= max, `${label}: score ${s}`).toBe(true);
  for (const id of row.parts.flatMap(partIds)) {
    expect(id, label).toMatch(COURSE_ID);
    expect(squash(row.text), `${label}: ${id} is in the row's text`).toContain(id);
  }
}

function checkBands(label: string, rows: ChartRow[]) {
  const scores = rows.flatMap((r) => r.scores);
  expect(new Set(scores).size, `${label}: score bands overlap`).toBe(scores.length);
}

describe("AP chart", () => {
  const text = fixture("ap-chart-may2023-may2026.txt");

  it.each(apRows)("$label is consistent", (r) => checkRow(r));

  it("has no overlapping score bands", () => {
    for (const e of AP_EXAMS) checkBands(e.name, e.rows);
  });

  it("copies every equivalency cell word for word from the chart", () => {
    for (const { label, row } of apRows) expect(text.includes(squash(row.text)), `${label}: "${row.text}"`).toBe(true);
  });

  it("never gives two exams the same name", () => {
    const names = AP_EXAMS.flatMap((e) => [...new Set([e.name, ...e.aliases].map(normalizeName))]);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("IB chart", () => {
  const text = fixture("ib-chart-nov2023-may2026.txt");

  it.each(ibRows)("$label is consistent", (r) => checkRow(r));

  it("has no overlapping score bands", () => {
    for (const e of IB_EXAMS) for (const [level, rows] of Object.entries(e.levels)) checkBands(`${e.name} ${level}`, rows);
  });

  it("copies every equivalency cell word for word from the chart", () => {
    for (const { label, row } of ibRows) expect(text.includes(squash(row.text)), `${label}: "${row.text}"`).toBe(true);
  });

  it("never gives two exams the same name", () => {
    const names = IB_EXAMS.flatMap((e) => [...new Set([e.name, ...e.aliases].map(normalizeName))]);
    expect(new Set(names).size).toBe(names.length);
  });
});
