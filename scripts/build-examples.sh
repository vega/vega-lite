#!/bin/bash
# script for npm run x-compile

dir=${dir-"examples/vg-specs"}

echo "compiling examples to $dir"

mkdir -p $dir
rm -f $dir/*

type parallel >/dev/null 2>&1 || { for file in examples/specs/*.vl.json; do filename=$(basename "$file"); name="${filename%.vl.json}"; bin/vl2vg -p $file > $dir/$name.vg.json & done; exit 0; }

ls examples/specs/*.vl.json | parallel --halt 1 "bin/vl2vg -p {} > examples/vg-specs/{/.}.json"

for file in examples/vg-specs/*.vl.json; do
  filename=$(basename "$file")
  name="${filename%.vl.json}"
  mv $file $dir/$name.vg.json
done
