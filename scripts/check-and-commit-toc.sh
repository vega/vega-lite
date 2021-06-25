#!/usr/bin/env bash

set -euo pipefail

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"
git checkout $GIT_BRANCH

echo "On branch $GIT_BRANCH."

if [ "$GIT_BRANCH" != "master" ] && [[ "$GIT_BRANCH" != dependabot/* ]]; then
  PUSH_BRANCH=true
  echo "Will try to push changes."
else
  PUSH_BRANCH=false
  echo "Will not push changes."
fi

echo ""
echo "------- Checking TOC -------"
echo ""

# Commit the TOC if outdated
if ! git diff --exit-code ./site/_includes/docs_toc.md
then
  ## Only do this for master
  if [ "$PUSH_BRANCH" = true ]; then
    git add ./site/_includes/docs_toc.md
    git commit -m "chore: update TOC [CI]"

    # Push all the TOC changes
    git pull --rebase
    git push
  else
    echo "Outdated TOC."
    exit 1
  fi
fi

exit 0
