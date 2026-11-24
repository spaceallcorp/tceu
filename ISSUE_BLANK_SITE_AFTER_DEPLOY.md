# Blank site after deploy — root cause and fix

## Root cause

The site rendered blank because the production bundle was built by CI with an
**incomplete/empty Firebase config** (secrets missing or empty), and
`initializeApp()` throws when `projectId` is absent:

```
ERROR FirebaseError: "projectId" not provided in firebase.initializeApp.
```

That exception aborts Angular bootstrap, so only the cookie banner rendered —
looked like a blank page. A manual deploy worked because it used the local
`environment.prod.ts` (which has real values and is gitignored).

A second contributing factor: the old deploy step **deleted the entire web
root and then re-uploaded** file by file (~9 minutes). During that window the
site had no `index.html`/assets, so it was blank on every deploy and stayed
blank if the job died mid-upload.

## Fix

1. `src/app/app.config.ts`
   - Only call `initializeApp()` with a **complete** config. If Firebase values
     are missing, use a fully-formed placeholder instead of `{apiKey}` — so a
     missing config can never crash bootstrap again.

2. `.github/workflows/main.yml`
   - Firebase/Auth0 values now fall back to the project defaults when the
     GitHub secrets are empty (same approach as the reference project), so CI
     never builds an empty config.
   - Build verification checks `index.html`, `.htaccess`, `main-*.js`.
   - Deploy is **zero-downtime**: upload all assets first, upload
     `index.html` last, and never wipe the site before uploading. Old hashed
     assets are left in place so browsers holding an older `index.html` keep
     working.
   - Post-deploy smoke test compares the local `main-*.js` hash with what the
     live site serves, and fails if the deployed build is not actually live
     (e.g. if the WebDAV root is not the web document root).

## Note on caching (server-side)

The host is nginx and returns the SPA fallback (`index.html`, `Content-Type:
text/html`, HTTP 200) for missing asset paths. Combined with no `Cache-Control`
on `index.html`, a cached old index can request deleted hashed files and fail
to boot. Leaving old hashed assets in place mitigates this; for a complete fix,
set `index.html` to `Cache-Control: no-cache` and hashed assets to `immutable`
in the nginx config.
