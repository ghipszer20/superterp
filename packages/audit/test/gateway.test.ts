// CS Limited Enrollment Program gateway check. Expected results are worked
// out by hand from the owner-confirmed rule (PROJECT_MEMORY.md):
// matriculated Fall 2024 (202408) or later → B- in gateways and 3.0 GPA;
// earlier → C- and 2.7.

import { describe, expect, it } from "vitest";
import { checkCsGateway } from "../src/gateway.ts";
import type { StudentCourse } from "../src/audit.ts";
import * as pkg from "../src/index.ts";

const done = (id: string, grade?: string): StudentCourse => ({ id, credits: 4, status: "completed", grade });
const planned = (id: string): StudentCourse => ({ id, credits: 4, status: "planned" });

describe("package entry point", () => {
  it("exports checkCsGateway from the audit package index", () => {
    expect(pkg.checkCsGateway).toBe(checkCsGateway);
  });
});

describe("checkCsGateway: which rule applies", () => {
  it("applies the new rule (B-, 3.0) to a student who matriculated Fall 2024", () => {
    const result = checkCsGateway({ matriculationTerm: "202408", courses: [] });
    expect(result.rule).toEqual({ name: "fall-2024-or-later", minGrade: "B-", minGpa: 3.0 });
  });

  it("applies the old rule (C-, 2.7) to a student who matriculated Spring 2024", () => {
    const result = checkCsGateway({ matriculationTerm: "202401", courses: [] });
    expect(result.rule).toEqual({ name: "spring-2024-or-earlier", minGrade: "C-", minGpa: 2.7 });
  });

  it("applies the old rule to Summer 2024 (202405), which is before Fall 2024", () => {
    const result = checkCsGateway({ matriculationTerm: "202405", courses: [] });
    expect(result.rule.name).toBe("spring-2024-or-earlier");
  });

  it("applies the new rule to Winter 2024 (202412), which is after Fall 2024", () => {
    const result = checkCsGateway({ matriculationTerm: "202412", courses: [] });
    expect(result.rule.name).toBe("fall-2024-or-later");
  });

  it("rejects a term id that is not YYYY followed by 01, 05, 08 or 12", () => {
    expect(() => checkCsGateway({ matriculationTerm: "202409", courses: [] })).toThrow(/term/i);
  });
});

const NEW = "202408";
const OLD = "202401";
const gateway = (courses: StudentCourse[], id: string, matriculationTerm = NEW) =>
  checkCsGateway({ matriculationTerm, courses }).courses.find((c) => c.id === id);

describe("checkCsGateway: gateway course status", () => {
  it("meets a gateway with exactly B- under the new rule", () => {
    expect(gateway([done("MATH140", "B-")], "MATH140")).toEqual({
      id: "MATH140",
      name: "Calculus I",
      options: ["MATH140"],
      status: "met",
      satisfiedBy: "MATH140",
    });
  });

  it("marks a completed C+ as below-minimum under the new rule", () => {
    expect(gateway([done("MATH140", "C+")], "MATH140")?.status).toBe("below-minimum");
  });

  it("meets a gateway with exactly C- under the old rule", () => {
    expect(gateway([done("MATH140", "C-")], "MATH140", OLD)?.status).toBe("met");
  });

  it("marks a completed D+ as below-minimum under the old rule", () => {
    expect(gateway([done("MATH140", "D+")], "MATH140", OLD)?.status).toBe("below-minimum");
  });

  it("marks a gateway the student has not taken or planned as missing", () => {
    expect(gateway([done("ENGL101", "A")], "MATH140")?.status).toBe("missing");
  });

  it("marks a gateway that is only in the plan as planned", () => {
    expect(gateway([planned("MATH140")], "MATH140")?.status).toBe("planned");
  });

  it("meets the CMSC131 gateway with the CMSC141 substitute", () => {
    expect(gateway([done("CMSC141", "B")], "CMSC131")).toEqual({
      id: "CMSC131",
      name: "Object-Oriented Programming I",
      options: ["CMSC131", "CMSC141"],
      status: "met",
      satisfiedBy: "CMSC141",
    });
  });

  it("meets the CMSC132 gateway with the CMSC142 substitute", () => {
    expect(gateway([done("CMSC142", "A-")], "CMSC132")).toEqual({
      id: "CMSC132",
      name: "Object-Oriented Programming II",
      options: ["CMSC132", "CMSC142"],
      status: "met",
      satisfiedBy: "CMSC142",
    });
  });

  it("lists the three gateways in order: MATH140, CMSC131, CMSC132", () => {
    const result = checkCsGateway({ matriculationTerm: NEW, courses: [] });
    expect(result.courses.map((c) => c.id)).toEqual(["MATH140", "CMSC131", "CMSC132"]);
  });

  it("counts a passing retake after a failing attempt", () => {
    expect(gateway([done("CMSC131", "C"), done("CMSC131", "B")], "CMSC131")?.status).toBe("met");
  });

  it("counts the passing attempt regardless of list order (best attempt, not last)", () => {
    expect(gateway([done("CMSC131", "B"), done("CMSC131", "C")], "CMSC131")?.status).toBe("met");
  });

  it("counts a passing CMSC141 retake of a failed CMSC131", () => {
    expect(gateway([done("CMSC131", "C+"), done("CMSC141", "B-")], "CMSC131")?.satisfiedBy).toBe("CMSC141");
  });

  it("marks a below-minimum gateway with a planned retake as planned", () => {
    expect(gateway([done("MATH140", "C"), planned("MATH140")], "MATH140")?.status).toBe("planned");
  });

  it("does not meet a letter minimum with a pass/fail grade", () => {
    expect(gateway([done("MATH140", "P")], "MATH140")?.status).toBe("below-minimum");
  });

  it("does not meet a letter minimum with a completed course that has no grade", () => {
    expect(gateway([done("MATH140")], "MATH140")?.status).toBe("below-minimum");
  });
});

const gpa = (cumulativeGpa: number | undefined, matriculationTerm = NEW) =>
  checkCsGateway({ matriculationTerm, courses: [], cumulativeGpa }).gpa;

describe("checkCsGateway: GPA status", () => {
  it("meets the new rule's GPA at exactly 3.0", () => {
    expect(gpa(3.0)).toBe("met");
  });

  it("is below the new rule's GPA at 2.99", () => {
    expect(gpa(2.99)).toBe("below");
  });

  it("is unknown when no GPA is given", () => {
    expect(gpa(undefined)).toBe("unknown");
  });

  it("meets the old rule's GPA at exactly 2.7", () => {
    expect(gpa(2.7, OLD)).toBe("met");
  });

  it("is below the old rule's GPA at 2.69", () => {
    expect(gpa(2.69, OLD)).toBe("below");
  });
});

const allGatewaysAt = (grade: string) => [done("MATH140", grade), done("CMSC131", grade), done("CMSC132", grade)];
const overall = (courses: StudentCourse[], cumulativeGpa: number | undefined, matriculationTerm = NEW) =>
  checkCsGateway({ matriculationTerm, courses, cumulativeGpa }).overall;

describe("checkCsGateway: overall status", () => {
  it("is eligible when every gateway is met and the GPA is met", () => {
    expect(overall(allGatewaysAt("B-"), 3.0)).toBe("eligible");
  });

  it("is not-yet when a gateway is only planned", () => {
    expect(overall([done("MATH140", "A"), done("CMSC131", "A"), planned("CMSC132")], 3.5)).toBe("not-yet");
  });

  it("is not-yet when every gateway is met but the GPA is unknown", () => {
    expect(overall(allGatewaysAt("A"), undefined)).toBe("not-yet");
  });

  it("is ineligible when a gateway was completed below the minimum with no retake planned", () => {
    expect(overall([done("MATH140", "C+"), done("CMSC131", "A"), done("CMSC132", "A")], 3.5)).toBe("ineligible");
  });

  it("is not-yet (not ineligible) when gateways are met but the GPA is below, since GPA can still rise", () => {
    expect(overall(allGatewaysAt("A"), 2.99)).toBe("not-yet");
  });

  it("is not-yet when a gateway is missing", () => {
    expect(overall([done("MATH140", "A"), done("CMSC131", "A")], 3.5)).toBe("not-yet");
  });

  it("is not-yet when a below-minimum gateway has a retake planned", () => {
    expect(overall([done("MATH140", "C"), planned("MATH140"), done("CMSC131", "A"), done("CMSC132", "A")], 3.5)).toBe(
      "not-yet",
    );
  });

  it("is ineligible even when another gateway is planned and the GPA is unknown", () => {
    expect(overall([done("MATH140", "D"), planned("CMSC131"), planned("CMSC132")], undefined)).toBe("ineligible");
  });

  it("is eligible under the old rule with all C- gateways and exactly 2.7", () => {
    expect(overall(allGatewaysAt("C-"), 2.7, OLD)).toBe("eligible");
  });

  it("is ineligible under the new rule with the same C- gateways", () => {
    expect(overall(allGatewaysAt("C-"), 3.5, NEW)).toBe("ineligible");
  });
});
