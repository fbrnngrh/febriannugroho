#!/bin/bash
set -e

echo "=== Harness Initialization ==="

echo "=== bun install ==="
bun install

echo "=== bun run check-types ==="
bun run check-types

echo "=== bun run -F web check ==="
bun run -F web check

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read docs/feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. Implement only that feature"
echo "4. Re-run verification before claiming done"
