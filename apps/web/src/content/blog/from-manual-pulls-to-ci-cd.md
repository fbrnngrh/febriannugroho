---
title: "From manual pulls to CI/CD"
description: "Moving more than eight APIs from manual server pulls to automated pipelines."
lead: "How we moved more than eight APIs from deploying by hand on the server to pipelines that test, build and ship on every push."
date: "2025-10-14"
readingTime: "6 min read"
slug: "from-manual-pulls-to-ci-cd"
tags: ["Shipping"]
cover: "ci-cd"
---

For a long time, shipping meant opening a terminal on the server, pulling the latest code and hoping nothing broke. It worked while there were only a few services.

## Why manual pulls stopped working

As the number of APIs grew past eight, every release turned into a checklist that only lived in someone's head. One missed step meant a broken build in front of users.

## The pipeline we ended up with

Every push now runs the tests, builds an image and deploys to staging. The `workflow file` is short enough to read in one go:

```yaml
# deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
```

## What changed for the team

Releases became boring, which is the point. Nobody has to remember the steps any more, and rolling back is one click instead of a late night.

> If you are still deploying by hand, start with staging only. It is the cheapest place to learn what breaks.
