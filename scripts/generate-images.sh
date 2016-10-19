#!/bin/bash
# requires https://www.gnu.org/software/parallel/

set -e

mkdir -p examples/images

# Put `vega-lite.js` on the Node search path so the `vl2svg` script can
# require it without needing it to be installed globally.
export NODE_PATH=.

echo "Generating SVGs..."
ls examples/specs/*.vl.json | parallel --eta --halt 1 "bin/vl2svg {} examples/images/{/.}.svg"
