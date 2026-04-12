# Build and run this UI image locally (Docker only). The API base URL must be reachable from the browser.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
if (-not $env:VITE_API_BASE_URL) { $env:VITE_API_BASE_URL = 'http://127.0.0.1:8080' }
$image = if ($env:IMAGE_NAME) { $env:IMAGE_NAME } else { 'system-frontend:local' }
docker build -t $image --build-arg "VITE_API_BASE_URL=$env:VITE_API_BASE_URL" .
docker run --rm -p 3000:3000 $image
