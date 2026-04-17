#!/bin/bash
set -a
source "$(dirname "$0")/../.dev.vars"
set +a

exec npx concurrently \
  "cloudflared tunnel run --token $CLOUDFLARE_TUNNEL_TOKEN" \
  "react-router dev"
