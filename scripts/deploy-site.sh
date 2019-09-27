#!/usr/bin/env bash

set -ex

yarn presite

yarn gh-pages -d site
