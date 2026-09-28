// Migration safety net (docs/project/program-batches.md): the registry moved from one hand-written
// line per program to metadata declared in each program file, assembled by a generator
// (scripts/build-registry.ts). This test guards the move itself -- it proves the live registry
// still carries the exact same programs, with the exact same fields, as the frozen pre-migration
// snapshot (fixtures/original-registry-snapshot.ts), a copy of src/registry.ts before any program
// file was touched. Order isn't compared: the generator orders alphabetically by name within each
// kind (a fixed rule, tested in registry.test.ts), not the old file's ad hoc/historical order,
// so a handful of entries legitimately land in a different position than before.
import { describe, expect, it } from "vitest";
import { PROGRAMS as LIVE } from "../src/registry.ts";
import { PROGRAMS as ORIGINAL } from "./fixtures/original-registry-snapshot.ts";

// Drops `load` (a function; not meaningfully comparable by value) and sorts by id, so the
// comparison is about content, not listing order or function identity.
const comparable = (list: readonly { id: string; load: unknown }[]) =>
  list.map(({ load: _load, ...rest }) => rest).sort((a, b) => a.id.localeCompare(b.id));

describe("registry migration", () => {
  it("carries the same programs, with the same fields, as the original hand-written registry", () => {
    expect(comparable(LIVE)).toEqual(comparable(ORIGINAL));
  });

  it("has exactly as many programs as the original", () => {
    expect(LIVE.length).toBe(ORIGINAL.length);
  });
});
