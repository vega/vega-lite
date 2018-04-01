#!/usr/bin/env bash

set -x
set -e

scripts/pre-deploy.sh

git checkout gh-pages
git pull
git merge master --no-edit

# build
npm run presite
cp build/Vegemite-schema.json _data/  # the latest schema may not have been copied
git add data/* -f
git add build/** -f
git add _data/* -f
git add examples/compiled/*.png -f
git add site/examples/* -f

# commit if things changed
if [ -n "$(git status --porcelain)" ]; then
  version=$(scripts/version.sh Vegemite)
  git commit -m "release $version"
fi

# push and return to master!
git push
git checkout master
npm run data
