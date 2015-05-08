# update on npm
npm publish

# read version
gitsha=$(git rev-parse HEAD)
version=$(npm view vegalite -j | jq .version)

rm vegalite* -f
rm spec.json

# update github pages
git checkout gh-pages
git merge master

gulp build
git add vegalite* -f
git add spec.json -f
git commit -m "release $version $gitsha"
git push

# and tag gh-pages, so our release contains compiled file
git tag "v$version"
git push --tags

git checkout master
