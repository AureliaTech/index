#!/bin/bash

docker run \
  --rm -it --network=host -v "$(pwd)/services/dashboard/db:/db" \
  -e DATABASE_URL=postgresql://aurelia-core_owner:pwd@localhost:5432/aurelia-core?sslmode=disable \
  -e DBMATE_MIGRATIONS_DIR=./db/migrations \
  -e DBMATE_SCHEMA_FILE=./db/schema.sql \
  ghcr.io/amacneil/dbmate down