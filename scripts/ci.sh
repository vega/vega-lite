#!/usr/bin/env bash

set -e

case "$1" in
  "build")
    yarn lint
    yarn build
    ./scripts/check-schema.sh
    ;;
  "cover")
    yarn jest test/ --collectCoverage=true
    yarn codecov
    bash <(curl -s https://codecov.io/bash)
    ;;
  "test")
    yarn jest examples/
    yarn test:runtime
    ;;
  "fix")
    # Minimal installation as described in https://github.com/martinda/gnu-parallel
    wget http://git.savannah.gnu.org/cgit/parallel.git/plain/src/parallel
    chmod +x parallel
    cp parallel sem
    mkdir -p $HOME/bin
    mv parallel sem $HOME/bin
    export PATH="$PATH:$HOME/bin"

    ./scripts/check-and-fix.sh
    ;;
esac
