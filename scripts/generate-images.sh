#!/bin/bash

mkdir examples/images
for file in examples/specs/*.json; do
  name=${file##*/}
  bin/vl2png $file examples/images/${name}.png
done
