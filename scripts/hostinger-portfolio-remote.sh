#!/usr/bin/env bash
# Runs on the Hostinger SSH host. Every path stays beneath the supplied
# public_html directory; the workflow supplies that directory from a
# validated SSH_USER and supplies only full, lower-case Git commit SHAs.
set -euo pipefail

root=${1:?public_html directory required}
operation=${2:?operation required}
release_sha=${3:?release SHA required}
run_id=${4:?run ID required}

[[ "$root" == /* && "$root" != *".."* && "$root" != *$'\n'* ]] || {
  echo 'Invalid deployment root' >&2
  exit 2
}
[[ "$release_sha" =~ ^[0-9a-f]{40}$ ]] || {
  echo 'Release SHA must be 40 lower-case hex characters' >&2
  exit 2
}
[[ "$run_id" =~ ^[0-9]+$ ]] || {
  echo 'Invalid run ID' >&2
  exit 2
}
[[ -d "$root" && ! -L "$root" ]] || {
  echo 'Deployment root does not exist or is a symlink' >&2
  exit 2
}
root=$(cd -- "$root" && pwd -P)

target="$root/portfolio"
release="$root/.portfolio-release-$release_sha"
backup="$root/.portfolio-backup-$release_sha"
failed="$root/.portfolio-failed-$release_sha-$run_id"
displaced="$root/.portfolio-displaced-$release_sha-$run_id"

require_site() {
  local site=$1
  [[ -d "$site" && ! -L "$site" && -f "$site/index.html" ]] || {
    echo "Expected a built portfolio at $site" >&2
    exit 1
  }
}

require_vacant() {
  [[ ! -e "$1" && ! -L "$1" ]] || {
    echo "Refusing to overwrite $1" >&2
    exit 1
  }
}

case "$operation" in
  preflight)
    require_site "$target"
    require_vacant "$backup"
    require_vacant "$release"
    ;;
  target-hash)
    require_site "$target"
    sha256sum "$target/index.html" | cut -d ' ' -f 1
    ;;
  backup-hash)
    require_site "$backup"
    sha256sum "$backup/index.html" | cut -d ' ' -f 1
    ;;
  swap)
    require_site "$target"
    require_site "$release"
    require_vacant "$backup"
    mv -- "$target" "$backup"
    if ! mv -- "$release" "$target"; then
      mv -- "$backup" "$target"
      exit 1
    fi
    ;;
  restore-failed)
    require_site "$target"
    require_site "$backup"
    require_vacant "$failed"
    mv -- "$target" "$failed"
    if ! mv -- "$backup" "$target"; then
      mv -- "$failed" "$target"
      exit 1
    fi
    ;;
  rollback)
    require_site "$target"
    require_site "$backup"
    require_vacant "$displaced"
    [[ -f "$target/release.json" ]] &&
      grep -Fqx "{\"commit\":\"$release_sha\"}" "$target/release.json" || {
        echo 'Live release marker does not match rollback SHA' >&2
        exit 1
      }
    mv -- "$target" "$displaced"
    if ! mv -- "$backup" "$target"; then
      mv -- "$displaced" "$target"
      exit 1
    fi
    ;;
  undo-rollback)
    require_site "$target"
    require_site "$displaced"
    require_vacant "$backup"
    [[ -f "$displaced/release.json" ]] &&
      grep -Fqx "{\"commit\":\"$release_sha\"}" "$displaced/release.json" || {
        echo 'Displaced release marker does not match rollback SHA' >&2
        exit 1
      }
    mv -- "$target" "$backup"
    if ! mv -- "$displaced" "$target"; then
      mv -- "$backup" "$target"
      exit 1
    fi
    ;;
  *)
    echo 'Unsupported deployment operation' >&2
    exit 2
    ;;
esac
