#!/usr/bin/env bash

set -ex

rsync -r examples/specs/* site/examples/
rsync examples/compiled/*.svg site/examples/

scripts/create-example-pages

rsync examples/compiled/*.png site/examples/
