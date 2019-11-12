#!/usr/bin/env bash

set -euo pipefail

FILE='site/_data/versions.yml'

echo "vega: `scripts/version.sh vega`" > $FILE
echo "vega-lite: `scripts/version.sh vega-lite`" >> $FILE
echo "vega-embed: `scripts/version.sh vega-embed`" >> $FILE
echo "vega-tooltip: `scripts/version.sh vega-tooltip`" >> $FILE
