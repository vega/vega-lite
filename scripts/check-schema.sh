#!/usr/bin/env bash

if ! git diff --exit-code HEAD -- ./build/vega-lite-schema.json
then
  echo "vega-lite-schema.json is different from the committed one."
  exit 1
elif grep 'Generic.*Spec<' ./build/vega-lite-schema.json
then
  echo "Generic*Spec in the schema have not been replaced."
  exit 1
elif grep 'UnitSpec<Encoding' ./build/vega-lite-schema.json
then
  echo "UnitSpec<...> in the schema have not been replaced."
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



