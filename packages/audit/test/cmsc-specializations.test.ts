// Golden tests for the CS major's four specializations (2026-27 department pages): each accepts a
// complete, realistic plan and rejects one missing a specialization-specific required course.
// The concentration and "5 distributive areas from >=3" pieces are shared with the General Track
// (see cmsc-major.test.ts) and aren't re-tested exhaustively here.

import { describe, expect, it } from "vitest";
import { auditProgram, type StudentCourse } from "../src/audit.ts";
import {
  cmscCybersecurity,
  cmscDataScience,
  cmscMachineLearning,
  cmscQuantumInformation,
} from "../programs/cmsc-specializations-2026-27.ts";

const c = (id: string, credits = 3): StudentCourse => ({ id, credits, status: "completed", grade: "B" });

const LOWER_LEVEL: StudentCourse[] = [
  c("MATH140", 4),
  c("MATH141", 4),
  c("CMSC131", 4),
  c("CMSC132", 4),
  c("CMSC216", 4),
  c("CMSC250", 4),
  c("CMSC330"),
  c("CMSC351"),
];
const CONCENTRATION: StudentCourse[] = [c("ECON300"), c("ECON305"), c("ECON310"), c("ECON410")];

const statusesOf = async (program: Parameters<typeof auditProgram>[0], courses: StudentCourse[]) =>
  Object.fromEntries((await auditProgram(program, courses)).requirements.map((r) => [r.id, r.status]));

describe("CS Cybersecurity specialization", () => {
  const plan: StudentCourse[] = [
    ...LOWER_LEVEL,
    c("STAT400"),
    c("MATH240", 4),
    c("CMSC414"),
    c("CMSC456"),
    c("CMSC411"),
    c("CMSC430"),
    c("CMSC431"),
    c("CMSC451"),
    c("CMSC320"),
    ...CONCENTRATION,
  ];

  it("passes a complete plan", async () => {
    const statuses = await statusesOf(cmscCybersecurity, plan);
    for (const [id, status] of Object.entries(statuses)) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
  });

  it("flags a missing required course (CMSC456 Cryptology)", async () => {
    const statuses = await statusesOf(cmscCybersecurity, plan.filter((x) => x.id !== "CMSC456"));
    expect(statuses.cmsc456).toBe("missing");
  });

  it("is unverified until the owner signs off", () => {
    expect(cmscCybersecurity.verified).toBe(false);
    expect(cmscCybersecurity.reviewNotes!.length).toBeGreaterThan(0);
  });
});

describe("CS Data Science specialization", () => {
  const plan: StudentCourse[] = [
    ...LOWER_LEVEL,
    c("MATH240", 4),
    c("STAT400"),
    c("CMSC320"),
    c("CMSC422"),
    c("CMSC424"),
    c("CMSC421"),
    c("CMSC451"),
    c("CMSC411"),
    c("CMSC430"),
    ...CONCENTRATION,
  ];

  it("passes a complete plan", async () => {
    const statuses = await statusesOf(cmscDataScience, plan);
    for (const [id, status] of Object.entries(statuses)) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
  });

  it("flags a missing required course (CMSC424 Database Design)", async () => {
    const statuses = await statusesOf(cmscDataScience, plan.filter((x) => x.id !== "CMSC424"));
    expect(statuses.cmsc424).toBe("missing");
  });

  it("accepts MATH461 as the Linear Algebra requirement (department page adds it to MATH240)", async () => {
    const withMath461 = [...plan.filter((x) => x.id !== "MATH240"), c("MATH461")];
    const statuses = await statusesOf(cmscDataScience, withMath461);
    expect(statuses.linearAlgebra).toBe("satisfied");
  });

  it("is unverified until the owner signs off", () => {
    expect(cmscDataScience.verified).toBe(false);
    expect(cmscDataScience.reviewNotes!.length).toBeGreaterThan(0);
  });
});

describe("CS Machine Learning specialization", () => {
  const plan: StudentCourse[] = [
    ...LOWER_LEVEL,
    c("STAT400"),
    c("MATH240", 4),
    c("CMSC320"),
    c("CMSC421"),
    c("CMSC422"),
    c("CMSC474"),
    c("CMSC426"),
    c("CMSC414"),
    c("CMSC335"),
    ...CONCENTRATION,
  ];

  it("passes a complete plan", async () => {
    const statuses = await statusesOf(cmscMachineLearning, plan);
    for (const [id, status] of Object.entries(statuses)) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
  });

  it("flags a missing required course (CMSC421 Introduction to Artificial Intelligence)", async () => {
    const statuses = await statusesOf(cmscMachineLearning, plan.filter((x) => x.id !== "CMSC421"));
    expect(statuses.cmsc421).toBe("missing");
  });

  it("accepts MATH401 for the choose-two requirement (department page option)", async () => {
    const withMath401 = [...plan.filter((x) => x.id !== "CMSC426"), c("MATH401")];
    const statuses = await statusesOf(cmscMachineLearning, withMath401);
    expect(statuses["ml-choose2"]).toBe("satisfied");
  });

  it("is unverified until the owner signs off", () => {
    expect(cmscMachineLearning.verified).toBe(false);
    expect(cmscMachineLearning.reviewNotes!.length).toBeGreaterThan(0);
  });
});

describe("CS Quantum Information specialization", () => {
  const plan: StudentCourse[] = [
    ...LOWER_LEVEL,
    c("STAT400"),
    c("MATH240", 4),
    c("CMSC457"),
    c("PHYS467"),
    c("CMSC412", 4),
    c("CMSC420"),
    c("CMSC430"),
    c("CMSC460"),
    c("CMSC320"),
    ...CONCENTRATION,
  ];

  it("passes a complete plan", async () => {
    const statuses = await statusesOf(cmscQuantumInformation, plan);
    for (const [id, status] of Object.entries(statuses)) expect(`${id}: ${status}`).toBe(`${id}: satisfied`);
  });

  it("flags a missing required course (PHYS467)", async () => {
    const statuses = await statusesOf(cmscQuantumInformation, plan.filter((x) => x.id !== "PHYS467"));
    expect(statuses.phys467).toBe("missing");
  });

  it("is unverified until the owner signs off", () => {
    expect(cmscQuantumInformation.verified).toBe(false);
    expect(cmscQuantumInformation.reviewNotes!.length).toBeGreaterThan(0);
  });
});
