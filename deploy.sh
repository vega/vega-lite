gitsha=$(git rev-parse HEAD)
rm vegalite* -f
rm spec.json

git checkout gh-pages
git merge master

git add vegalite* -f
git add spec.json -f
git commit -m "release $gitsha"

git checkout master
