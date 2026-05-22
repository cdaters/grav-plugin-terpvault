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

Frontend virtual pages are added to Grav's page collection before page resolution. TerpVault does not replace `$grav['page']`; this is important in Grav 2/Admin2 because the active page service may already be frozen by the time Admin2/API requests are being handled.

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

For now, the Admin2 page is a read-only library hub scaffold with collapsible package rows, format support, and settings diagnostics. It is disabled by default with:

```yaml
admin:
  enable_admin2_page: false
```

When explicitly enabled, TerpVault registers Admin2 sidebar/page/API hooks only for Admin2/API requests. These routes live under the API plugin, such as `/api/v1/terpvault/games`, and are deliberately separate from the public virtual page routes under `/if`.

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
