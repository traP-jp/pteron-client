#! /bin/bash -ue

mkdir -p ./src/api/schema/
cd ./src/api/schema/

SOURCES=(
    "https://raw.githubusercontent.com/traP-jp/plutus/refs/heads/main/specs/openapi/internal.yaml"
    "https://raw.githubusercontent.com/traP-jp/plutus/refs/heads/main/specs/openapi/pteron.yaml"
    "https://raw.githubusercontent.com/traPtitech/traQ/refs/heads/master/docs/v3-api.yaml"
)

OUTPUTS=(
    internal.ts
    public.ts
    traq.ts
)

for ((i = 0; i < ${#SOURCES[@]}; i++)); do
    {
        npx -y swagger-typescript-api generate \
            --add-readonly \
            --route-types \
            --axios \
            --sort-routes --sort-types \
            --generate-union-enums \
            --path="${SOURCES[i]}" \
            --name="${OUTPUTS[i]}" >"${OUTPUTS[i]}.log" 2>&1
    } &
done

wait

for ((i = 0; i < ${#OUTPUTS[@]}; i++)); do
    cat "${OUTPUTS[i]}.log"
    rm -f "${OUTPUTS[i]}.log"
done
