# Prelaunch checklist (first-draft plan items 16 and 17)

Session 1 of `next-steps-plan.md` keeps this current. Nothing here rewrites the git history. The owner decides that step before the repo goes public.

## Done
- **License:** `LICENSE` is Apache-2.0, and the root `package.json` says `"license": "Apache-2.0"` (checked 2026-09-28).
- **Secret scan (2026-09-28):** tracked files and all history were scanned for API-key, AWS, GitHub-token and private-key patterns: nothing found. No `.env` file or transcript was ever committed. `.gitignore` covers `.env*` (except `.env.example`), `transcripts/` and `*transcript*.pdf`.

## Personal details to scrub before going public
- **The owner's academic profile:**
  - PROJECT_MEMORY.md section 13 "Owner profile", and section 17 ("The owner is in Math Applied").
  - `docs/project/rulings.md` (Math rulings) and `docs/project/first-draft-plan.md` (the test students).
  - Comments in `packages/audit/programs/cmsc-major-2026-27.ts` and `math-major-applied-2026-27.ts`.
- **The local Windows user path** (`C:/Users/<user>/...`):
  - `CLAUDE.md`;
  - `.claude/agents/major-builder.md` and `minor-builder.md`;
  - PROJECT_MEMORY.md sections 13 and 18;
  - `docs/project/minors-plan.md`.

  Replace it with a relative path or a placeholder.
- **Internal working docs:** decide whether `docs/project/` (status log, owner review, session plans) is published at all, or moved out of the public repo.
- **Git history:** the same details appear in older commits. The options are to publish a fresh squashed history, or to rewrite it with `git filter-repo`. The owner decides.

## Still to do
- **GTFS license:** Transitland (`f-shuttleum~md~us`) points to the "Interline GTFS license" (`github.com/transitland/gtfs-archives-not-hosted-elsewhere/.../interline-gtfs-license.md`), but that link returned 404 on 2026-09-28. The feed itself is published at `feed.actionfigure.ai`. Before public launch, confirm the terms with the publisher or DOTS; this can go in the same email as the GTFS-RT key request (PROJECT_MEMORY section 10).
- **Terms and privacy pages:** drafts of the clickwrap terms and the privacy page (legal.md). This is a UI change, so the owner approves it.
- **"Not affiliated with the University of Maryland" on every page:** check it once the deployed layout exists.
