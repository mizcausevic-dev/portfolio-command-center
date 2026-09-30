#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
tests_root="$repo_root/tests"
remote="$repo_root/scripts/hostinger-portfolio-remote.sh"
fixture=$(mktemp -d "$tests_root/.hostinger-test.XXXXXX")
cleanup() {
  local resolved
  resolved=$(cd -- "$fixture" && pwd -P) || return
  [[ "$resolved" == "$tests_root"/.hostinger-test.* ]] || {
    echo 'Refusing to remove unexpected fixture path' >&2
    return 1
  }
  rm -rf -- "$resolved"
}
trap cleanup EXIT

fail() { echo "$*" >&2; exit 1; }
expect_failure() {
  if "$@" >/dev/null 2>&1; then
    fail "Expected failure: $*"
  fi
}

sha_a=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
sha_b=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
run_id=12345
mkdir -p "$fixture/portfolio"
printf 'old html\n' > "$fixture/portfolio/index.html"
bash "$remote" "$fixture" preflight "$sha_a" "$run_id"
mkdir "$fixture/.portfolio-release-$sha_a"
expect_failure bash "$remote" "$fixture" preflight "$sha_a" "$run_id"
printf 'new A html\n' > "$fixture/.portfolio-release-$sha_a/index.html"
printf '{"commit":"%s"}\n' "$sha_a" > "$fixture/.portfolio-release-$sha_a/release.json"

bash "$remote" "$fixture" swap "$sha_a" "$run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'new A html' ]] || fail 'Swap did not publish new site'
[[ $(cat "$fixture/.portfolio-backup-$sha_a/index.html") == 'old html' ]] || fail 'Swap did not retain old site'
expect_failure bash "$remote" "$fixture" preflight "$sha_a" "$run_id"
expect_failure bash "$remote" "$fixture" swap "$sha_a" "$run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'new A html' ]] || fail 'Backup collision changed live site'

# Simulate a failed live check. The old site is restored and the failed release
# remains available for diagnosis without deleting either version.
bash "$remote" "$fixture" restore-failed "$sha_a" "$run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'old html' ]] || fail 'Failed verification did not restore old site'
[[ $(cat "$fixture/.portfolio-failed-$sha_a-$run_id/index.html") == 'new A html' ]] || fail 'Failed release was lost'

if [[ $(uname -s) != MINGW* ]]; then
  ln -s "$fixture/portfolio" "$fixture/.portfolio-release-$sha_b"
  [[ -L "$fixture/.portfolio-release-$sha_b" ]] || fail 'Expected a symlink test fixture'
  expect_failure bash "$remote" "$fixture" preflight "$sha_b" "$run_id"
  rm -- "$fixture/.portfolio-release-$sha_b"
else
  echo 'Symlink case runs in Linux CI; Git Bash symlinks are emulated on this host' >&2
fi
bash "$remote" "$fixture" preflight "$sha_b" "$run_id"
mkdir "$fixture/.portfolio-release-$sha_b"
printf 'new B html\n' > "$fixture/.portfolio-release-$sha_b/index.html"
printf '{"commit":"%s"}\n' "$sha_b" > "$fixture/.portfolio-release-$sha_b/release.json"
bash "$remote" "$fixture" swap "$sha_b" "$run_id"
printf '{"commit":"%s"}\n' "$sha_a" > "$fixture/portfolio/release.json"
expect_failure bash "$remote" "$fixture" rollback "$sha_b" "$run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'new B html' ]] || fail 'Wrong marker changed live site'
printf '{"commit":"%s"}\n' "$sha_b" > "$fixture/portfolio/release.json"
bash "$remote" "$fixture" rollback "$sha_b" "$run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'old html' ]] || fail 'Manual rollback did not restore old site'
[[ $(cat "$fixture/.portfolio-displaced-$sha_b-$run_id/index.html") == 'new B html' ]] || fail 'Rolled-back release was lost'

# If the rollback itself fails its live check, undo preserves the original
# backup and brings the exact new release back online.
bash "$remote" "$fixture" undo-rollback "$sha_b" "$run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'new B html' ]] || fail 'Undo did not restore new site'
[[ $(cat "$fixture/.portfolio-backup-$sha_b/index.html") == 'old html' ]] || fail 'Undo lost old backup'

# A successful rollback drill can be followed by a fresh deployment of the
# same reviewed commit. The displaced new release remains available too.
second_run_id=12346
bash "$remote" "$fixture" rollback "$sha_b" "$second_run_id"
bash "$remote" "$fixture" preflight "$sha_b" "$second_run_id"
mkdir "$fixture/.portfolio-release-$sha_b"
cp -- "$fixture/.portfolio-displaced-$sha_b-$second_run_id/index.html" "$fixture/.portfolio-release-$sha_b/index.html"
cp -- "$fixture/.portfolio-displaced-$sha_b-$second_run_id/release.json" "$fixture/.portfolio-release-$sha_b/release.json"
bash "$remote" "$fixture" swap "$sha_b" "$second_run_id"
[[ $(cat "$fixture/portfolio/index.html") == 'new B html' ]] || fail 'Redeploy after rollback did not restore new site'
[[ $(cat "$fixture/.portfolio-backup-$sha_b/index.html") == 'old html' ]] || fail 'Redeploy after rollback lost old backup'
[[ $(cat "$fixture/.portfolio-displaced-$sha_b-$second_run_id/index.html") == 'new B html' ]] || fail 'Redeploy removed displaced release'

expect_failure bash "$remote" "$fixture" rollback 'bad;touch /tmp/nope' "$run_id"
expect_failure bash "$remote" "$fixture/../other" rollback "$sha_b" "$run_id"
expect_failure bash "$remote" "$fixture" rollback "$sha_b" 'bad-id'
echo 'Hostinger swap, failure restore, manual rollback, undo, and invalid-input tests passed'
