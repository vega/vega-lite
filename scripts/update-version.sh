#!/bin/bash

FILE='./_data/versions.yml'

echo "vega: `npm list vega | head -n 2 | tail -n 1 | sed 's/.*@//' | awk '{print $1}'`" > $FILE
echo "vega-lite: `./scripts/version.sh`" >> $FILE
echo "vega-embed: `npm list vega-embed | head -n 2 | tail -n 1 | sed 's/.*@//' | awk '{print $1}'`" >> $FILE
echo "" >> $FILE
