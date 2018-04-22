#!/usr/bin/env bash
# script for npm run x-compile

dir=${dir-"examples/compiled"}

echo "Compiling examples to $dir"

# Check if param is provided
if [[ -z "$1" ]];
then
  forcesvg=false
else
  forcesvg=true
fi

# record vega version and force rebuild SVG if version does not match
rm -f $dir/vega-version
echo "vega: `./scripts/version.sh vega`" > $dir/vega_version
if ( ! git diff --no-patch --exit-code HEAD -- $dir/vega_version )
then
  forcesvg=true
fi

if type parallel >/dev/null 2>&1
then
  echo "Using parallel to generate vega specs from examples in parallel."

  # For each example:
  # 1) Remove the old Vega spec and recompile a new Vega spec
  # 2) If there is Vega spec diff or $1 (rebuild flag), remove and recompile SVG.
  # (Need to return true at the end to avoid "failure" exit)

  ls examples/specs/*.vl.json | parallel --eta --no-notice --plus --halt 1 "rm -f examples/compiled/{/..}.vg.json && bin/vl2vg -p {} > examples/compiled/{/..}.vg.json && ( ( ! git diff --no-patch HEAD -- examples/compiled/{/..}.vg.json || $forcesvg ) && rm -f examples/compiled/{/..}.svg && node_modules/.bin/vg2svg --seed 123456789 examples/compiled/{/..}.vg.json examples/compiled/{/..}.svg -b . || true )"
else
  echo "Parallel not found! Sequentially generate vega specs from examples."
  for file in examples/specs/*.vl.json; do
    filename=$(basename "$file")
    name="${filename%.vl.json}"
    rm -f $dir/$name.vg.json
    bin/vl2vg -p $file > $dir/$name.vg.json
    if ( ! git diff --no-patch --exit-code HEAD -- $dir/$name.vg.json || $forcesvg )
    then
      rm -f $dir/$name.svg
      node_modules/.bin/vg2svg --seed 123456789 $dir/$name.vg.json $dir/$name.svg -b .
    fi
  done
fi
