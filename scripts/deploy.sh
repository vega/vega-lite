#!/usr/bin/env bash

set -x
set -e

scripts/pre-deploy.sh

# 1. NPM PUBLISH

npm run clean
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
if ! [ -f build/src/index.js ]; then
  echo "${RED} build/src/index.js not found.  Typescripts may not be compiled.${NC}"
  exit 1;
fi
if ! [ -f build/src/index.d.ts ]; then
  echo "${RED} build/src/index.d.ts not found.  Typescript declarations may not be compiled.${NC}"
  exit 1;
fi

npm publish

# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
	echo "${RED} npm publish failed.  Publishing canceled. ${NC} \n\n"
	exit $rc;
fi

# 2. TAG RELEASE

gitsha=$(git rev-parse HEAD)
version=$(scripts/version.sh vega-lite)

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

# 3. SCHEMA
scripts/deploy-schema.sh

# 4. GITHUB PAGES PUBLISH
scripts/deploy-gh.sh
