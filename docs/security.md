# Security (public repository)

This project is intended to be **public on GitHub**. Treat every commit as world-readable.

## Threat model

| Asset                     | Risk if leaked                                | Mitigation                                                     |
| ------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| Hermes API token          | Unauthorized access to your assistant + vault | Token only in device localStorage; rotate if exposed           |
| Tailscale auth key        | Network access to your tailnet                | Never in repo; use `tailscale up` interactively                |
| AWS / GitHub credentials  | Infrastructure compromise                     | Server-side only on EC2; never in this client repo             |
| Personal tailnet hostname | Reconnaissance                                | Example placeholders in docs; real URL in device settings only |

## What must never be committed

- `.env` with real values (`.env.example` with placeholders is fine)
- API keys, bearer tokens, JWTs, session cookies
- `ghp_*`, `github_pat_*`, `AKIA*`, Tailscale pre-auth keys
- Private keys (`*.pem`, `id_rsa`, `*.key`)
- Obsidian sync credentials
- Debug logs or screenshots with tokens

## Client-side secret storage (Phase B+)

The G2 app runs in a phone WebView. **There is no secure enclave** for secrets in the client bundle.

Approved pattern:

1. User enters Hermes `baseUrl` + token on the **phone settings screen** (companion UI).
2. Persist via SDK `bridge.setLocalStorage('hermes_token', …)` — not in source code.
3. Never use `VITE_HERMES_TOKEN` or similar; Vite inlines `VITE_*` into the shipped bundle.

For personal use, combine token auth with **Tailscale** so Hermes is not exposed to the public internet.

## Pre-commit checklist

```bash
npm run secrets:check   # scan for common secret patterns
git diff                # manual review before push
```

If a secret was committed:

1. **Rotate** the credential immediately (revoke old token/key).
2. Remove from git history if needed (`git filter-repo` or BFG) — rotation alone may suffice for low-risk tokens.
3. Do not assume deletion from history removes copies (forks, CI logs).

## Debug UI rules

- Never display full tokens in the browser debug panel.
- Redact `Authorization` headers in logged fetch errors.
- Do not commit test fixtures with real credentials.

## Reporting

If you discover a leaked secret in this repo's history, rotate the credential and open an issue (or fix privately first if actively exploited).
