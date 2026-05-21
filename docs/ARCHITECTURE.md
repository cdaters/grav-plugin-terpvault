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
/if/_file/{slug}
/if/_asset/{slug}/{asset-path}
/if/_manifest
```

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

The Admin2 page is component-mode because TerpVault eventually needs a highly custom UI:

- game package list
- upload/import package
- metadata editor
- media manager
- validation panel
- package preview

For v0.1.0, the Admin2 page is read-only package discovery.

## Save/restore plan

Phase 1:

- rely on interpreter commands: `SAVE` and `RESTORE`
- allow download/upload saves if the interpreter supports it

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
