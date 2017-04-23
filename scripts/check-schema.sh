#!/bin/bash

if ! git diff --exit-code HEAD -- ./build/vega-lite-schema.json
then
  echo "vega-lite-schema.json is different from the committed one."
  exit 1
elif grep 'Generic.*Spec<' ./build/vega-lite-schema.json
then
  echo "Generic*Spec in the schema have not been replaced."
  exit 1
else
  exit 0
fi
