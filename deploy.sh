gitsha=$(git rev-parse HEAD)

git clone git@github.com:uwdata/vegalite.git gh-pages
cd gh-pages
git checkout gh-pages
git merge master
cd ..
gulp build
cp vegalite* gh-pages
cp spec.json gh-pages
cd gh-pages
git add vegalite* -f
git add spec.json -f
git commit -am "release $gitsha"
git push

git checkout master