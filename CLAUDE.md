# SuperTerp

All-in-one UMD student app (iOS + web).

**Main session (the one talking with the owner):** read `PROJECT_MEMORY.md` before doing any work, and update it whenever a decision changes. It holds the full context, decisions, workflow rules and current state; detail lives in `docs/project/`.

**Builders (subagents dispatched to implement a task):** do NOT read `PROJECT_MEMORY.md`. Build only from your brief: it has the goal, the files involved, the owner rulings that apply and the done criteria. Read other `docs/project/` files only when the brief points to them. Work test-first in your own worktree and branch, and push early and often. The main session reviews your work before it merges.

Use the mattpocock-skills where they apply: tdd for new logic, domain-modeling for the degree-audit domain, code-review before finishing a branch.
Use the superpowers plugin skills for how work is done (brainstorming before new features, test-driven-development, systematic-debugging, verification-before-completion, requesting-code-review, finishing-a-development-branch). Where superpowers and mattpocock-skills overlap, prefer superpowers; keep mattpocock domain-modeling for the degree-audit domain.
Also use these superpowers skills whenever relevant (owner, 2026-09-25): verification-before-completion, requesting-code-review, finishing-a-development-branch, writing-plans, subagent-driven-development, dispatching-parallel-agents.
When dispatching agents, PROJECT_MEMORY.md section 18 (builder budget) overrides these skills' defaults: builders on Sonnet, one agent per task with no reviewer subagents, at most 2 at once, short briefs.
