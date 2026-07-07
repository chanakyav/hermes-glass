# CLAUDE.md

Read **`AGENTS.md` first** for full project guidance.

## Critical constraints

- This is an **Even Realities G2** WebView app using `@evenrealities/even_hub_sdk`. Optional **R1** input is distinguished by `EventSourceType.TOUCH_EVENT_FROM_RING` on `sysEvent`.
- **Never invent SDK APIs.** Inspect `node_modules/@evenrealities/even_hub_sdk/dist/index.d.ts` and official docs before changing `src/even/`.
- Only `src/even/` may import the SDK. `src/app/` stays SDK-agnostic.
- Protobuf omits zero: coalesce `event.sysEvent?.eventType ?? 0` before comparing `CLICK_EVENT`.
- Double-tap exit: `shutDownPageContainer(1)` from either `sysEvent` or `textEvent`.

## Canonical docs

- https://hub.evenrealities.com/docs
- https://hub.evenrealities.com/docs/get-started/quickstart/index
- https://github.com/even-realities/evenhub-templates
- https://github.com/even-realities/everything-evenhub (official G2 AI skills — see `docs/ai-tooling.md` for Cursor)

## Public repo

Never commit secrets. Read `docs/security.md`. Run `npm run secrets:check` before commit.

## Quick commands

`npm run dev` · `npm run simulate` · `npm test` · `npm run typecheck`
