#!/bin/bash

FILE='../_data/versions.yml'

echo "vega: `npm info vega version`" > $FILE
echo "vega-lite: `npm info vega-lite version`" >> $FILE
echo -e "vega-embed: `npm info vega-embed version`" >> $FILE
echo "" >> $FILE
