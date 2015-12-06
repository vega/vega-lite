#!/bin/bash

dir=${dir-"examples/_original"}

echo "compiling examples to $dir"

mkdir $dir
rm -f $dir/*
for file in examples/*.json; do
  name=${file##*/}
  if [ "$name" != "vlexamples.json" ]; then  # don't compile the list json
    echo ".. $file"
    bin/vl2vg $file > $dir/$name
  fi
done
