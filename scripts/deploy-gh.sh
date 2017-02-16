#!/bin/bash

. ./scripts/pre-deploy.sh

git checkout gh-pages
git pull
git merge master --no-edit

# update bower_components
git rm -rf bower_components
bower install
git add bower_components/* -f

# build
npm run build:all
git add data/* -f
git add build/** -f
git add site/static/*.js -f
git add examples/images/*.svg -f

# commit if things changed
if [ -n "$(git status --porcelain)" ]; then
  version=$(scripts/version.sh)
  git commit -m "release $version"
fi

# push and return to master!
git push
git checkout master
