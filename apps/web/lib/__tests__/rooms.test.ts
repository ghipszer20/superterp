import { describe, expect, it } from "vitest";
import { roomFitsSize, shortLibraryName } from "../rooms";

describe("roomFitsSize", () => {
  it("fits a solo student (size 1) into every room, even one with unknown capacity", () => {
    expect(roomFitsSize(null, 1)).toBe(true);
    expect(roomFitsSize(1, 1)).toBe(true);
    expect(roomFitsSize(8, 1)).toBe(true);
  });

  it("requires a known capacity at least the requested size for a group", () => {
    expect(roomFitsSize(4, 4)).toBe(true);
    expect(roomFitsSize(3, 4)).toBe(false);
    expect(roomFitsSize(null, 4)).toBe(false);
  });
});

describe("shortLibraryName", () => {
  it("drops the building the library sits inside", () => {
    expect(shortLibraryName("Art Library in Art Sociology Building")).toBe("Art");
    expect(shortLibraryName("STEM Library in William E. Kirwan Hall")).toBe("STEM");
  });

  it("drops the trailing 'Library'", () => {
    expect(shortLibraryName("McKeldin Library")).toBe("McKeldin");
  });

  it("shortens Michelle Smith Performing Arts to just Performing Arts", () => {
    expect(shortLibraryName("Michelle Smith Performing Arts Library")).toBe("Performing Arts");
  });
});
