#!/usr/bin/env bash

# Check only Vega file for now as Travis is having problem when generating SVG
if ! git diff --word-diff=color --exit-code HEAD -- ./examples/compiled/*.vg.json
then
  echo "Output examples vega specs are outdated."
  exit 1
else
  exit 0
fi
