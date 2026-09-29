// The advising takeout as a Letter PDF, generated in the browser. jsPDF and jspdf-autotable are
// lazy-loaded: never import them at top level.

import { academicYears } from "../terms";
import { CATEGORY_COLORS, CATEGORY_LABELS, FOOTER, type Category, type Takeout } from "./takeout";

const rgb = (hex: string): [number, number, number] => [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
const STATUS_TEXT = { satisfied: "Satisfied", partial: "Partial", missing: "Missing" } as const;

export async function buildPdf(t: Takeout) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const margin = 36;
  let y = margin;
  const tableEnd = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  const heading = (text: string) => {
    if (y > doc.internal.pageSize.getHeight() - 110) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(20).text(text, margin, y);
    y += 8;
  };
  const line = (text: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(10).setTextColor(60);
    const lines = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - margin * 2) as string[];
    doc.text(lines, margin, y);
    y += lines.length * 13;
  };
  const common = { margin: { left: margin, right: margin, bottom: 44 }, styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [60, 60, 67] as [number, number, number], textColor: 255 } };
  const table = (opts: Record<string, unknown>) => {
    autoTable(doc, { ...common, startY: y, ...opts });
    y = tableEnd() + 18;
  };

  // Header
  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(20).text("SuperTerp Advising takeout", margin, y + 6);
  y += 26;
  line(`Programs: ${t.header.programs.join(", ") || "none chosen"}`);
  line(`Catalog year: ${t.header.catalogYear}    Expected graduation: ${t.header.expectedGraduation}    Date: ${t.header.date}`);
  line(t.header.disclaimer, true);
  if (t.header.gradesHidden) line("Grades hidden.");
  y += 8;

  // Plan grid: one column per term, grouped by academic year.
  heading("4-year plan");
  const years = academicYears(t.terms.map((x) => x.name));
  const cols = years.flatMap((yr) => yr.terms.map((name) => ({ year: yr.label, name })));
  const byName = new Map(t.terms.map((x) => [x.name, x]));
  const depth = Math.max(0, ...cols.map((c) => byName.get(c.name)?.courses.length ?? 0));
  const body = Array.from({ length: depth }, (_, i) =>
    cols.map((c) => {
      const course = byName.get(c.name)?.courses[i];
      if (!course) return "";
      return { content: `${course.id} (${course.credits})${course.grade ? ` ${course.grade}` : ""}`, styles: { fillColor: rgb(CATEGORY_COLORS[course.category]) } };
    }),
  );
  body.push(cols.map((c) => ({ content: `${byName.get(c.name)?.credits ?? 0} credits`, styles: { fontStyle: "bold" } })) as never);
  table({
    head: [years.map((yr) => ({ content: yr.label, colSpan: yr.terms.length })), cols.map((c) => c.name)],
    body,
    theme: "grid",
  });
  line("Legend: " + (Object.keys(CATEGORY_LABELS) as Category[]).map((c) => CATEGORY_LABELS[c]).join(" | "));
  y += 10;

  // Audit
  heading("Degree audit (with catalog rule)");
  // The catalog rule is per program, so it is cited once above that program's requirements.
  for (const p of t.audit) {
    if (y > doc.internal.pageSize.getHeight() - 110) {
      doc.addPage();
      y = margin;
    }
    y += 8; // text is drawn from its baseline, tables from their top
    line(`Catalog rule: ${p.citation}`);
    table({
      head: [[p.program, "Status", "Would satisfy"]],
      body: p.requirements.map((r) => [r.name, STATUS_TEXT[r.status], r.satisfiedBy.join(", ")]),
      theme: "striped",
      columnStyles: { 0: { cellWidth: 260 }, 1: { cellWidth: 70 } },
    });
  }

  if (t.flags.length) {
    heading("Flags for your advisor");
    for (const g of t.flags) {
      table({ head: [[g.title, "Where"]], body: g.items.map((i) => [i.message, [i.term, i.course].filter(Boolean).join(" ")]), theme: "plain", columnStyles: { 1: { cellWidth: 140 } } });
    }
  }
  if (t.prior.entries.length) {
    heading(`Prior credit (${t.prior.totalCredits} credits counted)`);
    table({ head: [["Source", "Status", "Credits"]], body: t.prior.entries.map((e) => [e.source, e.status, String(e.credits)]), theme: "striped" });
  }
  if (t.tracks.length) {
    heading("Tracks");
    for (const tr of t.tracks) {
      table({ head: [[tr.name, "Status", "Would satisfy"]], body: tr.requirements.map((r) => [r.name, STATUS_TEXT[r.status], r.satisfiedBy.join(", ")]), theme: "striped" });
    }
  }

  // Footer on every page.
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(110);
    doc.text(FOOTER, margin, h - 20);
    doc.text(`Page ${i} of ${pages}`, doc.internal.pageSize.getWidth() - margin, h - 20, { align: "right" });
  }
  return doc;
}
