#!/bin/bash
# requires https://www.gnu.org/software/parallel/

set -e

mkdir -p examples/images

echo "Generating PNGs..."
ls examples/specs/*.json | parallel --eta --halt 1 "bin/vl2png {} examples/images/{/.}.png"

echo "Generating SVGs..."
ls examples/specs/*.json | parallel --eta --halt 1 "bin/vl2svg {} examples/images/{/.}.svg"
