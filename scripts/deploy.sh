#!/usr/bin/env bash

if [[ -z "${ARTIFACT_BUCKET}" ]]; then
    read -p "S3 bucket to store artifacts: " ARTIFACT_BUCKET
fi

if [[ -z "${STACK_ENV}" ]]; then
    STACK_ENV="production"
fi

DIR=$(basename $(pwd))
STACK_NAME="${DIR}-${STACK_ENV}"

aws cloudformation package \
    --template-file infrastructure/main.yml \
    --s3-bucket ${ARTIFACT_BUCKET} \
    --output-template-file dist/template.${STACK_ENV}.yml

aws cloudformation deploy \
    --template-file dist/template.${STACK_ENV}.yml \
    --stack-name ${STACK_NAME}
