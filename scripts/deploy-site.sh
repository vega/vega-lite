#!/usr/bin/env bash

set -ex

scripts/pre-deploy.sh

yarn presite

bundle exec jekyll build

gh-pages -d _site
