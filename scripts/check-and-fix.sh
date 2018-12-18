#!/usr/bin/env bash

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git checkout $TRAVIS_BRANCH

node_version=$(node --version | cut -d. -f1 | cut -c2-)

if [[ $node_version != '11' ]]; then
  exit 0;
fi

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


if git log -1 | grep "\[SVG\]" && [[ $TRAVIS_BRANCH != 'master' ]]; then
  echo "As the latest commit includes [SVG], let's force rebuilding all SVGs"
  yarn build:examples-full
elif git diff --word-diff=color --exit-code HEAD -- ./examples/compiled/vega_version
then
  echo "Different Vega version, let's force rebuilding all SVGs"
  yarn build:examples-full
elif git diff --word-diff=color --exit-code HEAD -- ./examples/specs
then
  echo "As the latest commit includes spec changes, let's force rebuilding all SVGs"
  yarn build:examples-full
else
  yarn build:examples
fi

# Commit examples if outdated

# Note: we need to add all files first so that new files are included in `git diff --cached` too.
git add -v ./examples/compiled/vega_version './examples/compiled/*.vg.json' './examples/compiled/*.svg' './examples/specs/normalized/*.vl.json'

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  # Don't diff SVG as floating point calculation is not always consistent
  if ! git diff --cached --word-diff=color --exit-code HEAD -- ./examples/compiled/*.vg.json ./examples/specs/normalized/*.vl.json
  then
    echo "Outdated examples."
    exit 1
  fi
else
  if ! git diff --cached --word-diff=color --exit-code HEAD -- ./examples/compiled/vega_version ./examples/compiled/*.vg.json ./examples/compiled/*.svg ./examples/specs/normalized/*.vl.json
  then
    git commit -v -m "[Travis] Update examples (build: $TRAVIS_BUILD_NUMBER)"
  fi
fi


echo ""
echo "------- Checking Code Formatting -------"
echo ""

if [[ $TRAVIS_BRANCH != 'master' ]]; then
  yarn format

  ## For non-master branch, commit tslint fix and prettier changes if outdated
  if ! git diff --word-diff=color --exit-code HEAD -- src test test-runtime
  then
    git add src test test-runtime
    git commit -m "[Travis] Auto-formatting (build: $TRAVIS_BUILD_NUMBER)"
  fi

  # Then push all the changes (schema, examples, prettier)
  git remote add origin-pushable https://${GH_TOKEN}@github.com/vega/vega-lite.git > /dev/null 2>&1
  git push --set-upstream origin-pushable
fi

exit 0

