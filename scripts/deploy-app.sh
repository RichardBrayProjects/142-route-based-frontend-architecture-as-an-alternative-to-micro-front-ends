#!/usr/bin/env bash
set -euo pipefail

APP="${1:-}"
STACK_NAME="${STACK_NAME:-ToyFrontendStack}"

if [[ -z "$APP" ]]; then
  echo "Usage: bash scripts/deploy-app.sh <shell|admin|billing|dashboard>"
  exit 1
fi

case "$APP" in
  shell)
    FILTER="@toy/shell"
    DIST="apps/shell/dist"
    S3_PREFIX=""
    INVALIDATION_PATHS="/*"
    ;;
  admin|billing|dashboard)
    FILTER="@toy/$APP"
    DIST="apps/$APP/dist"
    S3_PREFIX="$APP/"
    INVALIDATION_PATHS="/$APP/*"
    ;;
  *)
    echo "Unknown app: $APP"
    exit 1
    ;;
esac

BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" \
  --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" \
  --output text)

pnpm --filter "$FILTER" build

aws s3 sync "$DIST/" "s3://$BUCKET_NAME/$S3_PREFIX" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

aws s3 cp "$DIST/index.html" "s3://$BUCKET_NAME/${S3_PREFIX}index.html" \
  --cache-control "no-cache"

aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths $INVALIDATION_PATHS

echo "Deployed $APP to s3://$BUCKET_NAME/$S3_PREFIX"
