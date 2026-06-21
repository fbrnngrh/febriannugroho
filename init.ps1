$ErrorActionPreference = "Stop"

Write-Host "=== Harness Initialization ==="

Write-Host "=== bun install ==="
bun install

Write-Host "=== bun run check-types ==="
bun run check-types

Write-Host "=== bun run -F web check ==="
bun run -F web check

Write-Host "=== Verification Complete ==="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Read docs/feature_list.json to see current feature state"
Write-Host "2. Pick ONE unfinished feature to work on"
Write-Host "3. Implement only that feature"
Write-Host "4. Re-run verification before claiming done"
