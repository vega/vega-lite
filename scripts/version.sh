#!/usr/bin/env bash

if [[ $1 == "vega-lite" ]]; then
  npm list vega-lite | head -n 1 | sed 's/.*@//' | awk '{print $1}'
else
  npm list $1 | tail -n 2 | head -n 1 | sed 's/.*@//' | awk '{print $1}'
fi
