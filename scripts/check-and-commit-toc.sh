#!/usr/bin/env bash

set -e

scripts/setup-git-ci.sh

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "On branch $GIT_BRANCH."

echo ""
echo "------- Checking TOC -------"
echo ""

# Commit the TOC if outdated
if ! git diff --exit-code ./site/_includes/docs_toc.md
then
  ## Only do this for master
  if [[ $GIT_BRANCH == 'master' ]]; then
    echo "Outdated TOC."
    exit 1
  else
    git add ./site/_includes/docs_toc.md
    git commit -m "chore: update TOC [CI]"
  fi
fi

echo ""
echo "------- Checking Code Formatting -------"
echo ""

if [[ $GIT_BRANCH != 'master' ]]; then
  # Push all the TOC changes
  git pull --rebase origin ${GITHUB_REF}
  git push origin ${GITHUB_REF}
fi

exit 0
