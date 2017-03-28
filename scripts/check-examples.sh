#!/bin/bash

if ! git diff --exit-code HEAD -- ./examples/vg-specs/*
then
  echo "Output examples vega specs are outdated."
  exit 1
else
  exit 0
fi
