#!/usr/bin/env bash

set -euo pipefail

# Check if all required files are here
if ! [ -f build/vega-lite.js ]; then
  echo "ERROR: build/vega-lite.js not found."
  exit 1;
fi
if ! [ -f build/vega-lite.js.map ]; then
  echo "ERROR: build/vega-lite.js.map not found."
  exit 1;
fi
if ! [ -f build/vega-lite.min.js ]; then
  echo "ERROR: build/vega-lite.min.js not found."
  exit 1;
fi
if ! [ -f build/vega-lite.min.js.map ]; then
  echo "ERROR: build/vega-lite.min.js.map not found."
  exit 1;
fi
if ! [ -f build/src/index.js ]; then
  echo "ERROR: build/src/index.js not found."
  exit 1;
fi
if ! [ -f build/src/index.js.map ]; then
  echo "ERROR: build/src/index.js.map not found."
  exit 1;
fi
if ! [ -f build/vega-lite-schema.json ]; then
  echo "ERROR: build/vega-lite-schema.json not found."
  exit 1;
fi
if ! [ -f build/src/index.d.ts ]; then
  echo "ERROR: build/src/index.d.ts not found. Typescript declarations may not be compiled."
  exit 1;
fi
