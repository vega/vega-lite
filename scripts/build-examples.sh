#!/usr/bin/env bash
# script for npm run x-compile

dir=${dir-"examples/compiled"}

echo "Compiling examples to $dir"

if [ -z "$1" ]
then
  rm -f $dir/*.vg.json
  rm -f $dir/*.svg

  if type parallel >/dev/null 2>&1
  then
    echo "Using parallel to generate vega specs from examples in parallel."
    ls examples/specs/*.vl.json | parallel --eta --no-notice --plus --halt 1 "bin/vl2vg -p {} > examples/compiled/{/..}.vg.json && node_modules/.bin/vg2svg examples/compiled/{/..}.vg.json examples/compiled/{/..}.svg -b ."
  else
    echo "Parallel not found! Sequentially generate vega specs from examples."
    for file in examples/specs/*.vl.json; do
      filename=$(basename "$file")
      name="${filename%.vl.json}"
      bin/vl2vg -p $file > $dir/$name.vg.json
      node_modules/.bin/vg2svg $dir/$name.vg.json $dir/$name.svg -b .
    done
  fi
else
  for name in "$@"
  do
    echo "Building $name"
    rm -f examples/compiled/$name.vg.json
    bin/vl2vg -p examples/specs/$name.vl.json > examples/compiled/$name.vg.json
    rm -f examples/compiled/$name.svg
    node_modules/vega/bin/vg2svg examples/compiled/$name.vg.json > examples/compiled/$name.svg -b .
  done
fi
