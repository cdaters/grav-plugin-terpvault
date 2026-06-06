# Terpwright Package Builder

Terpwright is the Admin2 package-builder workflow for TerpVault. It helps a curator assemble a reviewable TerpVault package from local files and known interactive-fiction ecosystem references without replacing curator judgment, license review, or provenance notes.

Phase 1 local-file package creation is implemented in Admin2. Later metadata lookup, scraping, automation, guided recipes, richer Oracle generation, and Ink support remain roadmap-only.

## Purpose

Terpwright v1 should make the common package-building path less error-prone:

- Start from a local story file or an uploaded `.terpvault.zip`.
- Collect package metadata, artwork, helper Markdown, optional iFiction XML, and provenance notes.
- Build a draft package folder that follows TerpVault package conventions.
- Validate the candidate before draft install or export.
- Keep every source and rights assumption visible for curator review.

Terpwright complements the current Admin2 package lifecycle. Current Admin2 already supports limited package creation, metadata editing, helper Markdown editing, media/screenshots management, local iFiction preview/apply, story replacement, export, import inspection, and draft-only import commit. Terpwright should reuse those services and validation rules rather than becoming a parallel package system.

## Current Phase 1 Status

Admin2 now exposes `Terpwright Phase 1: Local Package Builder` through the existing Create Package action.

Implemented:

- Local story-file upload with the TerpVault story extension allowlist.
- `resources.story_file` creation and `resources.story_sha256` checksum recording.
- Format inference from story extension when the curator leaves format blank.
- Basic metadata entry for title, slug, author/source attribution, headline, IFID, description, tags, license, and source notes.
- Manual metadata/provenance URL entry for named roles such as source/package URL, upstream project URL, port/source repository URL, IFDB, IFWiki, IF Archive, license, and optional reference-only links.
- Draft-only output: `terpvault.status` is forced to `draft` and `terpvault.featured` is forced to `false`.
- Optional local uploads for cover, small-cover, hero, screenshots, helper Markdown files, `known-differences.md`, `provenance.md`, `metadata.iFiction.xml`, and feelies.
- Package-local resource paths only, with traversal/system-file checks and conservative extension allowlists.
- Repository readback validation after package generation, with warning/error results shown in Admin2.
- Created packages remain exportable through the existing `.terpvault.zip` export flow.

Not implemented in Phase 1:

- Remote IFDB, IF Archive, IFWiki, or arbitrary URL lookup.
- Scraping.
- Metadata assistant automation.
- Ink support.
- Oracle structured-source generation.

## What Terpwright Is Not

Terpwright is not:

- A scraper for IFDB, IFWiki, IF Archive, or arbitrary web pages.
- A rights resolver or legal clearance tool.
- A blind downloader for story files, covers, screenshots, walkthroughs, maps, manuals, scans, clue sheets, or feelies.
- A replacement for curator review of `game.yaml`, package files, licenses, and provenance.
- A public publishing shortcut.
- An import overwrite or package replace workflow.
- An arbitrary package file browser.
- An Ink runtime, Ink package format, or Ink content builder.
- A structured Oracle generator in v1.

URLs, catalog entries, source repositories, archive paths, and local uploads are evidence for review, not permission by themselves.

## V1 Scope

Terpwright v1 should be a local-file-first package builder.

In scope:

- Local story file upload for supported parser IF story formats.
- `.terpvault.zip` upload through the existing inspect/import model.
- Optional local cover, small-cover, hero, and screenshot uploads.
- Optional local helper Markdown files:
  - `how-to-play.md`
  - `hints.md`
  - `walkthrough.md`
  - `provenance.md`
  - `known-differences.md`
- Optional local `metadata.iFiction.xml` upload.
- Manual metadata entry and review for `game.yaml`.
- Manual source/reference entry for IFDB URL, IF Archive URL/path, and IFWiki URL.
- Story-file validation, story hash recording, resource reference validation, and package validation.
- Draft package folder creation.
- Draft-only install.
- Export of an explicit package candidate as `.terpvault.zip`.

Out of scope for v1:

- Remote lookup/search.
- Automatic IFDB, IFWiki, IF Archive, or web-page fetching.
- Automatic cover/art download.
- Cover generation or art suggestions.
- Automated provenance drafting.
- Bulk package building.
- Package overwrite/replace.
- Package delete.
- Structured Oracle source generation.
- Ink package/runtime support.

The dividing line is important: Terpwright v1 is a package-builder workflow. The smarter Metadata Assistant remains a later preview-driven feature that may propose metadata from manually supplied URLs or configured providers, but must not silently fetch, merge, or download files.

## Inputs

### Local Inputs

Terpwright v1 should accept:

- One local story file, using the same story-file allowlist as current package creation and story replacement.
- One local `.terpvault.zip`, using the same inspection and draft-only import rules as current Admin2 import.
- Local cover image.
- Local small-cover image.
- Local hero image.
- Local screenshots.
- Local helper Markdown files.
- Local `metadata.iFiction.xml`.
- Local package support files such as `provenance.md` and `LICENSE-upstream.txt` where package conventions allow them.

### Manual Reference Inputs

Terpwright v1 may let a curator paste or type:

- IFDB URL or TUID.
- IF Archive path or URL.
- IFWiki URL.
- Source URL.
- Upstream project URL.
- Port/source repository URL.
- License URL or license name.
- Cover, hero, screenshot, walkthrough, hints, map, and history/background reference URLs.
- Retrieval date.
- Notes describing source selection, build basis, asset basis, and redistribution status.

These references should seed fields or notes only after curator review. They should not trigger remote fetches in v1.

### Phase 2 Manual URL Metadata

Phase 2 adds manual URL assistance on top of the Phase 1 local-file package builder. It accepts curator-supplied URLs and stores them in `game.yaml` without contacting the remote sites:

```yaml
catalog:
  ifdb:
    tuid: ''
    url: ''
  ifwiki:
    url: ''
  ifarchive:
    path: ''
    url: ''

release:
  license:
    name: Verify before redistribution
    url: ''
    notes: ''
  source:
    url: ''
    retrieved: ''
    notes: ''
    upstream:
      url: ''
    port_repository:
      url: ''

references:
  - role: map
    label: Map reference
    url: https://example.com/map
    notes: Reference only.
```

`catalog.*` should be used for IF ecosystem catalog context. `release.source.url` should identify the package/story source when there is one clear primary source. `release.source.upstream.url` should identify a canonical upstream project or source distribution. `release.source.port_repository.url` should identify a port or source repository used for the TerpVault package variant. `references` is for supporting or reference-only links such as art sources, maps, walkthroughs, hints, screenshots, or background/history pages.

URL presence reduces missing-source prompts only when it records a source, upstream, port repository, or IF Archive reference. It does not prove redistribution rights. License name, license URL, and license notes remain curator-reviewed evidence, not an automatic clearance decision.

### Later Inputs

Later phases may add:

- Remote lookup/search.
- Metadata Assistant provider candidates.
- Cover generation or art suggestion workflows.
- Automated provenance draft suggestions.
- Guided package recipes for known source families.

Later inputs must keep preview/apply behavior, source attribution, retrieval dates, and license review explicit.

## Outputs

Terpwright should produce reviewable package artifacts:

- A draft package folder under the configured games directory.
- A `.terpvault.zip` candidate with one top-level slug folder.
- A draft-only install result.
- A validation report with errors, warnings, and informational notes.
- A package export candidate suitable for external review or later import.

Generated `game.yaml` should follow the structured manifest conventions in `docs/PACKAGE-CONVENTIONS.md`. Draft output should set:

```yaml
terpvault:
  status: draft
  featured: false
```

Terpwright should never auto-publish a package. Publishing remains a separate existing lifecycle action after review.

## Admin2 Workflow

A future Admin2 Terpwright wizard should be explicit, reviewable, and resumable where practical.

Recommended steps:

1. Source selection.
   - Choose local story file, package zip, or draft-from-scratch.
   - Enter optional IFDB, IFWiki, IF Archive, source, and license references.
   - Show that references do not prove redistribution rights.

2. Story file validation.
   - Validate extension and package-local path.
   - Infer likely format where possible without overwriting curator-supplied values.
   - Calculate and show story hash.
   - Detect missing or unsupported story files as error-level blockers.

3. Metadata review.
   - Create or edit structured `game.yaml` fields.
   - Preview local `metadata.iFiction.xml` when supplied.
   - Allow selected-field iFiction apply through the existing local preview/apply model.
   - Preserve unknown YAML fields where applicable.

4. Resource assignment.
   - Assign cover, small-cover, hero, and screenshots.
   - Enforce package-local paths and allowlisted extensions.
   - Keep SVG excluded for public images unless a future sanitization or forced-download policy exists.

5. Helper docs creation/editing.
   - Create or attach `how-to-play.md`, `hints.md`, `walkthrough.md`, `provenance.md`, and `known-differences.md`.
   - Prefer original curator writing or explicitly licensed reuse.
   - Avoid copying large web content verbatim into package docs.
   - Treat `known-differences.md` as the optional `resources.known_differences` document when the package differs materially from a source, native build, reference release, or historical edition.

6. Feelies review.
   - Add only curated supplemental files, not arbitrary directory contents.
   - Require item-level source/provenance notes for third-party files.
   - Support "reference only" notes when a source should be documented but not packaged.

7. Validation.
   - Run package validation before install or export.
   - Show errors separately from warnings.
   - Show rights/provenance warnings without hiding assumptions.

8. Draft install.
   - Install as draft and not featured.
   - Refuse slug collisions unless a future reviewed replace workflow exists.
   - Revalidate server-side before writing.

9. Export package.
   - Export the reviewed candidate as `.terpvault.zip`.
   - Preserve only files accepted by package conventions and referenced resources.
   - Exclude cruft, backups, hidden files, temporary files, and unrelated files.

10. Publish later.
   - Use existing Admin2 lifecycle controls after curator review.
   - Keep publish/unpublish separate from build/import/export.

## Source Handling And Copyright Guardrails

Terpwright should make source handling more visible, not more automatic.

Rules:

- Never assume rights from a URL, catalog record, source repository, archive path, or search result.
- Distinguish story/source license from covers, screenshots, walkthroughs, hints, maps, manuals, scans, clue sheets, catalog prose, trademarks, and feelies.
- Require curator confirmation before packaging third-party assets.
- Preserve source URLs and retrieval dates for metadata, story files, source releases, art, screenshots, helper docs, iFiction XML, and feelies when they differ.
- Mark uncertain licenses as warnings or pending-review notes.
- Do not hide uncertain provenance behind generated summaries.
- Avoid copying large web content verbatim into package docs.
- Support "reference only" notes for sources that should be cited but not bundled.
- Keep package-local original material identified as original package material.
- Preserve upstream license files when required or useful.
- Treat trademarks and branding separately from copyright/license status.
- Keep rights-holder removal language a supplement to review, not a replacement for review.

Terpwright should classify source materials at least as:

- Story/source license and provenance.
- Package-local original materials.
- Catalog/reference metadata.
- Third-party materials requiring caution.
- Historical reference/preservation materials.
- Uncertain provenance or pending review.
- Reference-only, not packaged.

## Validation Model

Terpwright validation should reuse and extend the current package validation posture.

Error-level blockers:

- Missing `game.yaml`.
- Missing `resources.story_file`.
- Missing or unreadable story file.
- Unsupported or unsafe story-file path.
- Unsafe package paths, traversal, absolute paths, URI-like paths, or null bytes.
- Slug collision during draft install.
- Invalid package zip shape.

Warnings:

- Missing title.
- Missing IFID.
- Missing source role, upstream/port repository, IF Archive path/URL, or provenance notes.
- Missing license name or redistribution notes.
- License marked "verify before redistribution" or equivalent.
- Missing cover, small-cover, screenshots, helper docs, or catalog links.
- iFiction values differ from `game.yaml`.
- Metadata completeness gaps.
- Uncertain third-party asset status.
- Reference-only sources not packaged.

Validation should cover:

- Required resources.
- Optional resource completeness.
- Story hash calculation.
- iFiction XML well-formedness and DOCTYPE rejection.
- iFiction consistency with selected `game.yaml` fields.
- Package-local resource references.
- Optional `resources.known_differences` references when present; they must be safe package-local `.md` files.
- Allowed story/image/helper/feelie extensions.
- Conventional package support files.
- Export contents.
- Import/export roundtrip through existing `.terpvault.zip` rules.

Warnings should remain curator prompts unless they affect reliable play or package containment. A package can be playable while still needing provenance review.

## Relationship To Current Import/Export/Inspect

Terpwright should sit above the current package services:

- Use existing package import inspection for uploaded `.terpvault.zip` files.
- Revalidate before commit.
- Keep import and Terpwright draft install non-overwriting.
- Use current export rules for `.terpvault.zip` candidates.
- Reuse package validation messages wherever practical.
- Keep public routes and Admin2/API routes separate.

Terpwright should not create a second archive format or a second package installation policy.

## Relationship To The Oracle

Terpwright v1 should support the current simple hint path:

```yaml
resources:
  hints: hints.md
```

Package authors can add simple `hints.md` first. The future `oracle:` block remains roadmap-only. Terpwright v1 should not require structured Oracle sources, `.inv` parsing, ROT13 decoding, YAML hints, JSON hints, or Ink-guided hint flows.

Future Terpwright phases may preview richer Oracle sources after the Oracle source model is implemented, but that should be additive and should preserve simple Markdown hints.

## Relationship To Ink

Ink support remains future work. Terpwright v1 should not add Ink runtime support, Ink package support, Ink validation, or Ink helper generation.

Terpwright docs and UI should avoid implying that Ink packages are currently playable. Ink may become a future package family after its package format, runtime adapter, validation model, and Admin2 workflow are intentionally designed.

## Implementation Phases

### Phase 0: Docs And Planning

- Define Terpwright scope, non-goals, source handling, validation, and Admin2 workflow.
- Align roadmap docs with current Admin2 import/export/iFiction/Oracle behavior.
- Do not implement runtime behavior.

### Phase 1: Local-File Package Builder

- Implemented as a narrow Admin2 local builder.
- Accepts local story file and local package resources.
- Creates draft package folders only.
- Reuses package readback validation and keeps export/import rules aligned with story-file allowlists.
- Supports local `metadata.iFiction.xml` upload during creation; preview/apply still happens through the existing package editor workflow.
- Supports `resources.known_differences` as an optional first-class Markdown package document.
- Exports reviewed candidates through the existing `.terpvault.zip` flow.

### Phase 2: Metadata Assistant For Manually Supplied URLs

- Implemented as manual URL capture in the Create Package workflow.
- Accepts curator-supplied IFDB, IFWiki, IF Archive, source/package, upstream project, port/source repository, license, and reference-only URLs.
- Stores catalog fields, source role fields, retrieval date, license notes, and reference rows in `game.yaml`.
- Displays the stored URLs in Admin2 package detail/readback.
- Performs only light syntax validation for pasted URLs and archive paths.
- Does not perform remote lookup, search, scraping, metadata generation, story-file download, or asset download.

### Phase 3: Ecosystem Lookup Helpers

- Add configured provider lookup for IFDB, IFWiki, IF Archive, or other approved sources.
- Require explicit admin action.
- Show confidence, attribution, license notes, and field-level apply controls.
- Keep metadata lookup separate from story-file and asset download.

### Phase 4: Richer Helper Docs And Oracle Generation

- Add helper-doc templates or guided authoring aids.
- Preview richer Oracle sources only after the Oracle source model exists.
- Keep generated or suggested text reviewable and provenance-aware.

### Phase 5: Optional Guided Workflows

- Add recipes for known source families or package types.
- Support optional checklists for source builds, screenshots, helper docs, and final package audit.
- Keep all install/export/publish decisions explicit.

## Open Questions

- Should Terpwright stage candidate packages in a temporary build area before moving them into `games/{slug}`, or create draft packages directly after validation?
- Should partially completed wizard state be persisted, and if so where?
- Should `provenance.md` be generated from structured source entries, edited manually, or both?
- How much story-file format detection should Terpwright expose before richer interpreter support exists?
- Should Terpwright support package templates for common cases such as source-built Z-code, Inform releases, or IF Archive references?
- What review-status fields, if any, should be added to `game.yaml` to distinguish draft content, pending rights review, and package-ready candidates?
- How should large files and upload timeouts be handled in Admin2 for package building?
- Which provider definitions are safe enough for the first remote lookup phase?
