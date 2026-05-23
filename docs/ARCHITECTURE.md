# TerpVault Architecture Notes

## Core idea

TerpVault treats each interactive-fiction title as a package, not merely as a loose story file.

A package can contain:

- the story file (`.z3`, `.z5`, `.z8`, `.zblorb`, `.ulx`, `.gblorb`)
- `game.yaml` metadata
- cover art
- splash art
- screenshots
- how-to-play notes
- hints
- walkthroughs
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

## Player adapter model

The plugin owns the Grav/user experience. The interpreter is an adapter.

Current intended adapter:

```text
Parchment
```

Future adapters could include:

- WebAssembly Frotz/Bocfel wrapper
- custom Z-machine JS interpreter
- Glulx-only adapter
- remote hosted player adapter

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
- iFiction XML
- Treaty of Babel metadata import/export
- IFDB/source URL fields
- license/provenance checks
