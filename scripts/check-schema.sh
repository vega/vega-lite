#!/usr/bin/env bash

set -euo pipefail

if grep 'Generic[^U].*Spec<' ./build/vega-lite-schema.json
then
  echo "Non-Unit Generic Spec in the schema have not been replaced."
  exit 1
elif grep '<Field>' ./build/vega-lite-schema.json
then
  echo "...<Field> in the schema have not been replaced."
  exit 1
elif grep -E "\]\([^/.]*\.html" ./build/vega-lite-schema.json
then
  echo "Schema description contains relative URL."
  exit 1
else
  exit 0
fi



