dir=${dir-"examples/compiled"}

echo "Compiling example(s) to $dir"

for name in "$@"
do
  echo "Building $name"
  rm -f examples/compiled/$name.vg.json
  bin/vl2vg -p examples/specs/$name.vl.json > examples/compiled/$name.vg.json

  if ! git diff --exit-code HEAD -- $dir/$name.vg.json
  then
    rm -f examples/compiled/$name.svg
    node_modules/vega/bin/vg2svg --seed 123456789 examples/compiled/$name.vg.json > examples/compiled/$name.svg -b .
  fi
done
