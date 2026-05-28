# Build and run this UI image locally (Docker only).
# Default build matches production: no VITE_API_BASE_URL; nginx proxies /api/ to the API on the host (port 8080).
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$image = if ($env:IMAGE_NAME) { $env:IMAGE_NAME } else { 'system-frontend:local' }
$buildArgs = @()
$nodeEnv = if ($env:NODE_ENV -and $env:NODE_ENV.Trim().Length -gt 0) { $env:NODE_ENV.Trim() } else { 'development' }
$buildArgs += '--build-arg', "NODE_ENV=$nodeEnv"
if ($env:VITE_API_BASE_URL -and $env:VITE_API_BASE_URL.Trim().Length -gt 0) {
  $buildArgs += '--build-arg', "VITE_API_BASE_URL=$($env:VITE_API_BASE_URL)"
}
docker build -t $image @buildArgs .
docker run --rm -p 3000:3000 --add-host "host.docker.internal:host-gateway" $image
