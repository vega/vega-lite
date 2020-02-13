#!/usr/bin/env bash

set -eu

if [[ $1 == "vega-lite" ]]; then
  node -p "require('./package.json').version"
else
  node -p "require('./node_modules/$1/package.json').version"
fi
