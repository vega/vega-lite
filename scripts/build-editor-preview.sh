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
yarn --frozen-lockfile --ignore-scripts
yarn link vega-lite

# TODO: load in real files if we can get rsync installed in the runner someday?
# Put index.json files in public/spec/vega-lite and public/spec/vega
echo "Creating stub index.json for each vega library"

mkdir -p public/spec/vega-lite
mkdir -p public/spec/vega
touch public/spec/vega-lite/index.json
touch public/spec/vega/index.json

cat <<EOF > public/spec/vega-lite/index.json
{}
EOF

cat <<EOF > public/spec/vega/index.json
{}
EOF

# TBD if some vendor files are needed
yarn run vite build --base /
