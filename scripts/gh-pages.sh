. ./scripts/pre-deploy.sh

git checkout gh-pages

# update bower_components
git rm bower_components/*
bower install
git add bower_components/* -f

# build
npm run build:all
git add vega-lite* -f

# commit
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')
git commit -m "release $version"
git push
git checkout master
