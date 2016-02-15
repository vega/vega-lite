#!/bin/bash

for file in examples/specs/*.json; do
  bin/vl2png $file ${file%.json}.png
done
