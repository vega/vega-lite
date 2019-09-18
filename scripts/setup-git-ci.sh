#!/usr/bin/env bash

set -e

if [[ $GITHUB_REF != refs/heads/* ]]; then
  echo "${GITHUB_REF} is not a ref."
  exit 0;
fi

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git checkout $GIT_BRANCH

git remote add origin-pushable https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git > /dev/null 2>&1
