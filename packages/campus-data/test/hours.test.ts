import { describe, expect, it } from "vitest";
import { formatMinutes, isOpenAt, minutesUntilClose, parseHours } from "../src/hours.ts";
import { parseCsv, parseCsvRecords } from "../src/csv.ts";
import { addDays, fromUsDate, toUsDate } from "../src/dates.ts";

describe("parseHours", () => {
  it("parses RecWell-style ranges", () => {
    const h = parseHours("6am to 9pm");
    expect(h).toEqual({ kind: "ranges", label: "6am to 9pm", ranges: [{ start: 360, end: 1260 }] });
  });

  it("parses minutes and LibCal-style dashes", () => {
    expect(parseHours("8am to 8:30pm")).toMatchObject({ ranges: [{ start: 480, end: 1230 }] });
    expect(parseHours("10:00AM - 3:00PM")).toMatchObject({ ranges: [{ start: 600, end: 900 }] });
  });

  it("treats a range ending at or before its start as running past midnight", () => {
    expect(parseHours("11am - 12am")).toMatchObject({ ranges: [{ start: 660, end: 1440 }] });
    expect(parseHours("8pm - 2am")).toMatchObject({ ranges: [{ start: 1200, end: 1560 }] });
  });

  it("handles closed, trailing spaces and 24 hours", () => {
    expect(parseHours("Closed ").kind).toBe("closed");
    expect(parseHours("").kind).toBe("closed");
    expect(parseHours("24 Hours").kind).toBe("24h");
  });

  // RecWell's informal-rec columns (e.g. Pickleball) use a bare "--" for "no
  // drop-in session scheduled" -- treat it the same as an empty cell.
  it("treats a dash-only cell as closed", () => {
    expect(parseHours("--")).toEqual({ kind: "closed", label: "Closed" });
    expect(parseHours("—")).toEqual({ kind: "closed", label: "Closed" });
  });

  it("keeps text it can't parse, stripping HTML", () => {
    expect(parseHours('By <a href="x">appointment</a> only')).toEqual({ kind: "text", label: "By appointment only" });
  });

  it("parses multiple ranges in one label", () => {
    expect(parseHours("7am - 10am, 11am - 2pm")).toMatchObject({
      ranges: [
        { start: 420, end: 600 },
        { start: 660, end: 840 },
      ],
    });
  });
});

describe("isOpenAt / minutesUntilClose", () => {
  const h = parseHours("6am to 9pm");
  it("is open inside the range and closed at the end", () => {
    expect(isOpenAt(h, 360)).toBe(true);
    expect(isOpenAt(h, 1259)).toBe(true);
    expect(isOpenAt(h, 1260)).toBe(false);
    expect(minutesUntilClose(h, 1200)).toBe(60);
  });
  it("returns null for unparseable text", () => {
    expect(isOpenAt(parseHours("By appointment"), 600)).toBeNull();
  });
});

describe("formatMinutes", () => {
  it("formats like Apple's compact style", () => {
    expect(formatMinutes(1260)).toBe("9pm");
    expect(formatMinutes(1230)).toBe("8:30pm");
    expect(formatMinutes(720)).toBe("noon");
    expect(formatMinutes(1440)).toBe("midnight");
  });
});

describe("csv", () => {
  it("handles quotes, escaped quotes and CRLF", () => {
    expect(parseCsv('a,"b,c","d ""e"""\r\n1,2,3')).toEqual([
      ["a", "b,c", 'd "e"'],
      ["1", "2", "3"],
    ]);
  });
  it("strips a BOM and builds records", () => {
    expect(parseCsvRecords("﻿id,name\n1,Gold\n\n")).toEqual([{ id: "1", name: "Gold" }]);
  });
});

describe("dates", () => {
  it("converts between ISO and US formats", () => {
    expect(toUsDate("2026-09-05")).toBe("9/5/2026");
    expect(fromUsDate("9/5/2026")).toBe("2026-09-05");
    expect(fromUsDate("URLs")).toBeNull();
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});
