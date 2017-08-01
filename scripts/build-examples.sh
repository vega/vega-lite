#!/bin/bash
# script for npm run x-compile

dir=${dir-"examples/compiled"}

echo "compiling examples to $dir"

rm -rf $dir
mkdir $dir

if type parallel >/dev/null 2>&1
then
  echo "Using parallel to generate vega specs from examples in parallel."
  ls examples/specs/*.vl.json | parallel --no-notice --plus --halt 1 "bin/vl2vg -p {} > examples/compiled/{/..}.vg.json && node_modules/vega/bin/vg2svg examples/compiled/{/..}.vg.json examples/compiled/{/..}.svg -b data"
else
  echo "Parallel not found! Sequentially generate vega specs from examples."
  for file in examples/specs/*.vl.json; do
    filename=$(basename "$file")
    name="${filename%.vl.json}"
    bin/vl2vg -p $file > $dir/$name.vg.json
    node_modules/vega/bin/vg2svg $dir/$name.vg.json $dir/$name.svg -b data
  done
fi
