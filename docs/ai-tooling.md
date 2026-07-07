# AI tooling

## Official Even Realities skills (everything-evenhub)

Even Realities maintains [everything-evenhub](https://github.com/even-realities/everything-evenhub), an open-source skill set for building G2 apps. Documentation: [Claude Code plugin](https://hub.evenrealities.com/docs/AI-tooling/claude-code).

It includes 13 skills across three tiers:

| Tier      | Skills                                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| One-click | `quickstart`, `template`, `build-and-deploy`                                                                                           |
| Core dev  | `glasses-ui`, `handle-input`, `device-features`, `background-state`, `test-with-simulator`, `simulator-automation`, `font-measurement` |
| Reference | `sdk-reference`, `cli-reference`, `design-guidelines`                                                                                  |

### Claude Code / Codex CLI

Install the official plugin:

```bash
/plugin marketplace add even-realities/everything-evenhub
/plugin install everything-evenhub
```

Then invoke skills by name, e.g. `/handle-input "double press exits"`.

### Cursor (this project)

Cursor does not install Claude Code plugins. Instead:

1. **Project rules** in `.cursor/rules/` — especially `everything-evenhub.mdc` and `even-hub-sdk.mdc`
2. **`AGENTS.md`** — canonical cross-agent guidance
3. **Upstream skill files** — agents should read the matching `SKILL.md` from GitHub when implementing a topic:

   `https://github.com/even-realities/everything-evenhub/tree/main/plugins/everything-evenhub/skills/<skill>/SKILL.md`

### When to consult which skill

| You are working on…            | Skill                                         |
| ------------------------------ | --------------------------------------------- |
| G2 text/list/image layout      | `glasses-ui`, `design-guidelines`             |
| Tap, scroll, R1, lifecycle     | `handle-input`                                |
| Mic, IMU, localStorage         | `device-features`                             |
| Long text pagination (Phase B) | `font-measurement`, `text-heavy` template     |
| Simulator testing              | `test-with-simulator`, `simulator-automation` |
| Packaging for Even Hub         | `build-and-deploy`, `cli-reference`           |
| SDK symbol lookup              | `sdk-reference`                               |

Always prefer installed package types over skill prose when they conflict.

## This repository's AI context files

| File                  | Purpose                           |
| --------------------- | --------------------------------- |
| `AGENTS.md`           | Canonical guidance for all agents |
| `CLAUDE.md`           | Short pointer for Claude Code     |
| `.cursor/rules/*.mdc` | Cursor-specific focused rules     |
