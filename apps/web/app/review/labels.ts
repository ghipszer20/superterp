import type { ProgramKind, ReviewStatus } from "@superterp/catalog";

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  "not-started": "Not started",
  "in-review": "In review",
  verified: "Verified",
  changed: "Changed since verified",
};

export const KIND_LABEL: Record<ProgramKind, string> = { major: "Major", minor: "Minor", certificate: "Certificate", other: "Program" };

/** Review item reasons (draft.ts) in words. */
export const REASON_LABEL: Record<string, string> = {
  footnote: "Footnote",
  "unrecognized-rule": "Rule not parsed",
  "course-pattern": "Course pattern",
  "must-include": "Umbrella count",
  "empty-group": "Labelled groups",
  "group-boundary": "Unclear group",
  "sets-with-alternatives": "Engine gap",
  "sequence-with-rule": "Sequence left out",
  "alternatives-flattened": "Alternatives flattened",
  "ambiguous-code": "Ambiguous code",
  "stray-or": "Stray “or”",
  "multiple-lists": "Several tables",
  note: "Review note",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-09-25" -> "Sep 25, 2026". */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : iso;
}


export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
