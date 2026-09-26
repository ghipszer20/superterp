import { describe, expect, it } from "vitest";
import { parseSignoffRequest, reviewEnabled, sameOrigin } from "../review-guard";

describe("reviewEnabled", () => {
  it("is on in development", () => {
    expect(reviewEnabled({ NODE_ENV: "development" })).toBe(true);
  });

  it("is off in a production build unless SUPERTERP_REVIEW=1", () => {
    expect(reviewEnabled({ NODE_ENV: "production" })).toBe(false);
    expect(reviewEnabled({ NODE_ENV: "production", SUPERTERP_REVIEW: "true" })).toBe(false);
    expect(reviewEnabled({ NODE_ENV: "production", SUPERTERP_REVIEW: "1" })).toBe(true);
  });

  it("is off in tests and when nothing is set", () => {
    expect(reviewEnabled({ NODE_ENV: "test" })).toBe(false);
    expect(reviewEnabled({})).toBe(false);
  });
});

describe("sameOrigin", () => {
  it("accepts a request whose Origin matches its Host", () => {
    expect(sameOrigin(new Headers({ origin: "http://localhost:3000", host: "localhost:3000" }))).toBe(true);
  });

  it("rejects a cross-site or origin-less request", () => {
    expect(sameOrigin(new Headers({ origin: "https://evil.example", host: "localhost:3000" }))).toBe(false);
    expect(sameOrigin(new Headers({ host: "localhost:3000" }))).toBe(false);
  });
});

describe("parseSignoffRequest", () => {
  it("accepts each kind of update", () => {
    expect(parseSignoffRequest({ id: "a/b", update: { action: "item", key: "footnote-1234abcd", resolved: true } })).toEqual({
      id: "a/b",
      update: { action: "item", key: "footnote-1234abcd", resolved: true },
    });
    expect(parseSignoffRequest({ id: "a", update: { action: "item", key: "k", note: "x" } })?.update).toEqual({ action: "item", key: "k", note: "x" });
    expect(parseSignoffRequest({ id: "a", update: { action: "notes", notes: "n" } })?.update).toEqual({ action: "notes", notes: "n" });
    expect(parseSignoffRequest({ id: "a", update: { action: "verify" } })?.update).toEqual({ action: "verify" });
    expect(parseSignoffRequest({ id: "a", update: { action: "reopen" } })?.update).toEqual({ action: "reopen" });
  });

  it("drops fields that don't belong to the action, so the client can't set the date or hashes", () => {
    expect(parseSignoffRequest({ id: "a", update: { action: "verify", date: "1999-01-01", catalogHash: "x" } })?.update).toEqual({ action: "verify" });
  });

  it("rejects malformed requests", () => {
    for (const body of [
      null,
      "x",
      { id: "", update: { action: "reopen" } },
      { id: 3, update: { action: "reopen" } },
      { id: "a", update: { action: "delete" } },
      { id: "a", update: { action: "item", resolved: true } },
      { id: "a", update: { action: "item", key: "k", resolved: "yes" } },
      { id: "a", update: { action: "notes" } },
      { id: "a", update: { action: "notes", notes: "x".repeat(20_001) } },
    ]) {
      expect(parseSignoffRequest(body), JSON.stringify(body)).toBeNull();
    }
  });
});
