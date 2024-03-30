#!/usr/bin/env bash

set -eo pipefail

# Build the docs site and replace the main build with the local copy of vega-lite
echo "Attempting install"
# apt install rsync

yarn build
yarn link
git clone https://github.com/vega/editor.git

#
cd editor
yarn --frozen-lockfile
yarn link vega-lite


# TODO: load in real files if RSYNC is installable?




# TODO : need to create some vendor files?
yarn build:only
