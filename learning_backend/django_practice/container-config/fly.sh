#!/bin/bash
# run from container-config directory

# exit on any error
set -e

# env subst for fly.io toml
cp "fly_${1}.toml" "fly_${1}_with_env.toml"
# sort 'unique' keys (equal keys are not overwritten, so use reverse order of standard env override)
# separated by '=' and only use first column (range 1 to 1) to sort on
sort -u -t '=' -k 1,1 git-safe/.prod.safe.env git-safe/.safe.env >> "fly_${1}_with_env.toml"

# build the image if needed
if [ "$2" = "build" ]; then
  ./docker-compose.sh prod ${1}
fi

if [ "$2" != "deploy-only" ]; then
  # tag and push image to fly.io
  docker tag "library-${1}" "registry.fly.io/cshock-library-${1}"
  docker push "registry.fly.io/cshock-library-${1}"
fi

# deploy to fly.io
fly deploy -c "fly_${1}_with_env.toml" --ha=false
