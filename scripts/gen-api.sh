#! /bin/bash -ue

npx openapi-typescript \
    https://raw.githubusercontent.com/traP-jp/plutus/refs/heads/main/specs/openapi/internal.yaml \
    -o ./src/api/schema/internal.ts

npx openapi-typescript \
    https://raw.githubusercontent.com/traP-jp/plutus/refs/heads/main/specs/openapi/pteron.yaml \
    -o ./src/api/schema/public.ts
