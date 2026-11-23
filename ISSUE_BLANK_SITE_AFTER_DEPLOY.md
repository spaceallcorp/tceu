# Problem: Site appears blank after deploy

## Root Cause

The GitHub Action workflow `.github/workflows/main.yml` was syncing only `dist/tceu/browser` via rclone to the WebDAV server. This omitted two critical files needed for the Angular SPA to render:

1. **`index.html`** — The Angular application entry point. Without it, the browser has no HTML document to display, resulting in a blank page.

2. **`.htaccess`** — Contains the Apache rewrite rule `RewriteRule ^ index.html [L]` which is essential for Angular router deep links to work correctly. Without this, navigating to any route other than the root results in a 404 or blank page.

## Fix Applied

Changed the rclone sync source from `dist/tceu/browser` to `dist/tceu` in the deploy step, ensuring the entire build output (including `index.html` and `.htaccess`) is deployed to the WebDAV server.

Also added a post-sync verification step that checks for `index.html` on the server after deployment, aborting the workflow if the critical file is missing.

## Changes Made

- **`.github/workflows/main.yml`**:
  - Line 140: Changed `rclone sync dist/tceu/browser mywebdav:/` → `rclone sync dist/tceu mywebdav:/`
  - Lines 158-162: Added verification that `index.html` exists on WebDAV after sync

## Verification

Added sanity check in the workflow:
```yaml
# Verify index.html made it to the server
if ! rclone ls mywebdav:/index.html >/dev/null 2>&1; then
  echo "❌ CRÍTICO: index.html not found on WebDAV after sync — aborting."
  exit 1
fi
```