#!/usr/bin/env bash

set -e

dir=${dir-"examples/compiled"}

for name in "$@"
do
  echo "Compiling $name" # to $dir (nopatch=$nopatch, forcesvg=$forcesvg)"

  # compile normalized example if $skipnormalize is not set
  if [ ! -n "$skipnormalize" ]; then
    #build full vl example
    scripts/build-normalized-example $name.vl.json
  fi

  # compile Vega example
  rm -f examples/compiled/$name.vg.json
  bin/vl2vg -p examples/specs/$name.vl.json > examples/compiled/$name.vg.json

  # compile SVG if one of the following condition is true
  # 1) Vega spec has changed
  # 2) The SVG file does not exist (new example would not have vg file diff)
  # or 3) the forcesvg environment variable is true
  if (! git diff $nopatch --exit-code $dir/$name.vg.json || [ ! -f $dir/$name.svg ] || $forcesvg)
  then
    rm -f examples/compiled/$name.svg
    node_modules/vega-cli/bin/vg2svg --seed 123456789 examples/compiled/$name.vg.json > examples/compiled/$name.svg -b .
  fi
done
