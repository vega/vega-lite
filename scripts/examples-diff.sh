#!/bin/bash

# 1. Compile all examples to _output
dir="examples/_output"
. scripts/examples-compile.sh

diffdir="examples/_diff"
mkdir $diffdir
rm -f $diffdir/*

# 2. Diff all examples
changed=() # array for collecting changed examples
for file in examples/*.json; do
  name=${file##*/} # filename only (no dir path)
  base=${name%.json} # exclude extension
  if [ "$name" != "vlexamples.json" ]; then  # don't compile the list json
    diff=$(json-diff --color examples/_original/$name examples/_output/$name)
    if [ "$diff" != " undefined" ]; then
      echo "Diff for $name"
      echo -e "$diff"
      changed+=("$base")
      # compile each vega output to svg in examples/_diff
      # and use "xmllint --format -" to format
      ./node_modules/vega/bin/vg2svg examples/_original/$base.json | xmllint --format - > $diffdir/${base}-base.svg
      ./node_modules/vega/bin/vg2svg examples/_output/$base.json | xmllint --format - > $diffdir/${base}.svg
    fi
  fi
done

# 3. Output all changed example names (joined with ",")
function join { local IFS="$1"; shift; echo "$*"; }
changedlist=$(join , "${changed[@]}")
echo "Changed Examples: $changedlist"
