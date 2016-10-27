#!/bin/bash

. ./scripts/pre-deploy.sh

# 1. NPM PUBLISH

# build:all (clean, rebuild, compile, test, and lint)
npm run build:all

# Check if all required files are here
if ! [ -f vega-lite.js ]; then
  echo "${RED} vega-lite.js not found ${NC}"
  exit 1;
fi
if ! [ -f vega-lite.js.map ]; then
  echo "${RED} vega-lite.js.map not found ${NC}"
  exit 1;
fi
if ! [ -f vega-lite.min.js ]; then
  echo "${RED} vega-lite.min.js not found ${NC}"
  exit 1;
fi
if ! [ -f vega-lite.min.js.map ]; then
  echo "${RED} vega-lite.min.js.map not found ${NC}"
  exit 1;
fi
if ! [ -f vega-lite-schema.json ]; then
  echo "${RED} vega-lite-schema.json not found${NC}"
  exit 1;
fi
if ! [ -f src/vl.js ]; then
  echo "${RED} src/vl.js not found.  Typescripts may be not compiled.${NC}"
  exit 1;
fi
if ! [ -f src/vl.d.ts ]; then
  echo "${RED} src/vl.d.ts not found.  Typescript declarations may be not compiled.${NC}"
  exit 1;
fi

npm publish
# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
	echo "${RED} npm publish failed.  Publishing canceled. ${NC} \n\n"
	exit $rc;
fi

# 2. BOWER PUBLISH

# read version
gitsha=$(git rev-parse HEAD)
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')

git checkout head
npm run build:all
# add the compiled files, commit and tag!
git add vega-lite* -f
git add src/**/*.js -f

# commit, tag and push to gh-pages and swap back to master
set +e
git commit -m "Release $version $gitsha"
set -e
git tag -am "Release v$version." "v$version"

# swap back to the clean master and push the new tag
git checkout 1.x
git push --tags
# now the published tag contains build files which work great with bower.

#  3. GITHUB PAGES PUBLISH
. ./scripts/deploy-gh.sh
