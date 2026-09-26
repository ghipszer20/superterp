import type { Program } from "@superterp/audit";
import type { Track } from "./types.ts";

export * from "./types.ts";
export * from "./gpa.ts";

export const TRACKS: Track[] = [];

export function trackProgram(track: Track): Program {
  return { id: track.id, name: track.name, requirements: [] };
}
