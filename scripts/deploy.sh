#!/bin/bash

. ./scripts/pre-deploy.sh

# 1. NPM PUBLISH

npm run clean
npm run test
npm run build

# Check if all required files are here
if ! [ -f build/vega-lite.js ]; then
  echo "${RED} build/vega-lite.js not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite.js.map ]; then
  echo "${RED} build/vega-lite.js.map not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite.min.js ]; then
  echo "${RED} build/vega-lite.min.js not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite.min.js.map ]; then
  echo "${RED} build/vega-lite.min.js.map not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite-schema.json ]; then
  echo "${RED} build/vega-lite-schema.json not found${NC}"
  exit 1;
fi
if ! [ -f build/src/vl.js ]; then
  echo "${RED} build/src/vl.js not found.  Typescripts may be not compiled.${NC}"
  exit 1;
fi
if ! [ -f build/src/vl.d.ts ]; then
  echo "${RED} build/src/vl.d.ts not found.  Typescript declarations may be not compiled.${NC}"
  exit 1;
fi

# Use NPM tag to prevent people getting this by default when running `npm install``
# https://medium.com/@mbostock/prereleases-and-npm-e778fc5e2420#.i9ko1erii
npm publish --tag pre

# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
	echo "${RED} npm publish failed.  Publishing canceled. ${NC} \n\n"
	exit $rc;
fi

# 2. BOWER PUBLISH

# read version
gitsha=$(git rev-parse HEAD)
version=$(scripts/version.sh)

git checkout head
npm run build
# add the compiled files, commit and tag!
git add build/** -f

# commit, tag and push to gh-pages and swap back to master
set +e
git commit -m "Release $version $gitsha"
set -e
git tag -am "Release v$version." "v$version"

# swap back to the clean master and push the new tag
git checkout master
git push --tags
# now the published tag contains build files which work great with bower.

# TODO: re-publish to github pages when we are ready to release 2.0.
#  3. GITHUB PAGES PUBLISH
# . scripts/deploy-gh.sh

. ./scripts/deploy-schema.sh
