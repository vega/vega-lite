#!/bin/bash
# script for npm run x-compile

dir=${dir-"examples/_original"}

echo "compiling examples to $dir"

mkdir $dir
rm -f $dir/*

FILES=('examples/*.json' 'examples/docs/*.json')
for file in $FILES; do
  name=${file##*/}
  ext="${file##*.}"
  if [ "$ext" = "json" ] && [ "$name" != "vl-examples.json" ] && [ "$name" != "vl-docs-examples.json" ]; then  # don't compile the list json
    echo ".. $file"
    bin/vl2vg $file > $dir/$name
  fi
done
