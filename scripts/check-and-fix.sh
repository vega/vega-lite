#!/usr/bin/env bash

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git checkout $TRAVIS_BRANCH


echo ""
echo "------- Checking Schema -------"
echo ""

# Commit the schema if outdated
if ! git diff --exit-code HEAD -- ./build/vega-lite-schema.json
then
  ## Only do this for master
  if [[ $TRAVIS_BRANCH == 'master' ]]; then
    echo "Outdated schema."
    exit 1
  else
    git add ./build/vega-lite-schema.json
    git commit -m "[Travis] Update schema (build: $TRAVIS_BUILD_NUMBER)"
  fi
fi

echo ""
echo "------- Checking Examples -------"
echo ""

# Commit examples if outdated
if ! git diff --word-diff=color --exit-code HEAD -- ./examples/compiled/vega_version ./examples/compiled/*.vg.json ./examples/specs/normalized/*.vl.json
then
  if [[ $TRAVIS_BRANCH == 'master' ]]; then
    echo "Outdated examples."
    exit 1
  else
    git add ./examples/compiled/vega_version ./examples/compiled/*.vg.json ./examples/specs/normalized/*.vl.json
    git commit -m "[Travis] Update examples (build: $TRAVIS_BUILD_NUMBER)"
  fi
fi


echo ""
echo "------- Checking Code Formatting -------"
echo ""

## For non-master branch, commit tslint fix and prettier changes if outdated
if [[ $TRAVIS_BRANCH != 'master' ]]; then
  yarn format
  if ! git diff --word-diff=color --exit-code HEAD -- src test test-runtime
  then
    git add src test test-runtime
    git commit -m "[Travis] Auto-formatting (build: $TRAVIS_BUILD_NUMBER)"
  fi
fi

git remote add origin-pushable https://${GH_TOKEN}@github.com/vega/vega-lite.git > /dev/null 2>&1
git push --set-upstream origin-pushable

exit 0

