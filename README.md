# TerpVault Plugin

**TerpVault** is a Grav plugin for curating, presenting, and playing classic interactive fiction story files. Think of it as a shelf of digital IF boxes: story file, metadata, cover art, splash art, screenshots, hints, walkthroughs, and a web-player shell.

This first release is a **v0.1.0 foundation build**. It is intentionally repo-ready and readable, not a finished public 1.0.

## What it does now

- Reads game package folders from `user/data/terpvault/games`.
- Uses a per-game `game.yaml` metadata file.
- Supports cover art, splash art, screenshots, how-to-play notes, hints, and walkthrough files.
- Provides virtual frontend routes under `/if` by default:
  - `/if` library page
  - `/if/{slug}` game detail page
  - `/if/{slug}/play` focused play page
  - `/if/_file/{slug}` controlled story-file endpoint
  - `/if/_asset/{slug}/{path}` controlled package-asset endpoint
- Provides a native shortcode-style embed:
  - `[terpvault game="sample-cave"]`
- Provides an Admin2 sidebar page scaffold with read-only package discovery.
- Uses an engine-adapter pattern. Parchment is the first intended adapter, but the plugin does not lock itself to one interpreter forever.

## What it does not do yet

- It does not bundle Parchment yet.
- It does not include a real playable Z-machine story file.
- It does not yet provide Admin2 upload/edit/import forms.
- It does not yet provide named save slots or server-side save syncing.
- It does not yet validate iFiction/Babel metadata.

## Installation for local development

From your Grav install:

```bash
cd user/plugins
git clone git@github.com:cdaters/grav-plugin-terpvault.git terpvault
```

Or unzip this package as:

```text
user/plugins/terpvault
```

Then clear cache:

```bash
bin/grav clear-cache
```

## Configuration

Default config lives in:

```text
user/plugins/terpvault/terpvault.yaml
```

Override it in:

```text
user/config/plugins/terpvault.yaml
```

Useful settings:

```yaml
enabled: true
route: /if
auto_routes: true

player:
  engine: parchment
  parchment_url: ''
  theme: retro-terminal
```

## Game package format

Each game lives in its own folder:

```text
user/data/terpvault/games/
  adventure/
    game.yaml
    game.z5
    cover.webp
    splash.webp
    screenshots/
      01.webp
    how-to-play.md
    hints.md
    walkthrough.md
```

Minimum `game.yaml`:

```yaml
title: Adventure
slug: adventure
tagline: The cave where parser fiction learned to breathe.
status: published
format: zcode
story_file: game.z5
```

Fuller example:

```yaml
title: Sample Cave
slug: sample-cave
tagline: A tiny lantern-lit test package for TerpVault.
status: published
format: zcode
story_file: game.z5

author: RetroRealm Lab
year: 2026
license: Original metadata; bring your own legal story file.

cover: cover.webp
splash: splash.webp
screenshots:
  - screenshots/01.webp

description: |
  A short description shown on the game detail page.

how_to_play: how-to-play.md
hints: hints.md
walkthrough: walkthrough.md

player:
  engine: parchment
  theme: retro-terminal
  autosave: true
```

## Parchment adapter

TerpVault expects a browser-based interpreter for actual playback. The intended first adapter is Parchment.

You can use either:

1. A local Parchment build at:

```text
user/plugins/terpvault/assets/vendor/parchment/index.html
```

2. A hosted Parchment URL configured in `user/config/plugins/terpvault.yaml`:

```yaml
player:
  parchment_url: 'https://example.com/parchment/index.html'
```

TerpVault passes the controlled story-file URL as a `story=` query parameter.

Until Parchment is installed, the included placeholder page explains what is missing.

## Demo content

The `_demo/` folder includes a fake `sample-cave` package and an example page. Grav can optionally install demo content from `_demo` during package installation. If installing manually, copy the contents of `_demo/data` into `user/data` and `_demo/pages` into `user/pages`.

The demo story file is not playable. It is a text placeholder so the package structure is visible.

## Shortcode-style embed

Use this in any Grav page:

```markdown
[terpvault game="sample-cave"]
```

This plugin implements that simple pattern directly and does not require Shortcode Core for the first pass.

## Admin2 status

This package registers a TerpVault sidebar page in Admin2 when the API/Admin2 stack is available. The v0.1.0 page is intentionally read-only and lists detected packages.

Next Admin2 steps:

- Add package creation wizard.
- Add upload/import package action.
- Add `game.yaml` editor using a blueprint form.
- Add cover/screenshot asset manager.
- Add package validation report.

## Copyright note

Do not ship or publicly host copyrighted commercial story files unless you have the right to distribute them. TerpVault should ship with no copyrighted Infocom files. Use public-domain, freeware, permissively licensed, or original IF works.

## Development roadmap

### v0.2.0

- Admin2 create/edit/import UI.
- ZIP package import/export.
- Package validation report.
- Local Parchment install notes and helper checks.

### v0.3.0

- Browser-local save-slot UI.
- Download/upload Quetzal save files where supported by the interpreter.
- Recently played list.

### v0.4.0

- iFiction/Treaty of Babel metadata import/export.
- IFDB/source/license fields.
- Search, tags, filters, featured games.

### v1.0.0 target

- Stable library/detail/play flow.
- Admin2 package management.
- Documented interpreter adapter system.
- Save/restore UX.
- Production-safe package validation.

## License

MIT for TerpVault plugin code. Third-party interpreters such as Parchment may include their own licenses and attribution requirements.
