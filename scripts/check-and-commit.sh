#!/usr/bin/env bash

set -euo pipefail

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"
git checkout $GIT_BRANCH

COMMIT_CHANGES = ! $GIT_BRANCH == 'master' && $GITHUB_EVENT_NAME === 'pull_request' && $GITHUB_HEAD_REF && $GITHUB_BASE_REF

echo ""
echo "------- Checking Schema -------"
echo ""

# Commit the schema if outdated
if ! git diff --exit-code ./build/vega-lite-schema.json
then
  if [[ $COMMIT_CHANGES ]]; then
    git add ./build/vega-lite-schema.json
    git commit -m "chore: update schema [CI]"
  else
    echo "Outdated schema."
    exit 1
  fi
fi

echo ""
echo "------- Checking Examples -------"
echo ""

if git log -1 | grep "\[SVG\]" && [[ $GIT_BRANCH != 'master' ]]; then
  echo "As the latest commit includes [SVG]. Rebuilding all SVGs."
  yarn build:examples-full
else
  yarn build:examples
fi

# Commit examples if outdated

# Note: we need to add all files first so that new files are included in `git diff --cached` too.
git add examples

if [[ $COMMIT_CHANGES ]]; then
  if ! git diff --cached --word-diff=color --exit-code examples
  then
    git commit -m "chore: update examples [CI]"
  fi
else
  # Don't diff SVG as floating point calculation is not always consistent
  if ! git diff --cached --word-diff=color --exit-code './examples/compiled/*.vg.json' './examples/specs/normalized/*.vl.json'
  then
    echo "Outdated examples."
    exit 1
  fi
fi

echo ""
echo "------- Checking Code Formatting -------"
echo ""

if [[ $COMMIT_CHANGES ]]; then
  ## For non-master branch, commit eslint fix and prettier changes if outdated
  if ! git diff --exit-code site src test test-runtime
  then
    git add --all
    git commit -m "style: auto-formatting [CI]"
  fi

  # should be empty
  git status

  # Then push all the changes (schema, examples, prettier)
  git pull --rebase origin ${GITHUB_REF}
  git push origin ${GITHUB_REF}
fi

exit 0
