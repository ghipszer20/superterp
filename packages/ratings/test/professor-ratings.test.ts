// Ratings for the instructors in the Schedule of Classes, from PlanetTerp's /professors list.

import { describe, expect, it } from "vitest";
import { parseProfessorList, ratingsForInstructors } from "../src/professor-ratings.ts";

const pt = (name: string, averageRating: number | null) => ({ name, averageRating });

describe("parseProfessorList", () => {
  it("reads one /professors page (name and average rating)", () => {
    const page = [
      { courses: ["CMSC351"], average_rating: 3.1, type: "professor", name: "Ting Jiang", slug: "jiang" },
      { courses: [], average_rating: null, type: "ta", name: "A Seyed", slug: "seyed" },
    ];
    expect(parseProfessorList(page)).toEqual([pt("Ting Jiang", 3.1), pt("A Seyed", null)]);
  });

  it("rejects a page that isn't a list", () => {
    expect(() => parseProfessorList({ error: "limit parameter must be no more than 100" })).toThrow(/list/);
  });
});

describe("ratingsForInstructors", () => {
  it("keys each rating by the Schedule of Classes spelling", () => {
    expect(ratingsForInstructors([pt("Ting Jiang", 3.1)], ["Ting  Jiang"])).toEqual({ "Ting  Jiang": 3.1 });
  });

  it("matches despite case, accents and a middle name", () => {
    const out = ratingsForInstructors([pt("José A. Núñez", 4.2)], ["Jose Nunez"]);
    expect(out).toEqual({ "Jose Nunez": 4.2 });
  });

  it("prefers an exact name over a first-and-last match", () => {
    const out = ratingsForInstructors([pt("Anna Maria Lee", 2), pt("Anna Lee", 4.5)], ["Anna Lee"]);
    expect(out).toEqual({ "Anna Lee": 4.5 });
  });

  it("leaves out ambiguous first-and-last matches (two different people)", () => {
    const out = ratingsForInstructors([pt("John A Smith", 2), pt("John B Smith", 5)], ["John Smith"]);
    expect(out).toEqual({});
  });

  it("leaves out unrated professors, TBA and instructors PlanetTerp doesn't know", () => {
    const out = ratingsForInstructors([pt("Ada Byron", null)], ["Ada Byron", "TBA", "Grace Hopper"]);
    expect(out).toEqual({});
  });

  it("rounds ratings to two decimals to keep the files small", () => {
    expect(ratingsForInstructors([pt("Ting Jiang", 3.14159)], ["Ting Jiang"])).toEqual({ "Ting Jiang": 3.14 });
  });
});
