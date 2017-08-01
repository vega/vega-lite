#!/bin/bash

if ! git diff --word-diff=color --exit-code HEAD -- ./examples/compiled/*
then
  echo "Output examples vega specs are outdated."
  exit 1
else
  exit 0
fi
