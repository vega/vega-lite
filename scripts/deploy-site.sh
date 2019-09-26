#!/usr/bin/env bash

set -ex

yarn presite

gh-pages -d site
