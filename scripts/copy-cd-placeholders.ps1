# Copy CD frame placeholder images into shared_assets/cd
# Run from repo root: .\custom-frame-sizes\scripts\copy-cd-placeholders.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path $root)) { $root = "D:\3_job_projects\us_CustomFrame" }

$srcDisc = Join-Path $root "assets\attached_assets\Untitled-1_1763784601119.png"
$srcInsert = Join-Path $root "assets\public\images\cd-insert-placeholder.jpg"
$destDir = Join-Path $root "custom-frame-sizes\assets_to_use\shared_assets\cd"

if (-not (Test-Path $srcDisc)) { Write-Error "Source not found: $srcDisc" }
if (-not (Test-Path $srcInsert)) { Write-Error "Source not found: $srcInsert" }
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

Copy-Item -Path $srcDisc -Destination (Join-Path $destDir "disc-placeholder.png") -Force
Copy-Item -Path $srcInsert -Destination (Join-Path $destDir "insert-placeholder.jpg") -Force
Write-Host "Copied disc-placeholder.png and insert-placeholder.jpg to shared_assets/cd"
