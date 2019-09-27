#!/usr/bin/env bash

set -e

if [ "$#" -ne 1 ]; then
  echo "You must provide the new version to the script. The current version is $(./scripts/version.sh vega-lite)."
  exit 1
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "Not on master, please checkout master branch before running this script."
  exit 1
fi

set -x

yarn version --new-version $1 --no-git-tag-version

yarn build:versions
git add site/_data/versions.yml package.json

git commit -m "chore: release v$1"
git tag -m "Release v$1." "v$1"
