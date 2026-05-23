# TerpVault Admin Roadmap

## v0.2.0 read-only manager

- Register Admin2 sidebar item only when the experimental Admin2 hub setting is enabled.
- Provide full-page component at `admin-next/pages/terpvault.js`.
- Keep `admin.enable_admin2_page: false` as the default.
- Show collapsible library package rows with title, slug, format, status, story-file presence, warning/error counts, and validation notes.
- Show source/license/provenance summaries when package metadata provides them.
- Link to public Detail and Play routes.
- Show supported interpreter formats.
- Show settings/storage diagnostics.
- Avoid Admin2 API endpoints until controller-style API integration is implemented.
- Keep the page read-only: no editing, upload, delete, import, export, or file mutation.

## v0.2.1a metadata API

- Register backend metadata API routes only when `admin.enable_admin2_page` is enabled.
- Use controller method arrays, not Closure request handlers:
  - `GET /terpvault/packages/{slug}/metadata`
  - `PATCH /terpvault/packages/{slug}/metadata`
- Restrict write permission to `admin.super` or `api.super` for the first backend milestone.
- Edit only whitelisted `game.yaml` metadata fields.
- Keep package slug/folder, story files, art paths, screenshots, helper Markdown paths, and player config read-only.
- Preserve unknown YAML fields structurally by loading the whole manifest and merging only whitelisted paths.
- Write `game.yaml` with a package-local lock, timestamped backup, same-directory temp file, and atomic rename.

Manual DDEV/API test sketch:

```bash
curl -H "X-API-Token: $TOKEN" \
  https://example.ddev.site/api/terpvault/packages/adventure/metadata

curl -X PATCH \
  -H "X-API-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"metadata":{"bibliographic":{"headline":"Updated from Admin2 API test"}}}' \
  https://example.ddev.site/api/terpvault/packages/adventure/metadata
```

Adjust the API prefix if the local API plugin uses `/api/v1` or another configured route.

## Next build: package management UI

- Create new package folder.
- Edit `game.yaml` fields.
- Upload/replace story file.
- Upload/replace cover and small-cover art.
- Upload screenshots.
- Edit `how-to-play.md`, `hints.md`, and `walkthrough.md`.
- Import package zip with macOS cruft stripping.
- Export package zip.

## Later

- Server-side named saves for logged-in users.
- iFiction/Treaty of Babel metadata import/export.
- IFDB/source/provenance helper fields.
- Classic Grav Admin compatibility page if maintaining Grav 1/Admin UX remains important.
