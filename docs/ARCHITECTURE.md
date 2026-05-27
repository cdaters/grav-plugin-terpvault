# TerpVault Architecture Notes

## Core idea

TerpVault treats each interactive-fiction title as a package, not merely as a loose story file.

A package can contain:

- the story file (`.z3`, `.z5`, `.z8`, `.zblorb`, `.ulx`, `.gblorb`)
- `game.yaml` metadata
- cover art
- small-cover catalog art
- proposed hero art
- screenshots
- how-to-play notes
- hints
- walkthroughs
- proposed feelies/extras
- license/provenance notes

## Storage model

Default storage:

```text
user/data/terpvault/games/{slug}/
```

The plugin serves story files and package assets through controlled routes rather than relying on direct web access to `user/data`.

## Frontend flow

Default route base:

```text
/if
```

Virtual pages:

```text
/if                 library
/if/{slug}          detail page
/if/{slug}/play     focused player page
```

Controlled endpoints:

```text
/if/_story/{slug}/{filename}
/if/_file/{slug}              legacy compatibility endpoint
/if/_asset/{slug}/{asset-path}
/if/_manifest
```

Frontend virtual pages are added to Grav's page collection during `onPagesInitialized`, with an early priority, before Grav resolves the active page. TerpVault does not replace `$grav['page']`; this is important in Grav 2/Admin2 because the active page service may already be frozen by the time later events run.

## v0.4.0 presentation model

TerpVault keeps package artwork roles separate:

- `cover`: package/display/title/box art and the primary detail-page identity image.
- `small_cover`: compact catalog image for cards and dense browsing.
- `hero`: optional wide visual background or header image for public detail/play presentation.

Hero rendering is optional and conservative. Detail/play pages support focal positioning, overlay tone, gradient direction, and overlay color so curators can keep text legible without editing the source image. The player surface remains stable and readable when a hero image is present.

Feelies/extras are manifest-declared supplemental files, not arbitrary directory browsing. Public rendering exposes them as package-local links through controlled TerpVault asset routes.

## Player adapter model

The plugin owns the Grav/user experience. The interpreter is an adapter.

Current intended adapter:

```text
Parchment
```

Parchment is bundled as a required runtime dependency under `assets/vendor/parchment/` and served through `/if/_engine/parchment`. Those vendor assets must remain tracked in repository and release packages for local/self-contained playback.

Future adapters could include:

- WebAssembly Frotz/Bocfel wrapper
- custom Z-machine JS interpreter
- Glulx-only adapter
- Ink/inkjs choice-based narrative adapter
- remote hosted player adapter

The current adapter family is parser IF. Ink support should be treated as a complementary future web-playable narrative adapter, not as a replacement for Z-code, Glulx, TADS, Parchment, Quixe, or parser IF.

## Public theme integration future

TerpVault should continue owning the Grav-facing shell around the interpreter iframe. A future theme-polish pass should:

- use theme-aware CSS variables for library/detail/play pages and player chrome where practical
- avoid hard dependency on a single Grav theme's dark-mode class
- fall back to `prefers-color-scheme` when site theme signals are unavailable
- pass light/dark/system/default theme hints to Parchment only when supported by Parchment's documented options
- verify Quark2 light/dark, Typhoon light/dark, browser/system dark mode, and fullscreen readability

The bundled Parchment `index.html` should not be edited for normal theme polish. Prefer TerpVault-controlled wrapping, configuration, and supported Parchment URL/config parameters.

## Ink roadmap architecture

Ink support should land in phases:

1. TerpVault package support for Ink manifests, preferably using compiled Ink JSON as the playable artifact and optional `.ink` source for review.
2. Grav shortcode/block support for embedding package-backed or explicit-source Ink stories in pages.
3. Interactive Grav pages powered by Ink for onboarding, guided tutorials, narrative documentation, and RetroRealm/TerpVault page experiences.

The package/runtime boundary should stay clear: TerpVault owns package metadata, routing, permissions, assets, and Grav integration; the Ink runtime should be an adapter such as `inkjs` or a TerpVault-hosted web player added in a later implementation pass.

## Admin2 model

The Admin2 page is component-mode because TerpVault needs a package-management UI that does not fit a standard settings form:

- game package list
- create/import/export package
- metadata editor
- media manager
- validation panel
- package preview

The Admin2 Library Manager is still experimental and disabled by default with:

```yaml
admin:
  enable_admin2_page: false
```

When explicitly enabled, TerpVault registers the Admin2 sidebar/page and controller-style Admin2/API package routes for Admin2/API requests. Current workflows cover package creation, metadata/helper/media/story edits, export, import inspection, and draft-only import commit. Package delete and overwrite/replace are not implemented.

Admin2/API routes are deliberately separate from the public virtual page routes under `/if`, and write operations require authenticated Admin2/API access.

## Save/restore plan

Phase 1:

- rely on interpreter commands: `SAVE` and `RESTORE`
- let Parchment handle save files or browser storage inside the iframe
- document save behavior instead of adding TerpVault-owned slots prematurely

Phase 2:

- browser-local named slots via IndexedDB/localStorage
- per-game recently played state

Phase 3:

- optional Grav-user server-side saves
- cloud-ish sync only for authenticated users

## Metadata future

TerpVault's `game.yaml` should remain friendly and Grav-like. Later, add optional support for:

- IFID
- preview-based iFiction XML metadata enrichment
- preview-based Treaty of Babel metadata import/export
- preview-based IFDB, IFWiki, and IF Archive lookup
- license/provenance checks

Metadata enrichment should be non-destructive. The first pass should parse local `metadata.iFiction.xml`, show proposed `game.yaml` changes, and let a curator decide what to apply. Remote catalog enrichment should come later and should not replace rights/provenance review.
