#!/usr/bin/env bash

set -euxo pipefail

git config --global user.name "GitHub Actions Bot"
git config --global user.email "vega-actions-bot@users.noreply.github.com"

git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git > /dev/null 2>&1
