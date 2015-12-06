. ./scripts/pre-deploy.sh

# build:all (clean, rebuild, compile, test, and lint)
echo "building"
npm run build:all


# add compiled files
# git add vega-lite* -f
# git rm bower_components/*
# bower install
# git add bower_components/* -f
