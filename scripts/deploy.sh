set -e

# define color
RED='\033[0;31m'
NC='\033[0m' # No Color

# 0.1 Check if jq has been installed
type jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed.  Aborting."; exit 1; }

# 0.2 check if on master
if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "${RED}Not on master, please checkout master branch before running this script${NC}"
  exit 1
fi

# 0.3 Check if all files are committed
if [ -z "$(git status --porcelain)" ]; then
  echo "All tracked files are committed.  Publishing on npm and bower. \n"
else
  echo "${RED}There are uncommitted files. Please commit or stash first!${NC} \n\n"
  git status
  exit 1
fi

# 1. NPM PUBLISH

# build:all (clean, rebuild, compile, test, and lint)
npm run build:all

# Check if all required files are here
if ![ -f vega-lite.js ]; then
  echo "${RED} vega-lite.js not found ${NC}"
  exit 1;
fi
if ![ -f vega-lite-schema.json ]; then
  echo "${RED} vega-lite-schema.json not found${NC}"
  exit 1;
fi
if ![ -f src/vl.js ]; then
  echo "${RED} src/vl.js not found.  Typescripts may be not compiled.${NC}"
  exit 1;
fi

npm publish
# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
	echo "${RED} npm publish failed.  Publishing canceled. ${NC} \n\n"
	exit $rc;
fi

# 2. BOWER PUBLISH

# read version
gitsha=$(git rev-parse HEAD)
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')

# remove all the compiled files, so we can checkout gh-pages without errors
rm -f vega-lite*

git checkout head
# add the compiled files, commit and tag!
git add vega-lite* -f
git add src/**/*.js -f

# commit, tag and push to gh-pages and swap back to master
set +e
git commit -m "release $version $gitsha"
set -e
git push
git tag -am "Release v$version." "v$version"

# swap back to the clean master and push the new tag
git checkout master
git push --tags
# now the published tag contains build files which work great with bower.

#  3. GITHUB PAGES PUBLISH
