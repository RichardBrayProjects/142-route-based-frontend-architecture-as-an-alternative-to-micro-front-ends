# Toy Vite Multi-App Frontend on AWS

This is a deliberately small example of a modern multi-team frontend architecture:

- pnpm workspaces monorepo
- multiple Vite + React apps
- shared Tailwind design tokens
- shared Tailwind config
- shared UI package
- AWS CDK infrastructure
- S3 + CloudFront static hosting
- independent deployment of one app at a time

The toy apps are:

```txt
apps/shell
apps/admin
apps/billing
apps/dashboard
```

The shared packages are:

```txt
packages/tokens
packages/tailwind-config
packages/ui
```

## Architecture

```txt
CloudFront
  /
    shell app
  /admin/
    admin app
  /billing/
    billing app
  /dashboard/
    dashboard app
```

Each app is built separately and copied into a different S3 prefix.

```txt
s3://bucket-name/
  index.html
  assets/
  admin/
    index.html
    assets/
  billing/
    index.html
    assets/
  dashboard/
    index.html
    assets/
```

## Install

```bash
pnpm install
```

## Run locally

```bash
pnpm dev:shell
pnpm dev:admin
pnpm dev:billing
pnpm dev:dashboard
```

Each app is currently a standalone Vite app. The shell links to the deployed paths `/admin/`, `/billing/`, and `/dashboard/`.

## Build all apps

```bash
pnpm build
```

## Deploy the AWS infrastructure

This uses your default AWS account and default AWS region through the CDK environment variables:

```bash
pnpm cdk:deploy
```

If you have not bootstrapped CDK in your account/region yet, run:

```bash
cd infrastructure/cdk
pnpm cdk bootstrap
```

## Deploy one app independently

Deploy only the shell:

```bash
pnpm deploy:shell
```

Deploy only admin:

```bash
pnpm deploy:admin
```

Deploy only billing:

```bash
pnpm deploy:billing
```

Deploy only dashboard:

```bash
pnpm deploy:dashboard
```

The script:

1. reads the S3 bucket and CloudFront distribution from CloudFormation outputs
2. builds the selected app
3. syncs the app's `dist` folder to the correct S3 location
4. invalidates only the relevant CloudFront path

## Tailwind and tokens

The product design system is centralized.

```txt
packages/tokens/src/tokens.css
```

contains CSS variables such as:

```css
--primary
--background
--radius-md
```

```txt
packages/tailwind-config/tailwind.config.js
```

maps those tokens into Tailwind utilities such as:

```txt
bg-primary
text-primary-foreground
rounded-md
```

Each app imports the shared Tailwind preset:

```js
const sharedConfig = require("@toy/tailwind-config");

module.exports = {
  presets: [sharedConfig],
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"]
};
```

This prevents each team from creating a different visual system.

## GitHub Actions

A minimal workflow is included at:

```txt
.github/workflows/deploy-app.yml
```

For a real three-account setup, you would normally use:

```txt
develop -> test AWS account
staging -> staging AWS account
main -> production AWS account
```

with separate AWS IAM roles for each account.

This toy workflow expects:

```txt
secrets.AWS_DEPLOY_ROLE_ARN
vars.AWS_REGION
```

In a production version, you would map branch names to different role ARNs.

## Important simplification

This toy app keeps routing intentionally simple. It demonstrates independently deployed path apps, not full nested client-side routing under every app path.

For production, you would normally add one of these:

- CloudFront Functions for prefix-aware SPA fallbacks
- Lambda@Edge for more advanced routing
- hash routing inside child apps
- Module Federation for runtime composition

