# Hermes Glass

A reusable starter for **Even Realities G2** smart-glasses applications with optional **R1 ring** input. Phase A is a capability playground with no Hermes coupling. Later phases add a thin client for a self-hosted [Hermes](https://github.com/) assistant over HTTP.

Adapted from the official [evenhub-templates/minimal](https://github.com/even-realities/evenhub-templates/tree/main/minimal) scaffold.

## What this is

- A **web app** (Vite + TypeScript) that runs in the Even Realities phone app WebView
- Renders a simple message on the **G2** display via the Even Hub SDK
- Handles **G2** and **R1** input events with a browser debug panel for development
- Separates SDK integration (`src/even/`) from generic app logic (`src/app/`)

## What the G2 and R1 contribute

| Device | Role                                                                               |
| ------ | ---------------------------------------------------------------------------------- |
| **G2** | 576×288 monochrome display; temple touchpads (tap, double-tap, scroll)             |
| **R1** | Optional ring with the same gestures; distinguished by `EventSourceType.FROM_RING` |

## Architecture

```
Phone WebView (this app)
  └─ Even Hub SDK bridge
       └─ BLE → G2 display + input (+ R1)
```

See [docs/architecture.md](docs/architecture.md) for details.

## Prerequisites

- Node.js 20+ or 22+
- Even Realities app, paired G2, Developer Mode
- Optional: R1 ring

## Installation

```bash
npm install
```

## Local development

```bash
npm run dev
```

Open the companion debug UI in a browser, or use the simulator:

```bash
npm run simulate
```

## Real device testing

```bash
npm run dev
npx evenhub qr --url http://<your-ip>:5173
```

Scan the QR in the Even Realities app (Developer Mode required).

## Scripts

| Script              | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Vite dev server                |
| `npm run build`     | Typecheck + production build   |
| `npm run typecheck` | TypeScript check               |
| `npm run lint`      | ESLint                         |
| `npm run format`    | Prettier                       |
| `npm test`          | Vitest unit tests              |
| `npm run simulate`  | Even Hub simulator             |
| `npm run pack`      | Package `.ehpk` for submission |

## Project structure

```
src/
  main.ts       # entry wiring
  even/         # Even Hub SDK integration
  app/          # generic state logic (no SDK)
  ui/           # browser debug panel
docs/           # architecture, development, capabilities
AGENTS.md       # AI agent guidance
```

## Documentation

- [Architecture](docs/architecture.md)
- [Development](docs/development.md)
- [Capabilities matrix](docs/capabilities.md)
- [AI tooling (Cursor + everything-evenhub)](docs/ai-tooling.md)
- [Security (public repo)](docs/security.md)
- [Even Hub docs](https://hub.evenrealities.com/docs)
- [Official templates](https://github.com/even-realities/evenhub-templates)
- [everything-evenhub skills](https://hub.evenrealities.com/docs/AI-tooling/claude-code)

## Current limitations

- Phase A only — no Hermes HTTP integration yet
- Simulator does not emit R1 events or device status
- Text display only (no voice, images, or pagination yet)
- R1 and connection status require hardware verification

## Public repository

This project is built in public. **Do not commit secrets.** See [docs/security.md](docs/security.md). Run `npm run secrets:check` before pushing.

## Roadmap

1. **Phase A** — generic starter (current)
2. **Phase B1** — read vault file via `GET /vault/file` (transport proof)
3. **Phase B2** — ask Hermes via `POST /ask` (assistant loop)
4. **Phase C** — voice round-trip
5. **Phase D** — vault writes
6. **Phase E** — coding tasks / GitHub

## Next steps

- Hardware-verify G2 + R1 event sources and device status on your paired devices
- Add Hermes HTTP endpoint on EC2 (`POST /ask`)
- Implement Phase B1 pagination using the `text-heavy` template pattern
