#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required on the VPS"
  exit 1
fi

if ! command -v "docker" >/dev/null 2>&1; then
  echo "docker command not found"
  exit 1
fi

echo "Starting deployment..."

docker compose pull || true
docker compose up -d --build
docker compose ps

echo "Deployment completed successfully."
