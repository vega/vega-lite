#!/bin/bash

FILE='./_data/versions.yml'

echo "vega: `npm info vega version`" > $FILE
echo "vega-lite: `./scripts/version.sh`" >> $FILE
echo -e "vega-embed: `npm info vega-embed version`" >> $FILE
echo "" >> $FILE
