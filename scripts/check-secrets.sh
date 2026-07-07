#!/usr/bin/env bash
# Scan tracked and staged files for common secret patterns.
# Excludes node_modules, dist, and lockfiles.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PATTERNS=(
  'AKIA[0-9A-Z]{16}'
  'ghp_[A-Za-z0-9]{20,}'
  'github_pat_[A-Za-z0-9_]{20,}'
  'sk-[A-Za-z0-9]{20,}'
  'xox[baprs]-[A-Za-z0-9-]{10,}'
  'Bearer [A-Za-z0-9._-]{20,}'
  'tskey-auth-[A-Za-z0-9-]+'
  '-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----'
)

EXCLUDES=(
  --glob '!node_modules/**'
  --glob '!dist/**'
  --glob '!package-lock.json'
  --glob '!scripts/check-secrets.sh'
  --glob '!.env.example'
)

FAILED=0

for pattern in "${PATTERNS[@]}"; do
  if rg -n "${EXCLUDES[@]}" "$pattern" . 2>/dev/null; then
    echo "ERROR: Possible secret matched pattern: $pattern" >&2
    FAILED=1
  fi
done

# Block committed .env files (but allow .env.example)
if git ls-files --error-unmatch .env >/dev/null 2>&1; then
  echo "ERROR: .env is tracked by git — remove it and add to .gitignore" >&2
  FAILED=1
fi

if [[ "$FAILED" -ne 0 ]]; then
  exit 1
fi

echo "secrets:check passed"
