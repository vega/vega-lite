#!/bin/bash

# Script for compiling one example
# ./scripts/build-example <example-name> [-s]
# -s : always compile svg

if [ -z "$1" ]
  then
    echo "No example name supplied"
fi

while getopts 's' flag; do
  case "${flag}" in
    s) alwayssvg=1 ;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

echo "alwayssvg=$alwayssvg"

rm -f examples/compiled/$1.vg.json
bin/vl2vg -p examples/specs/$1.vl.json > examples/compiled/$1.vg.json
if ! git diff --exit-code --name-only HEAD -- examples/compiled/$1.vg.json
then
  # Build svg due to vega output changes"
  rm -f examples/compiled/$1.svg
  node_modules/vega/bin/vg2svg examples/compiled/$1.vg.json > examples/compiled/$1.svg -b .
elif [ ${alwayssvg} ] ; then
  # Always build svg enabled"
  rm -f examples/compiled/$1.svg
  node_modules/vega/bin/vg2svg examples/compiled/$1.vg.json > examples/compiled/$1.svg -b .
fi

