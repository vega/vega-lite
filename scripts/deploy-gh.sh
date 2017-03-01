#!/bin/bash

. ./scripts/pre-deploy.sh

git checkout gh-pages
git pull
git merge master --no-edit

# build
npm run presite
npm run build:images
git add data/* -f
git add build/** -f

# commit if things changed
if [ -n "$(git status --porcelain)" ]; then
  version=$(scripts/version.sh vega-lite)
  git commit -m "release $version"
fi

# push and return to master!
git push
git checkout master
