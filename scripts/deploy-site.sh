#!/usr/bin/env bash

set -ex

scripts/pre-deploy.sh

yarn presite

gh-pages -d site
