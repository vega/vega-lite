# define color
RED='\033[0;31m'
NC='\033[0m' # No Color

# 0.1 Check if jq has been installed
type jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed. Aborting."; exit 1; }

# 0.2 Check if all files are commited
if [ -z "$(git status --porcelain)" ]; then
  echo "All tracked files are commited. Publishing on npm and bower."
else
  echo "${RED}There are uncommitted files. Please commit or stash first!${NC}"
  git status
  exit 1
fi

# 1. NPM PUBLISH
npm run build
npm publish
# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
  echo "${RED} npm publish failed. Publishing cancelled. ${NC}"
  exit $rc;
fi

# 2. BOWER PUBLISH
# read version
gitsha=$(git rev-parse HEAD)
version=$(cat package.json | jq .version | sed -e 's/^"//'  -e 's/"$//')

npm run build
# swap to head so we don't commit compiled file to master along with tags
git checkout head

# add the compiled files, commit and tag!
git add datalib* -f
git commit -m "Release $version $gitsha"
git tag -am "Release v$version." "v$version"

# now swap back to the clean master and push the new tag
git checkout master
git push --tags

# Woo hoo! Now the published tag contains compiled files which works great with bower.
