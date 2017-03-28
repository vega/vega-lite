#!/bin/bash
# script for npm run x-compile

dir=${dir-"examples/vg-specs"}

echo "compiling examples to $dir"

mkdir -p $dir
rm -f $dir/*

for file in examples/specs/*.vl.json; do
  filename=$(basename "$file")
  name="${filename%.vl.json}"
  bin/vl2vg -p $file > $dir/$name.vg.json
done
