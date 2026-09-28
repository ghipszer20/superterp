// special-programs/report.md from the registry, so its counts are correct by construction.
//
//   node scripts/special-report.ts      (from packages/catalog; writes special-programs/report.md)

import { writeFileSync } from "node:fs";
import type { SpecialEntry, SpecialKind } from "../special-programs/registry.ts";

const KIND_LABEL: Record<SpecialKind, string> = {
  scholars: "Scholars",
  honors: "Honors",
  llp: "Other LLP",
  special: "Other special program",
  departmental: "Departmental Honors",
};

const counts = (e: SpecialEntry) => {
  const notes = e.program?.reviewNotes ?? [];
  return {
    requirements: e.program?.requirements.length ?? 0,
    notes: notes.length,
    manual: notes.filter((n) => n.startsWith("[manual]")).length,
    check: notes.filter((n) => n.startsWith("[check]")).length,
  };
};

export function renderSpecialReport(entries: SpecialEntry[], meta: { generated: string }): string {
  const kinds = (Object.keys(KIND_LABEL) as SpecialKind[]).filter((k) => entries.some((e) => e.kind === k));
  const hand = entries.filter((e) => e.drafting === "hand");
  const total = hand.reduce(
    (t, e) => {
      const c = counts(e);
      return { requirements: t.requirements + c.requirements, notes: t.notes + c.notes, manual: t.manual + c.manual, check: t.check + c.check };
    },
    { requirements: 0, notes: 0, manual: 0, check: 0 },
  );
  const lines = [
    "# Living-learning and special programs report",
    "",
    `Generated ${meta.generated} by \`packages/catalog/scripts/special-report.ts\` from \`special-programs/registry.ts\`.`,
    "Sources and page formats are in `SOURCES.md`. Every drafted program is `verified: false` until the owner signs it off.",
    "",
    "How programs were drafted: **table** = a catalog requirement table through `parseProgramPage` + `draftPrograms`",
    "(no LLP or special program has one); **hand** = transcribed by hand from a prose page or PDF, with every",
    "interpretation quoted in `reviewNotes`; **none** = no academic requirements are published (the reason is given).",
    "",
    "## By kind",
    "",
    "| Kind | Programs | Hand | None |",
    "| --- | --- | --- | --- |",
    ...kinds.map((k) => {
      const of = entries.filter((e) => e.kind === k);
      return `| ${KIND_LABEL[k]} | ${of.length} | ${of.filter((e) => e.drafting === "hand").length} | ${of.filter((e) => e.drafting === "none").length} |`;
    }),
    `| **Total** | **${entries.length}** | **${hand.length}** | **${entries.length - hand.length}** |`,
    "",
    `Drafted: **${total.requirements}** requirements and **${total.notes}** review notes (${total.manual} manual, ${total.check} check).`,
    "Manual notes are rules the audit can't check (GPA, residence, attendance, approvals); check notes are interpretations to confirm.",
    "",
    "## Programs",
    "",
    "| Program | Kind | Drafted | Requirements | Review notes | Manual | Check |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...entries.map((e) => {
      const c = counts(e);
      const how = e.drafting === "hand" ? "hand" : `none: ${e.why}`;
      return `| ${e.name} | ${KIND_LABEL[e.kind]} | ${how} | ${c.requirements} | ${c.notes} | ${c.manual} | ${c.check} |`;
    }),
    "",
  ];
  return lines.join("\n");
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/").replace(/^\//, "")}`) {
  const { specialPrograms } = await import("../special-programs/registry.ts");
  const report = renderSpecialReport(specialPrograms, { generated: new Date().toISOString().slice(0, 10) });
  writeFileSync(new URL("../special-programs/report.md", import.meta.url), report);
  console.log(report);
}
