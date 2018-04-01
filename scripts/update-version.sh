#!/usr/bin/env bash

FILE='./_data/versions.yml'

echo "vega: `./scripts/version.sh vega`" > $FILE
echo "Vegemite: `./scripts/version.sh Vegemite`" >> $FILE
echo "vega-embed: `./scripts/version.sh vega-embed`" >> $FILE
echo "vega-tooltip: `./scripts/version.sh vega-tooltip`" >> $FILE
echo "" >> $FILE
