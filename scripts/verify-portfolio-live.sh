#!/usr/bin/env bash
# Verify the exact deployed HTML bytes, then ensure its referenced JS is live.
set -euo pipefail

url=${1:?live URL required}
expected_html_sha=${2:?expected HTML SHA-256 required}
expected_release_sha=${3:-}
[[ "$expected_html_sha" =~ ^[0-9a-f]{64}$ ]] || exit 2
[[ -z "$expected_release_sha" || "$expected_release_sha" =~ ^[0-9a-f]{40}$ ]] || exit 2
[[ "$url" == 'https://portfolio.kineticgain.com/' ]] || exit 2

html_file=$(mktemp)
marker_file=$(mktemp)
trap 'rm -f -- "$html_file" "$marker_file"' EXIT
nonce="${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}-$(date +%s%N)"

curl -fsSL --retry 5 --retry-delay 3 \
  -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' \
  "${url}?kg_verify=${nonce}" -o "$html_file"
actual_html_sha=$(sha256sum "$html_file" | cut -d ' ' -f 1)
[[ "$actual_html_sha" == "$expected_html_sha" ]] || {
  echo "Live HTML SHA-256 mismatch: expected $expected_html_sha, got $actual_html_sha" >&2
  exit 1
}

asset=$(grep -oE '/assets/[^" ]+\.js' "$html_file" | head -n 1)
[[ -n "$asset" ]] || { echo 'Live HTML has no built JS asset' >&2; exit 1; }
curl -fsSL --retry 5 --retry-delay 3 \
  -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' \
  "${url%/}${asset}?kg_verify=${nonce}" -o /dev/null

if [[ -n "$expected_release_sha" ]]; then
  curl -fsSL --retry 5 --retry-delay 3 \
    -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' \
    "${url}release.json?kg_verify=${nonce}" -o "$marker_file"
  grep -Fqx "{\"commit\":\"$expected_release_sha\"}" "$marker_file" || {
    echo 'Live release marker does not match the expected commit' >&2
    exit 1
  }
fi

echo "Verified deployed HTML SHA-256 $actual_html_sha and built asset $asset"
