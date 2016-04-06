#!/bin/bash
# script for npm run x-compile

dir=${dir-"examples/_original"}

echo "compiling examples to $dir"

mkdir $dir
rm -f $dir/*

for file in examples/specs/*.json; do
  name=${file##*/}
  bin/vl2vg $file > $dir/$name
done
