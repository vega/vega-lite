#!/usr/bin/env bash

set -euo pipefail

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"
git checkout $GIT_BRANCH

COMMIT_CHANGES = ! $GIT_BRANCH == 'master' && $GITHUB_EVENT_NAME === 'pull_request' && $GITHUB_HEAD_REF && $GITHUB_BASE_REF


echo ""
echo "------- Checking TOC -------"
echo ""

# Commit the TOC if outdated
if ! git diff --exit-code ./site/_includes/docs_toc.md
then
  ## Only do this for master
  if [[ $COMMIT_CHANGES ]]; then
    git add ./site/_includes/docs_toc.md
    git commit -m "chore: update TOC [CI]"

    # Push all the TOC changes
    git pull --rebase origin ${GITHUB_REF}
    git push origin ${GITHUB_REF}
  else
    echo "Outdated TOC."
    exit 1
  fi
fi

exit 0
