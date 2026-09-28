# Working notes for the main session

Shell and tooling gotchas on the owner's PC. Moved out of PROJECT_MEMORY.md section 15 on 2026-09-27.

- Git Bash on this PC rewrites leading-slash arguments into Windows paths: prefix commands with `MSYS_NO_PATHCONV=1` when passing URL paths.
- In bash, `"$W\$1"` escapes the `$`; use forward slashes in Windows paths.
- **Never kill processes by image name** (`taskkill /IM node.exe` kills every Node process on the owner's PC). Kill only by PID, e.g. from `netstat -ano | grep :PORT`.
- Headless Edge `--screenshot` can't go below ~500px wide and fires before streamed content arrives. Use `apps/web/scripts/ui-check.mjs` (true mobile emulation, waits for JS).
- Next 16 ships its docs in `node_modules/next/dist/docs/`. Read them before using new APIs (Cache Components, `use cache`, `cacheLife`, `connection()`).
- Removing a worktree can fail on long `node_modules` paths: use the `\\?\` long-path prefix.
