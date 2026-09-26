import { describe, expect, it } from "vitest";
import { compactLibraryName } from "../libraries";

describe("compactLibraryName", () => {
  it("drops the 'Michelle Smith' prefix so the name fits a compact row", () => {
    expect(compactLibraryName("Michelle Smith Performing Arts Library")).toBe("Performing Arts Library");
  });

  it("leaves other library names unchanged", () => {
    expect(compactLibraryName("McKeldin Library")).toBe("McKeldin Library");
    expect(compactLibraryName("Architecture Library")).toBe("Architecture Library");
    expect(compactLibraryName("Art Library")).toBe("Art Library");
    expect(compactLibraryName("Hornbake Library")).toBe("Hornbake Library");
    expect(compactLibraryName("STEM Library")).toBe("STEM Library");
  });
});
