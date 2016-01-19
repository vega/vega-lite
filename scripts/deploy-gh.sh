#!/bin/bash

. ./scripts/pre-deploy.sh

git checkout gh-pages
git merge master --no-edit

# update bower_components
git rm -rf bower_components
bower install
git add bower_components/* -f

# build
npm run build:all
git add vega-lite* -f
git add site/gallery.js -f

# commit if things changed
if [ -n "$(git status --porcelain)" ]; then
  version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')
  git commit -m "release $version"
fi

# push and return to master!
git push
git checkout master
