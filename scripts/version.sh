#!/bin/bash

npm list vega-lite | head -n 1 | sed 's/.*@//' | awk '{print $1}'
