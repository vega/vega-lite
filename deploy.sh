gitsha=$(git rev-parse HEAD)
git add vegalite* -f
git add spec.json -f
git commit -m "release $gitsha"