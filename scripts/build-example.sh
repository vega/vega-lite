#!/bin/bash

# Script for compiling one example
# ./scripts/build-example <example-name> [-s]
# -s : always compile svg

if [ -z "$1" ]
  then
    echo "No example name supplied"
fi

rm -f examples/compiled/$1.vg.json
bin/vl2vg -p examples/specs/$1.vl.json > examples/compiled/$1.vg.json
rm -f examples/compiled/$1.svg
node_modules/vega/bin/vg2svg examples/compiled/$1.vg.json > examples/compiled/$1.svg -b .
