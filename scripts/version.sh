#!/bin/bash

npm list $1 | head -n 1 | sed 's/.*@//' | awk '{print $1}'
