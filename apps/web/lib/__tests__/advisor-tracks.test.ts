import { describe, expect, it } from "vitest";
import { toggleTrack } from "../advisor/tracks";

describe("toggleTrack", () => {
  it("adds a track id that isn't picked yet", () => {
    expect(toggleTrack([], "pre-med")).toEqual(["pre-med"]);
    expect(toggleTrack(["pre-med"], "pre-law")).toEqual(["pre-med", "pre-law"]);
  });

  it("removes a track id that's already picked", () => {
    expect(toggleTrack(["pre-med", "pre-law"], "pre-med")).toEqual(["pre-law"]);
  });
});
