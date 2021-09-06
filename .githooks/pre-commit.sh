#!/usr/bin/env bash

# exit immediately if any command fails
set -e

npm run type-check
npm run lint
npm run format
