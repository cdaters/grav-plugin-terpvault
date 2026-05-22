# Parchment Bundling Notes

TerpVault's first real interpreter adapter is Parchment, the browser-based interactive fiction player.

## Bundled build

This package includes the single-file Parchment web build **2025.1.14** here:

```text
assets/vendor/parchment/index.html
```

The uploaded release artifact contained one file named `parchment.html`; TerpVault renames it to `index.html` so the plugin can load a stable local URL.

## How TerpVault calls Parchment

TerpVault serves the bundled Parchment build through `/if/_engine/parchment`, loads that route in an iframe, and passes the story as a JSON `story=` query parameter. Example shape:

```json
{
  "url": "https://example.com/if/_story/adventure/advent.z5",
  "format": "zcode",
  "title": "Adventure"
}
```

The JSON object is intentional. TerpVault's controlled story-file route now preserves the visible filename extension, but the explicit `format` value remains useful for broad interpreter support and future adapters.

## External/alternate Parchment

A site owner can still override the bundled interpreter with a hosted Parchment URL:

```yaml
player:
  parchment_url: 'https://example.com/parchment/index.html'
```

TerpVault will pass the same JSON `story=` parameter to that URL.

## Save and restore behavior

TerpVault does not add custom save slots around Parchment yet. Players should use the story/interpreter's native `SAVE` and `RESTORE` flow inside the iframe. See `docs/PARCHMENT-SAVES.md` for the current expectations and future save-manager direction.

## Licensing checklist when updating

Parchment itself is MIT licensed, but its web build may incorporate upstream interpreters and assets with their own licenses. Before distributing a TerpVault package that includes Parchment, confirm and preserve notices for the exact release you bundle.

Known upstream components listed by Parchment include:

- AsyncGlk — MIT
- Bocfel — MIT/GPL family depending on upstream/build listing
- Emglken — MIT
- Git — MIT
- Glulxe — MIT
- Hugo — BSD-2-Clause
- Iosevka — OFL
- jQuery — MIT
- RemGlk-rs — MIT
- Scare — GPL-2.0
- TADS — GPL-2.0

Keep upstream `LICENSE`, `NOTICE`, or equivalent files if they are present in the release artifact. The current single-file HTML includes an embedded bundled-license comment; leave that intact.
