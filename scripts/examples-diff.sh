#!/bin/bash

# 1. Compile all examples to _output
dir="examples/_output"
. scripts/examples-compile.sh


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
    fi
  fi
done

# 3. Output all changed example names (joined with ",")
echo "Changed Examples:"
function join { local IFS="$1"; shift; echo "$*"; }
join , "${changed[@]}"

# TODO: 4. open diff page!
