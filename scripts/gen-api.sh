#! /bin/bash -ue

npx -y openapi-typescript \
    https://raw.githubusercontent.com/traP-jp/plutus/refs/heads/main/specs/openapi/internal.yaml \
    -o ./src/api/schema/internal.ts

npx -y openapi-typescript \
    https://raw.githubusercontent.com/traP-jp/plutus/refs/heads/main/specs/openapi/pteron.yaml \
    -o ./src/api/schema/public.ts

npx -y openapi-typescript \
    https://raw.githubusercontent.com/traPtitech/traQ/refs/heads/master/docs/v3-api.yaml \
    -o ./src/api/schema/traq.ts
