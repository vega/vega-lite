#!/usr/bin/env bash

set -e

version=$(scripts/version.sh Vegemite)

pushd ../schema/Vegemite/

git checkout master
git pull

rm -f v$version.json
cp ../../Vegemite/build/Vegemite-schema.json v$version.json
echo "Copied schema to v$version.json"

prefix=$version
while echo "$prefix" | grep -q '\.'; do
    # stip off everything before . or -
    prefix=$(echo $prefix | sed 's/[\.-][^\.-]*$//')
    ln -f -s v$version.json v$prefix.json
    echo "Symlinked v$prefix.json to v$version.json"
done

if [ -n "$(git status --porcelain)" ]; then
    git add *.json
    git commit -m"Add Vegemite $version"
    git push
else
  echo "Nothing has changed"
fi

popd
