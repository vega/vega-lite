#!/bin/bash
# script for npm run build:examples
# -s : always compile svg

alwayssvg=""
while getopts 's' flag; do
  case "${flag}" in
    s) alwayssvg="-s" ;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

echo "aa=$alwayssvg"

dir=${dir-"examples/compiled"}
echo "compiling examples to $dir"

rm -rf $dir/*.vg.json
mkdir $dir

if type parallel >/dev/null 2>&1
then
  echo "Using parallel to generate vega specs from examples in parallel."
  ls examples/specs/*.vl.json | parallel --no-notice --plus --halt 1 "npm run build:example {/..} $alwayssvg"
else
  echo "Parallel not found! Sequentially generate vega specs from examples."
  for file in examples/specs/*.vl.json; do
    filename=$(basename "$file")
    name="${filename%.vl.json}"
    ./scripts/build-example.sh $name $alwayssvg
  done
fi
