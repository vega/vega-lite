#!/usr/bin/env bash

set -euo pipefail

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"
git checkout $GIT_BRANCH

echo "On branch $GIT_BRANCH."

# Only push on human pull request branches. Exclude release, prerelease, and bot branches.
if [ "$GIT_BRANCH" != "stable" ] && [ "$GIT_BRANCH" != "next" ] && [[ "$GIT_BRANCH" != dependabot/* ]]; then
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
  if [ "$PUSH_BRANCH" = true ]; then
    git add site/_includes/docs_toc.md site/Gemfile.lock
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
