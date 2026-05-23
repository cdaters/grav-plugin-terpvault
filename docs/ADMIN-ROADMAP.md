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

## v0.2.2 metadata editor UI

- Add per-package Edit Metadata actions to the opt-in Admin2 Library Manager.
- Load editable package metadata from `GET /api/v1/terpvault/packages/{slug}/metadata`.
- Save only whitelisted `game.yaml` fields with `PATCH /api/v1/terpvault/packages/{slug}/metadata`.
- Keep slug/folder, story-file paths, artwork paths, screenshots, helper Markdown paths, and player settings display-only.
- Preserve unsaved form values when a save fails.
- Refresh the read-only manifest after a successful save when the public manifest endpoint is available.
- Keep Admin2 Library Manager disabled by default until the workflow has broader field testing.

Editable fields:

- `bibliographic.title`
- `bibliographic.author`
- `bibliographic.headline`
- `bibliographic.first_published`
- `bibliographic.genre`
- `bibliographic.language`
- `bibliographic.description`
- `identification.format`
- `identification.ifids`
- `catalog.ifdb.tuid`
- `catalog.ifdb.url`
- `catalog.ifwiki.url`
- `catalog.ifarchive.path`
- `catalog.ifarchive.url`
- `release.license.name`
- `release.license.url`
- `release.license.notes`
- `release.source.url`
- `release.source.retrieved`
- `release.source.notes`
- `terpvault.status`
- `terpvault.featured`
- `terpvault.tags`

## v0.2.3 helper Markdown editor

- Add package-local helper Markdown editing to the existing Admin2 package editor.
- Register controller-style routes only when `admin.enable_admin2_page` is enabled:
  - `GET /terpvault/packages/{slug}/markdown/{type}`
  - `PATCH /terpvault/packages/{slug}/markdown/{type}`
- Allow only these helper types:
  - `how-to-play`
  - `hints`
  - `walkthrough`
- Resolve helper paths from `resources.how_to_play`, `resources.hints`, and `resources.walkthrough`, with default filenames of `how-to-play.md`, `hints.md`, and `walkthrough.md`.
- Keep helper editing as a plain textarea workflow for now; no rich Markdown editor.
- Validate slug, type, package containment, traversal, and `.md` extension before reading or writing.
- Create package-local timestamped backups before replacing existing helper Markdown files.
- Keep story files, cover art, screenshots, `metadata.iFiction.xml`, player config, package creation, upload, delete, import, and export out of scope.

## v0.2.4 Media Manager Lite

- Add limited package-local image management to the existing Admin2 package editor.
- Register controller-style routes only when `admin.enable_admin2_page` is enabled:
  - `GET /terpvault/packages/{slug}/media`
  - `POST /terpvault/packages/{slug}/media/{type}`
- Allow only these media types:
  - `cover`
  - `small-cover`
  - `screenshot`
- Allow only these image extensions:
  - `jpg`
  - `jpeg`
  - `png`
  - `webp`
- Do not allow SVG in this milestone.
- Normalize replacement cover filenames to `cover.{ext}` and `small-cover.{ext}`.
- Store screenshots under `screenshots/` and add the package-local relative path to `resources.screenshots`.
- Update `resources.cover`, `resources.small_cover`, or `resources.screenshots` only after the uploaded image file is written.
- Preserve unknown `game.yaml` fields when updating media resource paths.
- Keep story-file upload, arbitrary file browsing, package delete, package import/export, `metadata.iFiction.xml` editing, and player config editing out of scope.

## Next build: package management UI

- Create new package folder.
- Upload/replace story file.
- Import package zip with macOS cruft stripping.
- Export package zip.

## Later

- Server-side named saves for logged-in users.
- iFiction/Treaty of Babel metadata import/export.
- IFDB/source/provenance helper fields.
- Classic Grav Admin compatibility page if maintaining Grav 1/Admin UX remains important.
