#!/bin/sh
set -eu

if [ ! -d .git ]; then
  echo "prepare: no .git directory, skipping hook setup"
  exit 0
fi

git config --local core.hooksPath .githooks
chmod +x .githooks/pre-commit

echo "prepare: configured core.hooksPath=.githooks"