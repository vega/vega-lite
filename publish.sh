set -e

# define color
RED='\033[0;31m'
NC='\033[0m' # No Color


# 0.1 Check if jq has been installed
type jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed.  Aborting."; exit 1; }

# 0.2 Check if all files are committed
if [ -z "$(git status --porcelain)" ]; then
  echo "All tracked files are committed.  Publishing on npm and bower. \n"
else
  echo "${RED}There are uncommitted files. Please commit or stash first!${NC} \n\n"
  git status
  exit 1
fi

# 1. BOWER PUBLISH

# read version
gitsha=$(git rev-parse HEAD)
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')

# remove all the compiled files, so we can checkout gh-pages without errors
rm -f vega-lite*
rm  -f spec.json

# update github pages
git checkout gh-pages
git pull
git merge master --no-edit

gulp build

# add the compiled files, commit and tag!
git add vega-lite* -f
git add spec.json -f

# commit, tag and push to gh-pages and swap back to master
set +e
git commit -m "release $version $gitsha"
set -e
git push
git tag -am "Release v$version." "v$version"
git push --tags
git checkout master
gulp build # rebuild so that vega-lite.js are back  for linked bower/npm

# 2. NPM PUBLISH

npm publish
# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
	echo "${RED} npm publish failed.  Publishing canceled. ${NC} \n\n"
	exit $rc;
fi
