// Draft audit Programs from parsed catalog requirement tables, deterministically
// (no LLM; PROJECT_MEMORY.md section 6, step 2). A draft is never a Verified
// Program: whatever the tables can't say with confidence (prose, footnote rules,
// unlinked electives) becomes a review item with the original text, never a guess.
//
// Row shapes:
//   plain course row                      -> course (an "or" row, or an "OR" text row, adds options)
//   "A and B" row                         -> one course per code; with "or" choices, a sets requirement
//   "Select one of the following:" group  -> course with every option (sets if a member is "A and B")
//   "Select two/N of the following:"      -> choose { count } over the group's courses; "or" rows
//                                            (and cross-listings) become alternatives; over "A and B"
//                                            rows, sets { count }
//   "N credits from/of the following"     -> choose { credits } over the group's courses (with alternatives)
//   "Select N … from at least M of the following areas …" + area labels -> distribution
//   "Select one of N sequences" + "Sequence …" labels -> sets ("or" choices expanded)
// A group is the course rows after the rule, up to the next header or text row.

import type { Area, Program, Requirement } from "@superterp/audit";
import type { CatalogRow, CourseList, ProgramPage } from "./program.ts";

export type DraftMeta = {
  /** Program id; a page with several tables gets one suffixed per table. */
  id: string;
  catalogYear: string;
  source: string;
  /** Which table draftProgram drafts (default 0). */
  list?: number;
};

/** check: drafted, but the owner should confirm it. manual: not drafted; the owner must encode it. */
export type Confidence = "check" | "manual";

export type ReviewReason =
  | "footnote"
  | "unrecognized-rule"
  | "course-pattern"
  | "must-include"
  | "empty-group"
  | "group-boundary"
  | "sets-with-alternatives"
  | "sequence-with-rule"
  | "alternatives-flattened"
  | "ambiguous-code"
  | "stray-or"
  | "multiple-lists";

/** Review reasons that are rule shapes the audit engine can't express at all, even by hand. */
export const ENGINE_GAPS: Partial<Record<ReviewReason, string>> = {
  "sets-with-alternatives":
    "A choice of more than one course set where some sets are 'or' alternatives of each other, or a credit count over sets, e.g. 'Select two of: STAT400 & STAT401 or STAT410, STAT430, …'",
};

export type ReviewItem = {
  confidence: Confidence;
  reason: ReviewReason;
  /** What to review, quoting the catalog. */
  text: string;
  /** The table's heading. */
  list: string | null;
  /** How many table rows this item sent to review instead of drafting. */
  rows: number;
};

export type Draft = {
  program: Program;
  review: ReviewItem[];
  /** Every row of the table is exactly one of these. structural: a plain header. */
  rows: { converted: number; review: number; structural: number };
  rowCount: number;
  /** The table's total credits as printed; informational, not encoded (it's the sum of the rows). */
  total: string | null;
};

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const NUM = `(${NUMBER_WORDS.slice(1).join("|")}|\\d+)`;
const toNumber = (s: string) => (/^\d+$/.test(s) ? Number(s) : NUMBER_WORDS.indexOf(s.toLowerCase()));
const idNumber = (n: number) => NUMBER_WORDS[n] ?? String(n);

const rx = (source: string) => new RegExp(`^${source}$`, "i");
const COUNT_RULES = [
  rx(`(?:(?:students must )?(?:select|choose|take)\\s+)?(?:any\\s+)?${NUM}(?:\\s+courses?)?\\s+(?:of|from)\\s+(?:the\\s+)?following(?:\\s+[a-z&,' -]*?courses)?`),
  rx(`(?:students must )?(?:select|choose|take)\\s+${NUM}(?:\\s+courses?)?\\s+from`),
  rx(`(?:select|choose)\\s+${NUM}`),
  rx(`.+\\((?:select|choose|take)\\s+${NUM}(?:\\s+courses?)?(?:\\s+of\\s+the\\s+following)?\\)`),
];
const CREDIT_RULES = [
  rx(`(?:(?:select|choose|take)\\s+)?(?:(?:an\\s+)?additional\\s+|at least\\s+)?${NUM}\\s+credits?\\s+(?:of|from)\\s+(?:the\\s+)?(?:following(?:\\s+list)?|list below)`),
  rx(`.+\\((?:select|choose|take)\\s+(?:at least\\s+)?${NUM}\\s+credits?(?:\\s+(?:of|from)\\s+the\\s+following(?:\\s+list)?)?\\)`),
];
const DISTRIBUTION_RULES = [
  rx(
    `select\\s+${NUM}\\s+(?:[\\w -]+?\\s+)?courses?\\s+from\\s+at least\\s+${NUM}\\s+of the following areas(?:\\s+with no more than\\s+${NUM}\\s+courses?\\s+in\\s+(?:a|any)\\s+given area)?`,
  ),
];
const SEQUENCE_RULE = rx(`select one of (?:${NUM}|the following) sequences`);
const SEQUENCE_LABEL = /^sequence\b/i;
const MUST_INCLUDE = /must include$/i;
const COURSE_PATTERN = /^([A-Z]{4})\s?(\d)([\dxX])[xX](?:\s*\/\s*(\d)[xX][xX])?$/;
/** Words that make a header a rule rather than a section title. */
const RULE_WORDS = /\b(select|choose|take|credits?|must|at least|of the following|from the following)\b/i;

const clean = (s: string) => s.trim().replace(/[:.]\s*$/, "").trim();

type Rule =
  | { kind: "count"; count: number }
  | { kind: "credits"; credits: number }
  | { kind: "distribution"; count: number; minAreas: number; maxPerArea: number }
  | { kind: "sequences" }
  | { kind: "must-include" }
  | { kind: "pattern"; department: string; min: number; max: number }
  | { kind: "or" }
  | { kind: "other" };

function classify(text: string): Rule {
  const s = clean(text);
  if (/^or$/i.test(s)) return { kind: "or" };
  for (const r of DISTRIBUTION_RULES) {
    const m = r.exec(s);
    if (m) {
      const count = toNumber(m[1]!);
      return { kind: "distribution", count, minAreas: toNumber(m[2]!), maxPerArea: m[3] ? toNumber(m[3]) : count };
    }
  }
  if (SEQUENCE_RULE.test(s)) return { kind: "sequences" };
  for (const r of CREDIT_RULES) {
    const m = r.exec(s);
    if (m) return { kind: "credits", credits: toNumber(m[1]!) };
  }
  for (const r of COUNT_RULES) {
    const m = r.exec(s);
    if (m) return { kind: "count", count: toNumber(m[1]!) };
  }
  if (MUST_INCLUDE.test(s)) return { kind: "must-include" };
  const p = COURSE_PATTERN.exec(text.trim());
  if (p) {
    const hundreds = Number(p[2]);
    const tens = /\d/.test(p[3]!) ? Number(p[3]) : null;
    const min = hundreds * 100 + (tens ?? 0) * 10;
    const max = p[4] ? Number(p[4]) * 100 + 99 : tens === null ? hundreds * 100 + 99 : min + 9;
    return { kind: "pattern", department: p[1]!, min, max };
  }
  return { kind: "other" };
}

const SINGLE = /^[A-Z]{4}\d{3}[A-Z]?$/;
/** A code column entry as course ids: "CMSC/AMSC460" and "ISRL342/HIST376" are cross-listings (either id). Null if unclear, like "PLSC110/111". */
function expandCode(code: string): string[] | null {
  if (SINGLE.test(code)) return [code];
  const shared = /^((?:[A-Z]{4}\/)+[A-Z]{4})(\d{3}[A-Z]?)$/.exec(code);
  if (shared) return shared[1]!.split("/").map((d) => d + shared[2]);
  const parts = code.split("/");
  if (parts.length > 1 && parts.every((p) => SINGLE.test(p))) return parts;
  return null;
}

/** One requirement-shaped unit of course rows: its "or" alternatives, each a list of courses taken together. */
type Slot = { alts: string[][]; title: string; rows: number[] };

const product = (lists: string[][]): string[][] =>
  lists.reduce<string[][]>((acc, list) => acc.flatMap((prefix) => list.map((x) => [...prefix, x])), [[]]);

class ListDrafter {
  private readonly requirements: Requirement[] = [];
  private readonly review: ReviewItem[] = [];
  private readonly disposition: ("converted" | "review" | "structural" | undefined)[];
  private readonly ids = new Map<string, number>();
  /** Footnote marker -> where it's cited, in order of first citation. */
  private readonly footnoteUses = new Map<string, string[]>();
  private section: string | null = null;

  private readonly list: CourseList;

  constructor(list: CourseList) {
    this.list = list;
    this.disposition = new Array(list.rows.length);
  }

  private row(i: number) {
    return this.list.rows[i]!;
  }

  private mark(rows: number[], as: "converted" | "review" | "structural") {
    for (const i of rows) {
      if (this.disposition[i] !== undefined) throw new Error(`row ${i} accounted twice`);
      this.disposition[i] = as;
    }
  }

  private id(base: string): string {
    const n = (this.ids.get(base) ?? 0) + 1;
    this.ids.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  }

  private cite(rows: number[], where: string) {
    for (const i of rows) {
      for (const marker of this.row(i).footnotes) {
        const uses = this.footnoteUses.get(marker) ?? [];
        if (!uses.includes(where)) uses.push(where);
        this.footnoteUses.set(marker, uses);
      }
    }
  }

  private add(req: Requirement, rows: number[]) {
    this.requirements.push(req);
    this.mark(rows, "converted");
    this.cite(rows, req.id);
  }

  private sendToReview(reason: ReviewReason, rows: number[], text: string, confidence: Confidence = "manual") {
    this.review.push({ confidence, reason, text, list: this.list.heading, rows: rows.length });
    this.mark(rows, "review");
    for (const i of rows) {
      const r = this.row(i);
      this.cite([i], r.kind === "course" ? r.codes.join("+") : `row "${r.text}"`);
    }
  }

  private describe(i: number): string {
    const r = this.row(i);
    const credits = r.kind !== "header" && r.credits ? ` (${r.credits} credits)` : "";
    return `Row "${r.kind === "course" ? r.codes.join(" & ") : r.text}"${credits}`;
  }

  /** "Row "X" was not converted." plus the rows under it. */
  private notConverted(lead: number, rest: number[], why = ""): string {
    const under = rest.map((i) => this.row(i)).map((r) => (r.kind === "course" ? r.codes.join("&") : `"${r.text}"`));
    return (
      `${this.describe(lead)} was not converted.${why ? ` ${why}` : ""}` +
      (under.length ? ` Nor were the ${under.length} rows under it: ${under.join(", ")}.` : "")
    );
  }

  /** Indexes from `from` while `keep` holds. */
  private scan(from: number, keep: (r: CatalogRow, i: number) => boolean): number[] {
    const out: number[] = [];
    for (let i = from; i < this.list.rows.length && keep(this.row(i), i); i++) out.push(i);
    return out;
  }

  private untilHeader(from: number) {
    return this.scan(from, (r) => r.kind !== "header");
  }

  private isOr(r: CatalogRow) {
    return r.kind === "text" && classify(r.text).kind === "or";
  }

  /** Course rows (and "OR" rows between courses) from `from`, up to the next header or other text row. */
  private courseRun(from: number, stopAtCreditedRow = false): number[] {
    let sawUncredited = false;
    return this.scan(from, (r, i) => {
      if (r.kind === "course") {
        if (stopAtCreditedRow && !r.alternative && r.credits && sawUncredited) return false;
        if (!r.credits) sawUncredited = true;
        return true;
      }
      return this.isOr(r) && this.list.rows[i + 1]?.kind === "course";
    });
  }

  /** Course rows under a rule the draft can't convert: up to one with its own credits, which is a requirement of its own. */
  private underRule(from: number): number[] {
    return this.scan(from, (r, i) =>
      r.kind === "course" ? r.alternative || !r.credits : this.isOr(r) && this.list.rows[i + 1]?.kind === "course",
    );
  }

  /** Groups course rows into slots; null (with the problem) if a code is unclear or an "or" has nothing before it. */
  private slots(rows: number[]): { slots: Slot[] } | { problem: ReviewReason; detail: string } {
    const slots: Slot[] = [];
    let pendingOr = false;
    for (const i of rows) {
      const r = this.row(i);
      if (r.kind !== "course") {
        pendingOr = true;
        if (slots.length === 0) return { problem: "stray-or", detail: `"OR" row with no course above it` };
        slots.at(-1)!.rows.push(i);
        continue;
      }
      const expanded = r.codes.map(expandCode);
      const bad = r.codes.find((_, k) => expanded[k] === null);
      if (bad) return { problem: "ambiguous-code", detail: `Code "${bad}" could be a cross-listing or two courses to take together` };
      const alts = product(expanded as string[][]);
      if ((r.alternative || pendingOr) && slots.length > 0) {
        const slot = slots.at(-1)!;
        slot.alts.push(...alts);
        slot.rows.push(i);
      } else {
        if (r.alternative) return { problem: "stray-or", detail: `"or" row ${r.codes.join("&")} with no course above it` };
        slots.push({ alts, title: r.title, rows: [i] });
      }
      pendingOr = false;
    }
    return { slots };
  }

  private plainSlot(slot: Slot) {
    const [first] = slot.alts;
    if (slot.alts.length === 1 && first!.length > 1) {
      for (const code of first!) this.add({ kind: "course", id: this.id(code.toLowerCase()), name: slot.title, options: [code] }, []);
      this.mark(slot.rows, "converted");
      this.cite(slot.rows, first!.map((c) => c.toLowerCase()).join(", "));
      return;
    }
    if (slot.alts.every((a) => a.length === 1)) {
      this.add({ kind: "course", id: this.id(first![0]!.toLowerCase()), name: slot.title, options: slot.alts.map((a) => a[0]!) }, slot.rows);
      return;
    }
    this.add({ kind: "sets", id: this.id(first!.join("-").toLowerCase()), name: slot.title, options: slot.alts }, slot.rows);
  }

  private ruleName(text: string, isHeader: boolean) {
    return !isHeader && this.section ? `${this.section}: ${text}` : text;
  }

  /** Handles the rule row at i; returns the next index. */
  private rule(i: number, rule: Rule): number {
    const r = this.row(i);
    const text = r.kind === "course" ? "" : r.text;
    const isHeader = r.kind === "header";
    const name = this.ruleName(text, isHeader);

    if (rule.kind === "or") {
      this.sendToReview("stray-or", [i], `${this.describe(i)}: an "OR" with no course above it to be an alternative to.`);
      return i + 1;
    }
    if (rule.kind === "pattern") {
      const rest = this.underRule(i + 1);
      const filter = `departments: [${rule.department}], ${rule.min}–${rule.max}`;
      this.sendToReview("course-pattern", [i, ...rest], this.notConverted(i, rest, `Suggested filter: ${filter} (check footnotes and exclusions).`));
      return i + 1 + rest.length;
    }
    if (rule.kind === "must-include") {
      this.sendToReview(
        "must-include",
        [i],
        `${this.describe(i)} was not converted: an umbrella count that the rows after it also count toward (an overlay). The rows after it are drafted as required.`,
      );
      return i + 1;
    }
    if (rule.kind === "distribution" || rule.kind === "sequences") return this.labelled(i, rule, name);
    if (rule.kind === "other") return this.unrecognized(i, isHeader);

    // count / credits over the course rows that follow
    const group = this.courseRun(i + 1, r.kind !== "course" && r.kind !== "header" && r.credits !== null);
    if (group.length === 0) {
      const rest = this.list.rows[i + 1]?.kind === "text" ? this.untilHeader(i + 1) : [];
      this.sendToReview("empty-group", [i, ...rest], this.notConverted(i, rest, "No course rows follow it directly."));
      return i + 1 + rest.length;
    }
    const all = [i, ...group];
    const next = i + 1 + group.length;
    const ruleCredits = r.kind === "header" ? null : r.credits;
    const memberCredits = group.map((g) => this.row(g)).flatMap((g) => (g.kind === "course" && g.credits ? [g.credits] : []));
    if (ruleCredits === null && new Set(memberCredits).size > 1) {
      this.sendToReview("group-boundary", all, this.notConverted(i, group, "Its course rows carry different credits, so where the group ends is unclear."));
      return next;
    }
    const parsed = this.slots(group);
    if ("problem" in parsed) {
      this.sendToReview(parsed.problem, all, this.notConverted(i, group, `${parsed.detail}.`));
      return next;
    }
    const { slots } = parsed;
    const firstCode = slots[0]!.alts[0]![0]!.toLowerCase();
    if (rule.kind === "count" && rule.count === 1) {
      const alts = slots.flatMap((s) => s.alts);
      const id = this.id(`one-of-${firstCode}`);
      if (alts.every((a) => a.length === 1)) this.add({ kind: "course", id, name, options: alts.map((a) => a[0]!) }, all);
      else this.add({ kind: "sets", id, name, options: alts }, all);
      return next;
    }
    if (slots.some((s) => s.alts.some((a) => a.length > 1))) {
      if (rule.kind === "credits" || slots.some((s) => s.alts.length > 1)) {
        const why = rule.kind === "credits" ? "a credit count over course sets" : `"or" alternatives between course sets in a choice of several`;
        this.sendToReview("sets-with-alternatives", all, this.notConverted(i, group, `Engine gap: ${why}.`));
        return next;
      }
      this.add({ kind: "sets", id: this.id(`${idNumber(rule.count)}-of-${firstCode}`), name, count: rule.count, options: slots.map((s) => s.alts[0]!) }, all);
      return next;
    }
    // Each slot's "or" alternatives (and cross-listings): only one of them may count.
    const courses = slots.flatMap((s) => s.alts.map((a) => a[0]!));
    const groups = slots.filter((s) => s.alts.length > 1).map((s) => s.alts.map((a) => a[0]!));
    const alternatives = groups.length > 0 ? { alternatives: groups } : {};
    const req: Requirement =
      rule.kind === "count"
        ? { kind: "choose", id: this.id(`${idNumber(rule.count)}-of-${firstCode}`), name, count: rule.count, from: { courses }, ...alternatives }
        : { kind: "choose", id: this.id(`${rule.credits}-credits-of-${firstCode}`), name, credits: rule.credits, from: { courses }, ...alternatives };
    this.add(req, all);
    return next;
  }

  private unrecognized(i: number, isHeader: boolean): number {
    const r = this.row(i);
    const next = this.list.rows[i + 1];
    const leadIn = r.kind !== "course" && /:\s*$/.test(r.text) && next?.kind === "text" && !this.isOr(next);
    const rest = isHeader || leadIn ? this.untilHeader(i + 1) : this.underRule(i + 1);
    this.sendToReview("unrecognized-rule", [i, ...rest], this.notConverted(i, rest));
    return i + 1 + rest.length;
  }

  /** Areas (distribution) or sequences (sets): label text rows, each followed by its course rows, up to the next header. */
  private labelled(i: number, rule: Extract<Rule, { kind: "distribution" | "sequences" }>, name: string): number {
    const body = this.untilHeader(i + 1);
    const groups: { label: number; rows: number[] }[] = [];
    let structureOk = body.length > 0 && this.row(body[0]!).kind === "text" && !this.isOr(this.row(body[0]!));
    for (const k of body) {
      const r = this.row(k);
      const isLabel = r.kind === "text" && !this.isOr(r) && (rule.kind === "distribution" || SEQUENCE_LABEL.test(r.text));
      if (isLabel) groups.push({ label: k, rows: [] });
      else if (groups.length > 0) groups.at(-1)!.rows.push(k);
    }
    if (rule.kind === "sequences" && groups.length > 0 && !SEQUENCE_LABEL.test((this.row(groups[0]!.label) as { text: string }).text)) structureOk = false;
    if (!structureOk || groups.length === 0) {
      this.sendToReview("unrecognized-rule", [i, ...body], this.notConverted(i, body, "Its groups aren't laid out as expected."));
      return i + 1 + body.length;
    }
    const label = (g: { label: number }) => (this.row(g.label) as { text: string }).text;

    if (rule.kind === "distribution") {
      const areas: Area[] = [];
      const flattened: string[] = [];
      for (const g of groups) {
        const parsed = g.rows.every((k) => this.row(k).kind === "course" || this.isOr(this.row(k))) ? this.slots(g.rows) : null;
        if (!parsed || "problem" in parsed || parsed.slots.some((s) => s.alts.some((a) => a.length > 1)) || parsed.slots.length === 0) {
          this.sendToReview("unrecognized-rule", [i, ...body], this.notConverted(i, body, `Area "${label(g)}" isn't a plain list of courses.`));
          return i + 1 + body.length;
        }
        for (const s of parsed.slots) if (s.alts.length > 1) flattened.push(s.alts.map((a) => a[0]).join(" or "));
        areas.push({ name: label(g), courses: parsed.slots.flatMap((s) => s.alts.map((a) => a[0]!)) });
      }
      const firstCode = areas[0]!.courses[0]!.toLowerCase();
      const id = this.id(`areas-${firstCode}`);
      this.add({ kind: "distribution", id, name, count: rule.count, minAreas: rule.minAreas, maxPerArea: rule.maxPerArea, areas }, [i, ...body]);
      if (flattened.length) {
        this.review.push({
          confidence: "check",
          reason: "alternatives-flattened",
          text: `${id}: "or" alternatives inside an area are each listed in the area (${flattened.join("; ")}); taking both could count twice.`,
          list: this.list.heading,
          rows: 0,
        });
      }
      return i + 1 + body.length;
    }

    // sequences
    const sets: string[][] = [];
    const kept: number[] = [i];
    const leftOut: { g: (typeof groups)[number]; why: string }[] = [];
    for (const g of groups) {
      const nested = g.rows.find((k) => this.row(k).kind === "text" && !this.isOr(this.row(k)));
      const parsed = nested === undefined ? this.slots(g.rows) : null;
      if (nested !== undefined || !parsed || "problem" in parsed || parsed.slots.length === 0) {
        const why = nested !== undefined ? `its row "${(this.row(nested) as { text: string }).text}" is a rule the draft can't expand` : "it isn't a plain list of courses";
        leftOut.push({ g, why });
        continue;
      }
      const combos = product(parsed.slots.map((s) => s.alts.map((a) => a.join(" ")))).map((combo) => combo.flatMap((x) => x.split(" ")));
      if (combos.length > 32) {
        leftOut.push({ g, why: `its "or" choices expand to ${combos.length} sets` });
        continue;
      }
      sets.push(...combos);
      kept.push(g.label, ...g.rows);
    }
    if (sets.length === 0) {
      this.sendToReview("unrecognized-rule", [i, ...body], this.notConverted(i, body, "No sequence is a plain list of courses."));
      return i + 1 + body.length;
    }
    const id = this.id(`sequence-${sets[0]![0]!.toLowerCase()}`);
    this.add({ kind: "sets", id, name, options: sets }, kept);
    for (const { g, why } of leftOut) {
      this.sendToReview(
        "sequence-with-rule",
        [g.label, ...g.rows],
        `${id}: sequence "${label(g)}" left out because ${why}; a student on that sequence will see ${id} unsatisfied until it's encoded.`,
        "check",
      );
    }
    return i + 1 + body.length;
  }

  draft(): Omit<Draft, "program" | "total"> & { requirements: Requirement[] } {
    const rows = this.list.rows;
    let i = 0;
    while (i < rows.length) {
      const r = rows[i]!;
      if (r.kind === "course") {
        const run = this.courseRun(i);
        const parsed = this.slots(run);
        if ("problem" in parsed) this.sendToReview(parsed.problem, run, `${this.describe(i)} and the rows with it were not converted: ${parsed.detail}.`);
        else for (const slot of parsed.slots) this.plainSlot(slot);
        i += run.length;
        continue;
      }
      const rule = classify(r.text);
      if (r.kind === "header") {
        const stripped = r.text.replace(/\(\s*[\d.–-]+\s*(credits?|hours)\s*\)/gi, "");
        if (rule.kind === "other" && !RULE_WORDS.test(stripped)) {
          this.section = r.text;
          this.mark([i], "structural");
          this.cite([i], `header "${r.text}"`);
          i++;
          continue;
        }
        this.section = null;
      }
      i = this.rule(i, rule);
    }
    for (const [marker, uses] of this.footnoteUses) {
      const note = this.list.footnotes[marker];
      this.review.push({
        confidence: "check",
        reason: "footnote",
        text: `Footnote ${marker} (on ${uses.join(", ")}): ${note ? `"${note}"` : "(no footnote text on the page)"}`,
        list: this.list.heading,
        rows: 0,
      });
    }
    const count = (as: string) => this.disposition.filter((d) => d === as).length;
    if (this.disposition.some((d) => d === undefined)) throw new Error("a row was not accounted for");
    return {
      requirements: this.requirements,
      review: this.review,
      rows: { converted: count("converted"), review: count("review"), structural: count("structural") },
      rowCount: rows.length,
    };
  }
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const reviewNote = (r: ReviewItem) => `[${r.confidence}] ${r.reason}: ${r.list ? `(${r.list}) ` : ""}${r.text}`;

/** One draft per requirement table on the page. */
export function draftPrograms(page: ProgramPage, meta: DraftMeta): Draft[] {
  const many = page.lists.length > 1;
  return page.lists.map((list, n) => {
    const drafted = new ListDrafter(list).draft();
    const review = [...drafted.review];
    if (many) {
      const headings = page.lists.map((l, k) => l.heading ?? `untitled table ${k + 1}`);
      review.unshift({
        confidence: "manual",
        reason: "multiple-lists",
        text: `This page has ${page.lists.length} requirement tables (${headings.join("; ")}); this draft is table ${n + 1}. Decide whether they are alternative tracks, add-on specializations or parts of one program.`,
        list: list.heading,
        rows: 0,
      });
    }
    const program: Program = {
      id: many ? `${meta.id}-${slug(list.heading ?? `table ${n + 1}`)}` : meta.id,
      name: list.heading ? `${page.name} (${list.heading})` : page.name,
      catalogYear: meta.catalogYear,
      source: meta.source,
      verified: false,
      reviewNotes: review.map(reviewNote),
      requirements: drafted.requirements,
    };
    return { program, review, rows: drafted.rows, rowCount: drafted.rowCount, total: list.total };
  });
}

/** The draft of one table (meta.list, default the first). */
export function draftProgram(page: ProgramPage, meta: DraftMeta): Draft {
  const drafts = draftPrograms(page, meta);
  const draft = drafts[meta.list ?? 0];
  if (!draft) throw new Error(`${page.name} has no requirement table ${meta.list ?? 0}`);
  return draft;
}
