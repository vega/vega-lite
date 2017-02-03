#!/bin/bash

npm run schema
if git diff --exit-code HEAD -- ../vega-lite-schema.json then
  echo "vega-lite-schema.json is different from the committed one."
  exit 1;
else
  exit 0;
fi
