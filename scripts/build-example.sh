#!/usr/bin/env bash

set -eo pipefail

dir=${dir-"examples/compiled"}

# calculate time taken by perl to call timer twice first, so we can deduct later
# (mac osx doesn't have ms time, need to use perl -- https://apple.stackexchange.com/a/314573)
start=`perl -MTime::HiRes=time -e 'printf "%d\n", time*1000'`
end=`perl -MTime::HiRes=time -e 'printf "%d\n", time*1000'`
timertime=$((end-start))

for name in "$@"
do
  # compile normalized example if $skipnormalize is not set
  if [ ! -n "$skipnormalize" ]; then
    #build full vl example
    scripts/build-normalized-example $name.vl.json
  fi

  # compile Vega example
  rm -f examples/compiled/$name.vg.json

  start=`perl -MTime::HiRes=time -e 'printf "%d\n", time*1000'`

  bin/vl2vg -p examples/specs/$name.vl.json > examples/compiled/$name.vg.json

  end=`perl -MTime::HiRes=time -e 'printf "%d\n", time*1000'`
  runtime=$((end-start-timertime)) # also minus time taken by perl

  echo "Compiling $name (~$runtime ms)" # to $dir (nopatch=$nopatch, forcesvg=$forcesvg)"

  # compile SVG if one of the following condition is true
  # 1) Vega spec has changed
  # 2) The SVG file does not exist (new example would not have vg file diff)
  # or 3) the forcesvg environment variable is true

  if (! git diff $nopatch --exit-code $dir/$name.vg.json || [ ! -f $dir/$name.svg ] ||  [ ! -f $dir/$name.png ] || $forcesvg)
  then
    pushd examples/compiled/
    rm -f $name.svg
    rm -f $name.png
    npx vg2svg --seed 123456789 $name.vg.json > $name.svg
    npx vg2png --seed 123456789 $name.vg.json > $name.png
    popd
  fi
done
