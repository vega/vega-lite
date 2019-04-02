#!/usr/bin/env bash

set -ex

# define color
RED='\033[0;31m'
NC='\033[0m' # No Color

# 0.1 check if on master
if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "${RED}Not on master, please checkout master branch before running this script.${NC}"
  exit 1
fi

# 0.2 Build toc and versions file to make sure they are up to date
yarn build:toc
yarn build:versions

# 0.3 Check if all files are committed
if [ -z "$(git status --porcelain)" ]; then
  echo "All tracked files are committed. \n"
else
  echo "${RED}There are uncommitted files. Please commit or stash first!${NC} \n\n"
  git status
  exit 1
fi

# 0.4 Check if the Vega's schema repository exists in the same parent directory (as a sibling directory)

if ! [ -d "../schema" ]; then
  echo "${RED}Vega-Lite schema cannot be updated if the vega/schema repository does not exist in the same parent directory.${NC}"
  exit 1;
fi
