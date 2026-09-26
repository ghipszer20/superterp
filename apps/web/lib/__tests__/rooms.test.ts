import { describe, expect, it } from "vitest";
import { shortLibraryName } from "../rooms";

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
