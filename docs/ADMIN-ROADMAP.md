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

## v0.2.5 screenshot list polish

- Add screenshot list management to Media Manager Lite.
- Register a controller-style route only when `admin.enable_admin2_page` is enabled:
  - `PATCH /terpvault/packages/{slug}/media/screenshots`
- Support reordering and removing screenshot entries from `resources.screenshots`.
- Do not delete physical image files when removing a screenshot from the package list.
- Accept only screenshot paths already present in `resources.screenshots` for reorder/remove operations.
- Prevent duplicate screenshot entries when the same screenshot filename is uploaded again.
- Allow replacing a registered screenshot file through the existing `POST /terpvault/packages/{slug}/media/screenshot` route with a replacement path or index.
- Keep story-file upload, arbitrary file browsing, package delete, package import/export, `metadata.iFiction.xml` editing, and player config editing out of scope.

## v0.2.6 Story File Manager Lite

- Add limited package-local playable story-file replacement to the existing Admin2 package editor.
- Register controller-style routes only when `admin.enable_admin2_page` is enabled:
  - `GET /terpvault/packages/{slug}/story`
  - `POST /terpvault/packages/{slug}/story`
- Show current `resources.story_file`, existence, extension, and size.
- Allow one uploaded story file with an allowlisted extension:
  - `z3`
  - `z4`
  - `z5`
  - `z6`
  - `z7`
  - `z8`
  - `zblorb`
  - `zlb`
  - `ulx`
  - `gblorb`
  - `glb`
  - `t3`
- Normalize uploaded story filenames to safe lowercase package-local names.
- Back up the existing registered story file when present before changing `resources.story_file`.
- Preserve unknown `game.yaml` fields when updating `resources.story_file`.
- Keep package delete, package import/export, arbitrary file browsing, `metadata.iFiction.xml` editing, and player behavior out of scope.

## v0.2.7 Package Creation Wizard

- Add limited package creation to the opt-in Admin2 Library Manager.
- Register a controller-style route only when `admin.enable_admin2_page` is enabled:
  - `POST /terpvault/packages`
- Create a new package folder under the configured TerpVault games directory.
- Require a lowercase URL-safe slug, title, and one initial story file.
- Reject existing package folders; do not overwrite packages.
- Create a starter Treaty/iFiction-aligned `game.yaml`.
- Store the uploaded initial story file in the new package folder using the story-file allowlist from v0.2.6.
- Create starter `how-to-play.md`, `hints.md`, and `walkthrough.md` files.
- Open the newly created package row in Admin2 after creation when the manifest refresh succeeds.
- Keep cover/screenshot upload, deeper metadata editing, helper editing, and story replacement in the existing post-creation editor sections.
- Keep package delete, package import/export, arbitrary file browsing, `metadata.iFiction.xml` editing, and player behavior out of scope.

## v0.2.8 Package Export

- Add authenticated export for one installed package from the opt-in Admin2 Library Manager.
- Register a controller-style route only when `admin.enable_admin2_page` is enabled:
  - `GET /terpvault/packages/{slug}/export`
- Create a canonical `{slug}.terpvault.zip` archive with exactly one top-level `{slug}/` folder.
- Include `game.yaml`, `resources.story_file`, referenced cover/small-cover/screenshots/helper Markdown files, `metadata.iFiction.xml` when present, and safe conventional cover/screenshot/helper files.
- Exclude backups, lock files, temp files, hidden files/directories, macOS cruft, Windows cruft, and unrelated/unreferenced files.
- Validate slug, package base-path containment, package-local relative paths, traversal segments, absolute paths, URI paths, null bytes, and source-file containment before adding files to the archive.
- Add an Export button to each Admin2 package row.
- Keep package import, import inspect, import commit, package delete, arbitrary file browsing, public routing, `metadata.iFiction.xml` editing, and player behavior out of scope.

## Next build: package management UI

- Import package zip with macOS cruft stripping.

## Later

- Server-side named saves for logged-in users.
- iFiction/Treaty of Babel metadata import/export.
- IFDB/source/provenance helper fields.
- Classic Grav Admin compatibility page if maintaining Grav 1/Admin UX remains important.
