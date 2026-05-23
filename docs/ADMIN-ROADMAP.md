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

## Next build: package management

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
