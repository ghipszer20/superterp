// Server-only entry point (uses node:fs). Import as "@superterp/campus-data/snapshots";
// never re-export from the package index, which client components import.
export * from "./build.ts";
export * from "./store.ts";
