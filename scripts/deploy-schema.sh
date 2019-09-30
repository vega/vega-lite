#!/usr/bin/env bash

set -euo pipefail

version=$(scripts/version.sh vega-lite)

pushd ../schema/vega-lite/

git checkout master
git pull

rm -f v$version.json
cp ../../vega-lite/build/vega-lite-schema.json v$version.json
echo "Copied schema to v$version.json"

prefix=$version
while echo "$prefix" | grep -q '\.'; do
    # stip off everything before . or -
    prefix=$(echo $prefix | sed 's/[\.-][^\.-]*$//')
    ln -f -s v$version.json v$prefix.json
    echo "Symlinked v$prefix.json to v$version.json"
done

if [ -n "$(git status --porcelain)" ]; then
    # Note: git commands need single quotes for all the files and directories with wildcards
    git add '*.json'
    git commit -m"Add Vega-Lite $version"
    git push
else
  echo "Nothing has changed"
fi

popd
