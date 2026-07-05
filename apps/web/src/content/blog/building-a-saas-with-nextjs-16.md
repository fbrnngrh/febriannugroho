---
title: "Building a SaaS with Next.js 16"
description: "Key architectural patterns and lessons learned from deploying next-generation SaaS applications."
date: "2025-06-15"
readingTime: "8 min read"
slug: "building-a-saas-with-nextjs-16"
tags: ["Next.js", "SaaS", "Fullstack"]
coverImage: "/images/blog/nextjs-saas-hero.png"
---

Building a software-as-a-service (SaaS) product requires solving complex problems like multi-tenancy, dynamic subdomains, and ultra-fast page response times. Next.js has emerged as the premier framework for full-stack applications, providing structural tools to tackle these hurdles.

## The Architectural Blueprint

A modern SaaS stack has to balance security, speed, and development simplicity. Our recommended baseline uses:
1. **Next.js App Router** for layouts, nested routing, and Server Components.
2. **Server Actions** for secure mutations without maintaining separate API gateways.
3. **Partial Prerendering (PPR)** to serve static structures instantly while streaming dynamic content.
4. **Middleware** for resolving dynamic tenant subdomains.

## Server Components vs Client Boundaries

One of the most common mistakes in Next.js applications is marking whole layouts with `'use client'`. For optimal performance, push client boundaries as far down the component tree as possible.

- **Server Components (Default)**: Fetch data, render static HTML structure, and keep secure database credentials away from the client bundle.
- **Client Components (opt-in)**: Add interactivity, use browser-only APIs (like `localStorage`), and handle reactive local states (like toggle state).

By keeping your page headers, navigations, and structural elements on the server, you drastically reduce the Javascript shipped to users and maximize SEO efficiency.

## Dynamic Multi-Tenant Subdomains

Many SaaS products require custom subdomains (e.g. `tenant1.yourservice.com`) or custom domains altogether. In Next.js, you can handle this dynamically using Middleware to rewrite requests under the hood.

Here is a middleware example that parses the hostname and redirects requests to tenant-specific folders:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Exclude assets, api routes, and static pages
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Parse tenant subdomain (e.g. tenant.domain.com -> tenant)
  const currentHost = hostname
    .replace(".localhost:3000", "")
    .replace(".yourservice.com", "");

  if (currentHost && currentHost !== "www" && currentHost !== "yourservice") {
    // Rewrites the request to the dynamic tenant directory
    url.pathname = `/_tenants/${currentHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
```

This rewrite happens transparently inside Vercel or your hosting environment, keeping the user's address bar clean (showing `tenant.yourservice.com`) while routing them to `app/components/_tenants/[tenant]/page.tsx` on the server.

## Partial Prerendering (PPR)

Partial Prerendering combines static page generation with dynamic server-side streaming. During the build process, Next.js compiles a static HTML shell containing headers and navigation stubs. When a request comes in:
1. The static shell is served instantly from the edge cache.
2. A database request is made concurrently on the server.
3. Dynamic components (like billing tables, dashboard metrics) stream into place as soon as the database resolves.

This eliminates loading spinners and layout shifts, yielding near-instant First Contentful Paint (FCP) metrics.

## Practical Recommendations

If you are starting a SaaS project today:
- Design your data models with a `tenantId` field on every table to ensure tenant isolation.
- Write your mutations as Server Actions and secure them using role-based access checks.
- Set up a caching strategy using `unstable_cache` to store high-frequency queries like settings or tenant metadata.

## Conclusion

Next.js provides a robust foundation for building high-performance, scale-ready SaaS products. By combining edge-based middleware routing, server-first data processing, and progressive streaming, you can focus on building features rather than managing infrastructure.

- **Decoupled domains**: Resolve dynamic routing inside middleware rewrites.
- **Server mutations**: Secure actions natively without boilerplate API code.
- **Performance priority**: Push client components to the leaves of the tree.

Ready to build? Start by outlining your tenant routing structure and designing middleware to handle dynamic hostname rewrites!
