# AGENTS.md

Canonical cross-agent guidance for the **hermes-glass** repository.

## What this repository is

A reusable, framework-light starter for building **Even Realities G2** smart-glasses applications with optional **R1 ring** input. Phase A is a capability playground with no Hermes coupling. Later phases add a thin Hermes client layer (`src/hermes/`) that talks to a self-hosted Hermes HTTP API.

The app is a standard web application (Vite + TypeScript) that runs inside the Even Realities phone app WebView. The G2 glasses render containers sent by the SDK; the phone hosts the logic.

## Authoritative documentation

- [Even Hub docs](https://hub.evenrealities.com/docs)
- [Architecture](https://hub.evenrealities.com/docs/getting-started/architecture) _(may 404; verify live)_
- [Quickstart](https://hub.evenrealities.com/docs/get-started/quickstart/index)
- [Overview / hardware](https://hub.evenrealities.com/docs/get-started/overview)
- [Input events](https://hub.evenrealities.com/docs/guides/input-events) _(may 404; verify live)_
- [Even Realities GitHub](https://github.com/even-realities)
- [Official templates](https://github.com/even-realities/evenhub-templates)
- [everything-evenhub AI skills](https://github.com/even-realities/everything-evenhub) ([Claude Code docs](https://hub.evenrealities.com/docs/AI-tooling/claude-code))

## Installed packages (verify versions in `package.json`)

| Package                            | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `@evenrealities/even_hub_sdk`      | G2 rendering, events, lifecycle |
| `@evenrealities/evenhub-cli`       | `evenhub pack`, `evenhub qr`    |
| `@evenrealities/evenhub-simulator` | Local glasses preview           |

## How to verify SDK behavior

1. Read the official docs for the feature you are changing.
2. Inspect installed types: `node_modules/@evenrealities/even_hub_sdk/dist/index.d.ts`
3. Compare docs vs installed types; if they conflict, document the conflict before changing code.
4. Prefer **installed package types** for exact APIs of the version pinned in this repo.
5. Run `npm run typecheck` after SDK integration changes.
6. Test in `evenhub-simulator` for layout/logic; validate on real G2 + R1 hardware for `EventSourceType.FROM_RING`, device status, and connection state.

## Commands

| Command                                      | Purpose                                   |
| -------------------------------------------- | ----------------------------------------- |
| `npm install`                                | Install dependencies                      |
| `npm run dev`                                | Vite dev server (`:5173`, `host: true`)   |
| `npm run build`                              | Typecheck + production build              |
| `npm run typecheck`                          | TypeScript only                           |
| `npm run lint`                               | ESLint                                    |
| `npm run format`                             | Prettier write                            |
| `npm run format:check`                       | Prettier check                            |
| `npm test`                                   | Vitest unit tests                         |
| `npm run simulate`                           | `evenhub-simulator http://localhost:5173` |
| `npm run pack`                               | `evenhub pack` → `.ehpk`                  |
| `npx evenhub qr --url http://<your-ip>:5173` | QR sideload to phone                      |

## Repository architecture

```
src/
  main.ts          # wiring only
  even/            # Even Hub SDK integration (isolated)
  app/             # generic application logic (no SDK imports)
  ui/              # browser debug surface
test/              # unit tests for pure logic
docs/              # verified architecture and workflows
```

**Boundary rule:** `src/even/` is the only place that imports `@evenrealities/even_hub_sdk`. `src/app/` must remain SDK-agnostic. Future Hermes HTTP transport lives in `src/hermes/` and must not leak into `src/even/`.

## Coding conventions

- Strict TypeScript; no casual `any`.
- Explicit types at hardware/SDK boundaries.
- Exhaustive handling for event unions where the SDK supports it.
- Small modules; direct typed callbacks over event buses.
- Coalesce protobuf zero values: `event.sysEvent?.eventType ?? 0` before comparing `CLICK_EVENT`.
- Taps/double-taps/lifecycle → `event.sysEvent`; scroll → `event.textEvent`.
- Double-tap must call `shutDownPageContainer(1)` regardless of envelope.
- Unsubscribe on `SYSTEM_EXIT_EVENT` / `ABNORMAL_EXIT_EVENT`.

## Rules against hallucinating SDK APIs

1. **Never invent** Even Hub SDK methods, event names, payload shapes, device capabilities, lifecycle behavior, CLI commands, or simulator behavior.
2. **Before changing** Even Hub integration code, inspect the relevant official documentation.
3. **Inspect** the installed SDK package types and source when behavior is version-specific.
4. Treat the official Even Hub documentation and official Even Realities repositories as primary sources.
5. Prefer installed package types for exact APIs of the version pinned in this repository.
6. If official docs and installed package types conflict, explicitly identify the conflict before changing code.
7. Do not use unofficial reverse-engineered BLE protocols unless explicitly requested.
8. Do not assume unsupported G2 or R1 hardware capabilities.
9. Keep G2-specific SDK code isolated from generic application logic.
10. Update `AGENTS.md` when project architecture or canonical commands materially change.

## Roadmap (high level)

- **Phase A (current):** generic G2/R1 starter, hardware-verified.
- **Phase B1:** read a known vault file via `GET /vault/file` (transport proof).
- **Phase B2:** ask Hermes via `POST /ask` (assistant loop).
- **Phase C+:** voice, writes, coding tasks.

Networking: backend-agnostic client; Hermes `baseUrl` + token configured on the phone WebView (not the glasses). Tailscale recommended for personal use. See `docs/development.md`.

## AI tooling (Cursor + everything-evenhub)

Even Realities publishes [everything-evenhub](https://github.com/even-realities/everything-evenhub) — 13 skills for G2 development ([docs](https://hub.evenrealities.com/docs/AI-tooling/claude-code)). Claude Code installs them as plugins; **Cursor cannot**. Instead:

1. Read `.cursor/rules/everything-evenhub.mdc` for skill → task mapping.
2. Consult upstream `SKILL.md` files on GitHub when implementing G2 UI, input, simulator, or packaging.
3. See `docs/ai-tooling.md` for the full mapping table.

Prefer installed SDK types over skill prose when they conflict.

## Public repository — secrets (mandatory)

This repo is **public on GitHub**. See `docs/security.md` and `.cursor/rules/secrets.mdc`.

1. **Never commit** API keys, bearer tokens, JWTs, Tailscale auth keys, AWS/GitHub credentials, or real `.env` files.
2. **Never put secrets in `VITE_*` env vars** — Vite bundles them into the client.
3. Hermes tokens (Phase B+): phone settings UI + SDK `setLocalStorage` only — never hardcoded.
4. Run `npm run secrets:check` before every commit.
5. Redact tokens in debug UI, logs, tests, and docs (use placeholders).
6. Rotate any credential immediately if accidentally committed.
7. Do not log `Authorization` headers or full authenticated request bodies.
8. `.env.example` may contain placeholders only; real values stay local.
9. Review `git diff` before push for pasted tokens or personal URLs.
10. Update `docs/security.md` when secret-handling architecture changes.
