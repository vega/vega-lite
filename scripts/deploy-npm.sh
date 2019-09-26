#!/usr/bin/env bash

set -e

# Check if all required files are here
if ! [ -f build/vega-lite.js ]; then
  echo "${RED} build/vega-lite.js not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite.js.map ]; then
  echo "${RED} build/vega-lite.js.map not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite.min.js ]; then
  echo "${RED} build/vega-lite.min.js not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite.min.js.map ]; then
  echo "${RED} build/vega-lite.min.js.map not found ${NC}"
  exit 1;
fi
if ! [ -f build/vega-lite-schema.json ]; then
  echo "${RED} build/vega-lite-schema.json not found${NC}"
  exit 1;
fi
if ! [ -f build/src/index.js ]; then
  echo "${RED} build/src/index.js not found.  Typescripts may not be compiled.${NC}"
  exit 1;
fi
if ! [ -f build/src/index.d.ts ]; then
  echo "${RED} build/src/index.d.ts not found.  Typescript declarations may not be compiled.${NC}"
  exit 1;
fi

echo "Publishing to NPM"
npm publish
