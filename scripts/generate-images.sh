#!/bin/bash

mkdir examples/images

echo "Generating PNGs..."
for file in examples/specs/*.json; do
  name=${file##*/}
  bin/vl2png $file examples/images/${name}.png
done

echo "Generating SVGs..."
for file in examples/specs/*.json; do
  name=${file##*/}
  bin/vl2svg $file examples/images/${name}.svg
done
