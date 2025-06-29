#!/bin/bash

docker run \
  --rm -v $(pwd)/services/dashboard/db:/src -w /src sqlc/sqlc \
  generate --file sqlc.yaml
