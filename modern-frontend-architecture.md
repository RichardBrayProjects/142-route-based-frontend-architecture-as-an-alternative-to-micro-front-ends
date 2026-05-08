# Modern Multi-Team Frontend Architecture with Vite, React, Tailwind, pnpm Workspaces and AWS

---

# Overview

This document describes a modern frontend architecture suitable for:

- Large multi-team React applications
- Independent deployment of frontend applications
- AWS static hosting via S3 + CloudFront
- Progressive environments (test → staging → production)
- GitHub Actions CI/CD
- Shared design systems using Tailwind
- Vite-first development
- Optional future evolution into Module Federation

The architecture prioritizes:

- Simplicity
- Developer experience
- Scalability
- Independent team ownership
- Shared visual consistency
- AWS-native deployment

This is intentionally **not** a “full microfrontend first” architecture. Instead, it uses:

- independent route applications
- shared design systems
- shared app shell
- independent deployment pipelines

This is currently one of the most practical and modern frontend architectures available.

---

# Core Architectural Philosophy

The architecture is based around:

```txt
Shared shell application
+
Multiple independently owned route applications
+
Shared UI/design system packages
+
Independent CI/CD deployment
+
CloudFront path routing
```

Rather than:

```txt
Many isolated runtime microfrontends fighting over CSS and routing
```

This approach provides most of the organizational and deployment benefits of microfrontends while avoiding much of the runtime complexity.

---

# Technology Stack

## Core Frontend

- React
- React Router
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui (optional but recommended)

## Monorepo

- pnpm workspaces

## Infrastructure

- AWS S3
- AWS CloudFront
- Route53 (optional)
- AWS Certificate Manager

## CI/CD

- GitHub Actions
- GitHub OIDC authentication into AWS
- AWS IAM Roles

---

# High-Level System Architecture

```txt
                           CloudFront
                                |
    ---------------------------------------------------
    |                 |                |              |
    /                 /admin           /billing       /dashboard
    |                 |                |              |
 shell app         admin app       billing app    dashboard app
```

Each route application is:
- independently built
- independently deployed
- independently owned by a team

The shell application:
- provides navigation
- provides authentication
- provides layout
- provides shared UX
- routes users to apps

---

# Monorepo Structure

```txt
repo/
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json

├── apps/
│   ├── shell/
│   ├── admin/
│   ├── billing/
│   ├── dashboard/
│   └── marketing/

├── packages/
│   ├── ui/
│   ├── tokens/
│   ├── tailwind-config/
│   ├── auth/
│   ├── api-client/
│   ├── eslint-config/
│   └── tsconfig/

├── infrastructure/
│   ├── cdk/
│   └── scripts/

└── .github/
    └── workflows/
```

---

# pnpm Workspace Configuration

## `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

# Root package.json

```json
{
  "name": "root",
  "private": true,
  "scripts": {
    "dev": "pnpm -F @apps/shell dev",
    "build": "pnpm -r build",
    "type-check": "pnpm -r type-check",
    "package-cleanup": "pnpm -r run package-cleanup"
  }
}
```

---

# Team Ownership Model

Example:

| Team | Ownership |
|---|---|
| Platform Team | shell, ui, auth, tokens |
| Admin Team | admin app |
| Billing Team | billing app |
| Dashboard Team | dashboard app |
| Marketing Team | marketing app |

Each team:
- owns its own app
- deploys independently
- has independent CI/CD
- shares design system infrastructure

---

# Shell Application

The shell application provides:

- Navigation
- Global layout
- Authentication
- Shared providers
- Shared styling
- Route entry points

The shell app should remain relatively thin.

## Example shell routes

```tsx
<Route path="/" element={<Home />} />
<Route path="/admin/*" element={<AdminApp />} />
<Route path="/billing/*" element={<BillingApp />} />
<Route path="/dashboard/*" element={<DashboardApp />} />
```

Initially:
- apps can simply be route-based React apps

Later:
- apps can evolve into Module Federation remotes if required

---

# Individual Applications

Each application is a normal Vite app.

Example:

```txt
apps/admin/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── src/
```

Each app:
- builds independently
- deploys independently
- owns its own routes
- owns its own API interactions

---

# Shared Design System

This is one of the most important aspects of the architecture.

## The Key Principle

Do NOT allow every team to create its own Tailwind design system.

Instead centralize:
- design tokens
- Tailwind configuration
- shared UI primitives

---

# Design Tokens

Design tokens are the raw visual values that define the product design system.

Examples:

- colors
- spacing
- border radius
- shadows
- typography
- z-index values
- breakpoints

---

# Tokens Package

```txt
packages/tokens/
├── package.json
└── src/
    └── tokens.css
```

---

# Example tokens.css

```css
:root {
  --primary: 221 83% 53%;
  --secondary: 215 20% 65%;
  --background: 0 0% 100%;

  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

These become the single source of truth for the entire product.

---

# Shared Tailwind Configuration

## Purpose

The shared Tailwind config:
- maps tokens into utilities
- enforces consistency
- prevents styling divergence between teams

---

# Tailwind Config Package

```txt
packages/tailwind-config/
├── package.json
└── tailwind.config.ts
```

---

# Example Shared Tailwind Config

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        background: "hsl(var(--background))"
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      }
    }
  }
};

export default config;
```

---

# Using Shared Tailwind Config in Apps

Example:

```ts
import sharedConfig from "@org/tailwind-config";

export default {
  presets: [sharedConfig],
  content: ["./src/**/*.{ts,tsx}"]
};
```

---

# Shared UI Components

```txt
packages/ui/
├── package.json
└── src/
    ├── Button.tsx
    ├── Card.tsx
    ├── Dialog.tsx
    └── Table.tsx
```

These components:
- use shared tokens
- use shared Tailwind utilities
- ensure visual consistency

---

# AWS Environment Strategy

Use THREE separate AWS accounts.

```txt
my-product-test
my-product-staging
my-product-prod
```

---

# S3 Deployment Structure

```txt
s3://product-ui-prod/

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

---

# CloudFront Routing

| Path | App |
|---|---|
| `/` | shell |
| `/admin/*` | admin |
| `/billing/*` | billing |
| `/dashboard/*` | dashboard |

---

# Independent Deployment

Example:

```bash
pnpm --filter @apps/billing build

aws s3 sync apps/billing/dist/ \
  s3://product-ui-test/billing/ \
  --delete

aws cloudfront create-invalidation \
  --distribution-id XXXXX \
  --paths "/billing/*"
```

Only the billing app deploys.

---

# CI/CD Strategy

## Branching Strategy

```txt
develop  -> test
staging  -> staging
main     -> production
```

Promotion flow:

```txt
feature branch
    ↓
develop
    ↓
staging
    ↓
main
```

---

# GitHub Actions Structure

```txt
.github/workflows/
├── deploy-shell.yml
├── deploy-admin.yml
├── deploy-billing.yml
└── deploy-dashboard.yml
```

---

# Path-Based Deployment Triggers

```yaml
on:
  push:
    branches:
      - develop
      - staging
      - main

    paths:
      - "apps/billing/**"
      - "packages/ui/**"
      - "packages/tokens/**"
      - "packages/tailwind-config/**"
```

---

# GitHub → AWS Authentication

Use:
- GitHub OIDC
- IAM role assumption

DO NOT use:
- long-lived AWS access keys

---

# Caching Strategy

## index.html

```txt
Cache-Control: no-cache
```

## assets/

```txt
Cache-Control: public, max-age=31536000, immutable
```

---

# Recommended Evolution Path

## Phase 1

- Vite monorepo
- React Router
- Shared Tailwind design system
- Shared UI package
- Shared shell app

## Phase 2

- Multiple AWS environments
- GitHub Actions
- Independent deployments

## Phase 3

- Advanced app ownership
- Dynamic app loading
- Module Federation
- Runtime composition

---

# Final Architectural Summary

The modern practical frontend architecture for large React applications is increasingly:

```txt
Shared shell
+
Shared design system
+
Shared Tailwind preset
+
Shared design tokens
+
Independent route applications
+
Independent CI/CD
+
CloudFront path routing
+
AWS static hosting
+
Optional future federation
```
