// FileSnapshotStore against a real temp directory (no network, no mocks).

import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { defaultSnapshotDir, FileSnapshotStore, SNAPSHOT_SCHEMA } from "../src/snapshots/store.ts";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "superterp-store-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("FileSnapshotStore", () => {
  it("returns null for a key that was never written", async () => {
    expect(await new FileSnapshotStore(dir).get("libraries/hours")).toBeNull();
  });

  it("reads back what was put, with its updatedAt", async () => {
    const store = new FileSnapshotStore(dir);
    await store.put("dining/2026-09-25/19", { updatedAt: "2026-09-25T09:00:00.000Z", data: { meals: ["Lunch"] } });
    expect(await store.get("dining/2026-09-25/19")).toEqual({
      updatedAt: "2026-09-25T09:00:00.000Z",
      data: { meals: ["Lunch"] },
    });
  });

  it("stores each key as a JSON file under the directory, one folder per key segment", async () => {
    const store = new FileSnapshotStore(dir);
    await store.put("dining/2026-09-25/19", { updatedAt: "2026-09-25T09:00:00.000Z", data: 1 });
    const file = JSON.parse(readFileSync(join(dir, "dining", "2026-09-25", "19.json"), "utf8"));
    expect(file).toMatchObject({ schema: SNAPSHOT_SCHEMA, key: "dining/2026-09-25/19", data: 1 });
  });

  it("replaces an existing snapshot and leaves no temp files behind", async () => {
    const store = new FileSnapshotStore(dir);
    await store.put("libraries/hours", { updatedAt: "2026-09-25T09:00:00.000Z", data: "old" });
    await store.put("libraries/hours", { updatedAt: "2026-09-25T10:00:00.000Z", data: "new" });
    expect((await store.get("libraries/hours"))?.data).toBe("new");
    expect(readdirSync(join(dir, "libraries"))).toEqual(["hours.json"]);
  });

  it("treats a snapshot written under another schema version as missing", async () => {
    mkdirSync(join(dir, "libraries"));
    writeFileSync(
      join(dir, "libraries", "hours.json"),
      JSON.stringify({ schema: SNAPSHOT_SCHEMA + 1, key: "libraries/hours", updatedAt: "x", data: [] }),
    );
    expect(await new FileSnapshotStore(dir).get("libraries/hours")).toBeNull();
  });

  it("treats an unreadable (corrupt) file as missing", async () => {
    mkdirSync(join(dir, "libraries"));
    writeFileSync(join(dir, "libraries", "hours.json"), "{ not json");
    expect(await new FileSnapshotStore(dir).get("libraries/hours")).toBeNull();
  });

  it("rejects keys that could escape the directory", async () => {
    const store = new FileSnapshotStore(dir);
    await expect(store.put("../evil", { updatedAt: "x", data: 1 })).rejects.toThrow(/invalid snapshot key/i);
    await expect(store.get("a//b")).rejects.toThrow(/invalid snapshot key/i);
  });
});

describe("defaultSnapshotDir", () => {
  it("uses SUPERTERP_SNAPSHOT_DIR when set", () => {
    expect(defaultSnapshotDir("/anywhere", { SUPERTERP_SNAPSHOT_DIR: "/data/snaps" })).toBe("/data/snaps");
  });

  it("resolves to <repo root>/.cache/snapshots from any workspace folder", () => {
    writeFileSync(join(dir, "package-lock.json"), "{}");
    mkdirSync(join(dir, "apps", "web"), { recursive: true });
    mkdirSync(join(dir, "packages", "campus-data"), { recursive: true });
    const expected = join(dir, ".cache", "snapshots");
    expect(defaultSnapshotDir(join(dir, "apps", "web"), {})).toBe(expected);
    expect(defaultSnapshotDir(join(dir, "packages", "campus-data"), {})).toBe(expected);
  });
});
