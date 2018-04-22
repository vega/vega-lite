dir=${dir-"examples/compiled"}

for name in "$@"
do
  echo "Compiling $name" # to $dir (nopatch=$nopatch, forcesvg=$forcesvg)"

  # compile normalized example if $skipnormalize is not set
  if [ ! -n "$skipnormalize" ]; then
    #build full vl example
    scripts/build-fullvl-example $name.vl.json
  fi

  # compile Vega example
  rm -f examples/compiled/$name.vg.json
  bin/vl2vg -p examples/specs/$name.vl.json > examples/compiled/$name.vg.json

  if (! git diff $nopatch --exit-code HEAD -- $dir/$name.vg.json || $forcesvg)
  then
    rm -f examples/compiled/$name.svg
    node_modules/vega/bin/vg2svg --seed 123456789 examples/compiled/$name.vg.json > examples/compiled/$name.svg -b .
  fi
done
