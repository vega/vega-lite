#!/usr/bin/env bash

set -e

if [[ $GITHUB_REF != refs/heads/* ]]; then
  echo "${GITHUB_REF} is not a ref."
  exit 0;
fi

PREFIX=refs/heads/
BRANCH=${GITHUB_REF#"$PREFIX"}

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git checkout $BRANCH

echo ""
echo "------- Checking Schema -------"
echo ""

# Commit the schema if outdated
if ! git diff --exit-code ./build/vega-lite-schema.json
then
  ## Only do this for master
  if [[ $BRANCH == 'master' ]]; then
    echo "Outdated schema."
    exit 1
  else
    git add ./build/vega-lite-schema.json
    git commit -m "[CI] Update schema"
  fi
fi

echo ""
echo "------- Checking Examples -------"
echo ""


if git log -1 | grep "\[SVG\]" && [[ $BRANCH != 'master' ]]; then
  echo "As the latest commit includes [SVG]. Rebuilding all SVGs."
  yarn build:examples-full
else
  yarn build:examples
fi

# Commit examples if outdated

# Note: we need to add all files first so that new files are included in `git diff --cached` too.
# Note: git commands need single quotes for all the files and directories with wildcards
git add ./examples/compiled/vega_version './examples/compiled/*.vg.json' './examples/compiled/*.svg' './examples/specs/normalized/*.vl.json'

if [[ $BRANCH == 'master' ]]; then
  # Don't diff SVG as floating point calculation is not always consistent
  if ! git diff --cached --word-diff=color --exit-code './examples/compiled/*.vg.json' './examples/specs/normalized/*.vl.json'
  then
    echo "Outdated examples."
    exit 1
  fi
else
  if ! git diff --cached --word-diff=color --exit-code ./examples/compiled/vega_version './examples/compiled/*.vg.json' './examples/compiled/*.svg' './examples/specs/normalized/*.vl.json'
  then
    git commit -m "[CI] Update examples"
  fi
fi


echo ""
echo "------- Checking Code Formatting -------"
echo ""

if [[ $BRANCH != 'master' ]]; then
  ## For non-master branch, commit eslint fix and prettier changes if outdated
  if ! git diff --word-diff=color --exit-code  src test test-runtime
  then
    git add src test test-runtime
    git commit -m "[CI] Auto-formatting"
  fi

  # Then push all the changes (schema, examples, prettier)
  git remote add origin-pushable https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git > /dev/null 2>&1
  git push origin-pushable ${GITHUB_REF}
fi

exit 0
