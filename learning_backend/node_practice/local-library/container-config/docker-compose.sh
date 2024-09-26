#!/bin/bash
# run from container-config directory

# exit on any error
set -e

docker compose \
  --env-file ./git-safe/.safe.env \
  -f compose.yaml \
  up "${@:1}"