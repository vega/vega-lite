#!/bin/bash
# script for npm run x-compile

dir=${dir-"examples/vg-specs"}

echo "compiling examples to $dir"

rm -rf $dir
mkdir $dir

if type parallel >/dev/null 2>&1
then
  echo "Using parallel to generate vega specs from examples in parallel."
  ls examples/specs/*.vl.json | parallel  --plus --halt 1 "bin/vl2vg -p {} > examples/vg-specs/{/..}.vg.json"
else
  echo "Parallel not found! Sequentially generate vega specs from examples."
  for file in examples/specs/*.vl.json; do
    filename=$(basename "$file")
    name="${filename%.vl.json}"
    bin/vl2vg -p $file > $dir/$name.vg.json
  done
fi
