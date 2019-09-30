#!/usr/bin/env bash

set -e

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"

git config --global user.name "GitHub Actions Bot"
git config --global user.email "vega-actions-bot@users.noreply.github.com"
git checkout $GIT_BRANCH

git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git > /dev/null 2>&1
