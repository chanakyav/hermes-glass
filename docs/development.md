# Development

## Prerequisites

- Node.js 20 LTS or 22+ (official quickstart recommendation)
- Even Realities app on phone, paired G2
- **Even Hub Developer Mode** enabled (web hub + app restart) — see [Real device workflow](#real-device-workflow)
- **iOS Developer Mode** enabled on iPhone (iOS 16+) if the toggle is missing — see [iPhone Developer Mode](#iphone-developer-mode-ios-16)
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

## iPhone Developer Mode (iOS 16+)

Apple hides the **Developer Mode** toggle in iPhone Settings until a Mac development environment registers the device. This is separate from [Even Hub Developer Mode](https://hub.evenrealities.com/docs/get-started/quickstart/index) but may be required before sideloading or debugging works reliably on iOS 16+.

If **Settings → Privacy & Security → Developer Mode** is missing, use a Mac with Xcode:

### Prerequisites

- iPhone running iOS 16 or newer
- Mac with [Xcode](https://apps.apple.com/app/xcode/id497799835) installed
- USB data cable

### Step 1: Establish a trusted connection

1. Connect your iPhone to your Mac with the USB cable.
2. Unlock your iPhone.
3. When **Trust This Computer?** appears, tap **Trust** and enter your passcode.

### Step 2: Register the device in Xcode

1. Open **Xcode** on your Mac.
2. On first launch, accept the license and let component installs finish.
3. Menu bar: **Window → Devices and Simulators**.
4. Under **Devices**, select your iPhone in the left sidebar.

This registers the device and prompts iOS to reveal the Developer Mode setting.

### Step 3: Enable Developer Mode on iOS

1. Force-quit the **Settings** app (swipe up, flick the card away).
2. Reopen **Settings → Privacy & Security**.
3. Scroll to the bottom of **Security** — **Developer Mode** should now appear.
4. Tap **Developer Mode**, turn it **ON**, and tap **Restart** when prompted.

### Step 4: Confirm after reboot

1. After the iPhone restarts, unlock the screen.
2. When **Turn on Developer Mode?** appears, tap **Turn On** (or **Enable**).
3. Enter your passcode to confirm.

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

| Symptom                                   | Likely cause                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| QR scans but app never loads              | Firewall / Wi-Fi AP isolation                                                                |
| No Developer Mode / QR in Even app        | Even Hub Developer Mode not enabled or app not restarted                                     |
| Developer Mode missing in iPhone Settings | iOS Developer Mode not revealed — see [iPhone Developer Mode](#iphone-developer-mode-ios-16) |
| R1 events missing in simulator            | Expected — use real R1 hardware                                                              |
| Connection state always `—` in simulator  | Expected — simulator does not emit status events                                             |
| `waitForEvenAppBridge` hangs              | Not running inside Even App WebView or simulator                                             |

## Sources

- [Quickstart](https://hub.evenrealities.com/docs/get-started/quickstart/index)
- [evenhub-templates README](https://github.com/even-realities/evenhub-templates)
