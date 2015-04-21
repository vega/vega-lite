npm publish

gitsha=$(git rev-parse HEAD)
version=$(npm view vegalite -j | jq .version)

git tag "v$version"
git push --tags

rm vegalite* -f
rm spec.json

git checkout gh-pages
git merge master

gulp build
git add vegalite* -f
git add spec.json -f
git commit -m "release $version $gitsha"
git push

git checkout master
