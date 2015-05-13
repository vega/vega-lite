# update on npm
npm publish

# read version
gitsha=$(git rev-parse HEAD)
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')

# remove all the compiled files, so we can checkout gh-pages without errors
rm vega-lite* -f
rm spec.json

# update github pages
git checkout gh-pages
git merge master --no-edit

gulp build

# add the compiled files, commit and tag!
git add vega-lite* -f
git add spec.json -f

# commit, tag and push to gh-pages and swap back to master
git commit -m "release $version $gitsha"
git push
git tag -am "Release v$version." "v$version"
git push --tags
git checkout master
