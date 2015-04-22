npm publish

git tag "v$version"
git push --tags

./deploy.sh