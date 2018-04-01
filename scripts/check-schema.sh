#!/usr/bin/env bash

if ! git diff --exit-code HEAD -- ./build/Vegemite-schema.json
then
  echo "Vegemite-schema.json is different from the committed one."
  exit 1
elif grep 'Generic.*Spec<' ./build/Vegemite-schema.json
then
  echo "Generic*Spec in the schema have not been replaced."
  exit 1
elif grep 'UnitSpec<Encoding' ./build/Vegemite-schema.json
then
  echo "UnitSpec<...> in the schema have not been replaced."
  exit 1
elif grep '<Field>' ./build/Vegemite-schema.json
then
  echo "...<Field> in the schema have not been replaced."
  exit 1
else
  exit 0
fi
