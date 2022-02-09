#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "You must provide the new version to the script. The current version is $(./scripts/version.sh vega-lite)."
  exit 1
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != "stable" ]; then
  if [ "$(git rev-parse --abbrev-ref HEAD)" != $2 ]; then
    echo "Not on stable, please checkout stable branch before running this script or provide the branch name as the second parameter if you want to release from non-stable branch."
    exit 1
  else
    echo "Note: releasing from a non-stable branch '$2'."
  fi
fi

set -x

yarn version --new-version $1 --no-git-tag-version

git add package.json

git commit -m "chore: release v$1 [skip ci]"
git tag -m "Release v$1." "v$1"
