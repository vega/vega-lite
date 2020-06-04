#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "You must provide the new version to the script. The current version is $(./scripts/version.sh vega-lite)."
  exit 1
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  if [ "$(git rev-parse --abbrev-ref HEAD)" != $2 ]; then
    echo "Not on master, please checkout master branch before running this script or provide the branch name as the second parameter if you want to release from non-master branch."
    exit 1
  else
    echo "Note: releasing from a non-master branch '$2'."
  fi
fi

set -x

yarn version --new-version $1 --no-git-tag-version

yarn build:versions
git add site/_data/versions.yml package.json

git commit -m "chore: release v$1"
git tag -m "Release v$1." "v$1"
