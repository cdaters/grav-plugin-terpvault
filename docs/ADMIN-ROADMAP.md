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

## v0.2.9 Import Inspect

- Add inspect-only validation for uploaded `.terpvault.zip` packages from the opt-in Admin2 Library Manager.
- Register a controller-style route only when `admin.enable_admin2_page` is enabled:
  - `POST /terpvault/packages/import/inspect`
- Stage the uploaded zip in temporary storage only; do not extract or move files into `user/data/terpvault/games`.
- Ignore macOS and Windows cruft before top-level-folder analysis.
- Require exactly one top-level package folder, `game.yaml`, and `resources.story_file`.
- Validate zip entries for null bytes, URI schemes, absolute paths, empty normalized paths, `.` / `..` traversal segments, and package containment after stripping the top folder.
- Validate story-file extension with the same allowlist used by Story File Manager Lite.
- Validate referenced helper Markdown and media paths, reporting missing optional helper/media files as warnings.
- Report candidate slug, YAML slug, top folder, title, author, story file, story extension, collision status, iFiction XML presence, ignored files, included files, fatal errors, and warnings.
- Add an Admin2 Import Package panel that clearly states inspect-only behavior and omits commit/install controls.
- Keep import commit/install, package creation from imports, package delete, arbitrary file browsing, public routing, and player behavior out of scope.

## v0.3.0 Import Commit

- Add draft-only import commit for uploaded `.terpvault.zip` packages after inspection.
- Register a controller-style route only when `admin.enable_admin2_page` is enabled:
  - `POST /terpvault/packages/import`
- Require multipart `file` and final `slug` fields.
- Reopen and revalidate the uploaded zip server-side during commit; do not trust a browser inspection response.
- Require a safe final slug and reject destination collisions.
- Extract only into temporary staging first, never directly into `user/data/terpvault/games`.
- Ignore safe cruft, but keep unsafe cruft-looking paths fatal.
- Rewrite staged `game.yaml` with `id`, `slug`, and `terpvault.status: draft`.
- Move the normalized staged package folder into `games/{slug}` only after validation and metadata rewrite succeed.
- Refresh the Admin2 package library after successful import and open the imported package row when practical.
- Keep package delete, overwrite/replace, arbitrary file browsing, public routing, and player behavior out of scope.

## v0.3.1 Import Polish

- Force imported packages to `terpvault.featured: false` as well as `terpvault.status: draft`.
- Normalize empty imported `identification.ifids`, `resources.screenshots`, and `terpvault.tags` values to empty arrays without rewriting non-empty values.
- Make Admin2 import success messaging clearer about reviewing metadata, helper docs, media, story file, license/provenance, and publishing only when ready.
- Soften stale collision indicators after a successful alternate-slug import.
- Delay export object URL cleanup for browser download safety.

## v0.3.2 Metadata and Documentation Consistency

- Bump plugin blueprint metadata to `0.3.2`.
- Align README and docs with v0.3.x early public-beta/foundation language.
- Document PHP ZipArchive/`php-zip`, Admin2 Library Manager enablement, Admin2/API authentication, current package lifecycle, limitations, and import safety guarantees.
- Clarify plugin metadata description, keywords, and compatibility posture without making unverified Grav 1/API 1 or GPM-readiness claims.
- Keep import/export behavior, routing, player behavior, and security behavior unchanged.

## v0.4.0 Planning: Hero Images, Feelies, and Metadata Enrichment

This section is planning only. These items are not implemented yet.

### Public package presentation

- Add optional `resources.hero` support for public detail/play presentation.
- Keep `resources.cover` as the conventional package/display/title/box-art image.
- Keep `resources.small_cover` as the compact catalog/library-card image.
- Treat `resources.hero` as an atmospheric wide image for page backgrounds or large visual headers, not as a replacement for cover art.
- Proposed hero presentation options:
  - `focal_position`: CSS-like focal point such as `center center`, `top center`, or `35% 45%`.
  - `overlay_tone`: restrained presets such as `light`, `dark`, `warm`, `cool`, or `none`.
  - `gradient_direction`: `to bottom`, `to top`, `to right`, `to left`, or `radial`.
  - `overlay_color`: optional hex/rgb color for site-specific tone matching.
- Public detail pages can use the hero image as a wide header/background while preserving readable metadata and provenance sections.
- Public play pages can optionally use the hero image around the player shell, but the player iframe and controls must remain readable and stable.

### Feelies and extras

- Add optional `resources.feelies` for package-local supplemental files: maps, manuals, letters, newsletters, clue sheets, PDFs, images, audio, and other curated extras.
- Render public feelies/extras as a clearly labeled supplemental section on the detail page.
- Consider grouped rendering by type: documents, maps/images, audio, and other downloads.
- Keep all feelies package-local and served through controlled asset/file routes when implemented.
- Proposed initial allowed extensions:
  - Documents: `pdf`, `txt`, `md`
  - Images/maps: `jpg`, `jpeg`, `png`, `webp`, `gif`, `svg`
  - Audio: `mp3`, `ogg`, `wav`, `m4a`
  - Archives should stay out of the first public rendering pass unless a stronger safety story is designed.

### Admin2 sequencing

- Implement public read/render support first only after the schema is settled.
- Add Admin2 hero management after public rendering exists.
- Add Admin2 feelies/extras management later, with allowlisted uploads and package-local path validation.
- Do not turn feelies into arbitrary file browsing; expose only manifest-declared supplemental files.

### Metadata enrichment roadmap

- Keep enrichment preview-based and non-destructive.
- Start with local `metadata.iFiction.xml` parsing because it is package-local and reviewable.
- Show proposed `game.yaml` changes before applying them.
- Prefer merge previews that identify source, confidence, and target field.
- After iFiction XML, explore IFDB lookup by IFID/TUID, then IFWiki and IF Archive enrichment.
- Treat remote catalog lookups as curator aids, not authoritative replacements for license/provenance review.

## Next build: package presentation planning

- Field-test the v0.3.x Admin2 package management workflow before adding new package-management capabilities.
- Improve diagnostics or release packaging notes only when they are grounded in testing.
- Decide whether v0.4.0 should ship public hero/feelies rendering first, or keep the release as schema/documentation groundwork before UI work.

## Later

- Server-side named saves for logged-in users.
- Admin2 management for hero images and feelies/extras.
- Preview-based iFiction/Treaty of Babel metadata enrichment.
- Preview-based IFDB, IFWiki, and IF Archive enrichment.
- Classic Grav Admin compatibility page only if Grav 1/Admin UX support is verified and becomes an explicit target.
