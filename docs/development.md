# Development

## Prerequisites

- Node.js 20 LTS or 22+ (official quickstart recommendation)
- Even Realities app on phone, paired G2, Developer Mode enabled
- Optional: R1 ring paired
- Global tooling (or use local `npx`):

```bash
npm install -g @evenrealities/evenhub-cli @evenrealities/evenhub-simulator
```

## Install

```bash
npm install
```

## Local development

```bash
npm run dev
```

Vite serves on `http://0.0.0.0:5173` (`host: true` for phone access).

## Simulator workflow

In a second terminal:

```bash
npm run simulate
# or: npx evenhub-simulator http://localhost:5173
```

Simulator supports: Up, Down, Click, Double Click. It hardcodes `eventSource = FROM_GLASSES_R` and does **not** emit device status events. R1 and connection state require real hardware.

Automation API (v0.7+):

```bash
evenhub-simulator http://localhost:5173 --automation-port 9898
```

## Real device workflow

1. Enable Developer Mode on [hub.evenrealities.com](https://hub.evenrealities.com/login)
2. Force-quit and reopen the Even Realities app
3. Start dev server: `npm run dev`
4. Generate QR:

```bash
npx evenhub qr --url http://<your-laptop-ip>:5173
```

5. Scan QR in the app; ensure phone and laptop are on the same network (watch firewall / AP isolation)

## Build and pack

```bash
npm run build
npm run pack   # produces .ehpk for dev portal upload
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run secrets:check   # required before commit — public repo
```

## Networking (Phase B+)

For Hermes on self-hosted EC2:

- **Do not hardcode** endpoints; use configurable `baseUrl` + token on the phone settings page.
- **Tailscale (recommended for personal use):** join phone + EC2 to one tailnet; serve Hermes over `https://<machine>.<tailnet>.ts.net` using `tailscale cert`.
- **CORS** must be configured on Hermes regardless of Tailscale.
- **Mixed content:** HTTPS pages cannot call `http://` APIs from the WebView.
- Verify reachability on real hardware during Phase B1.

## Troubleshooting

| Symptom                                  | Likely cause                                     |
| ---------------------------------------- | ------------------------------------------------ |
| QR scans but app never loads             | Firewall / Wi-Fi AP isolation                    |
| No Developer Mode / QR                   | Developer Mode not enabled or app not restarted  |
| R1 events missing in simulator           | Expected — use real R1 hardware                  |
| Connection state always `—` in simulator | Expected — simulator does not emit status events |
| `waitForEvenAppBridge` hangs             | Not running inside Even App WebView or simulator |

## Sources

- [Quickstart](https://hub.evenrealities.com/docs/get-started/quickstart/index)
- [evenhub-templates README](https://github.com/even-realities/evenhub-templates)
