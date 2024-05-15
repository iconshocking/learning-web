#!/bin/bash

# run from container-config directory
if [ "$1" = "dev" ]; then
    docker compose \
    --env-file ./secrets/.env \
    --env-file ./secrets/.dev.env \
    --env-file ./git-safe/.safe.env \
    -f compose.yaml \
    -f compose.dev.yaml \
    up -d --build
fi

if [ "$1" = "preprod" ]; then
    docker compose \
    --env-file ./secrets/.env \
    --env-file ./secrets/.prod.env \
    --env-file ./git-safe/.safe.env \
    --env-file ./git-safe/.prod.safe.env \
    --env-file ./git-safe/.preprod.safe.env \
    -f compose.yaml \
    -f compose.prod.yaml \
    -f compose.preprod.yaml \
    up -d --build
fi


if [ "$1" = "prod" ]; then
    docker compose \
    --env-file ./secrets/.env \
    --env-file ./git-safe/.safe.env \
    --env-file ./git-safe/.prod.safe.env \
    -f compose.yaml \
    -f compose.prod.yaml \
    up -d --build
fi
