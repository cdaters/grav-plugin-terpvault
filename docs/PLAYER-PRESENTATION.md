# Player Presentation Roadmap

TerpVault's stable current play surface is the focused route:

```text
/if/{slug}/play
```

The detail page `/if/{slug}` should continue to show a safe Play button or CTA that links to the focused play route. Future inline player modes should be additive and should not remove the focused route.

## Reference Inspiration

The Frayedwire "Dungeon / Zork Revisited" page at:

```text
https://frayedwire.net/featured_item/dungeon-zork-revisited/
```

is a visual and UX reference only. Do not copy, scrape, vendor, or depend on that site's CSS, JavaScript, assets, HTML, or implementation. If the URL is unavailable, do not block TerpVault work. The relevant described inspiration is embedded Parchment-style presentation, retro terminal/CIT101-like styling, and a ready-to-play prompt experience.

## Placement Versus Boot Behavior

TerpVault should separate where the player appears from how the story boots.

Future placement modes:

- `focused`: default/safe mode; the detail page links to `/if/{slug}/play`.
- `inline`: embed the Parchment player directly on the detail page, but do not necessarily load the story immediately.
- `inline_autostart`: embed the Parchment player directly on the detail page and load the game immediately when the detail page opens.

Future boot behavior:

- `autoload`: load the story file as soon as the player view is opened, so the interpreter is ready at the prompt.
- `manual`: show an explicit Play/Start button before loading the story file.

When a user clicks Play from `/if/{slug}` and lands on `/if/{slug}/play`, the focused player page should ideally use `boot: autoload`: the game should already be loaded in Parchment with a prompt ready for input. Avoid a redundant second Play click inside the focused play page unless there is a technical or accessibility reason to require it.

## Future Defaults

Roadmap-only global/default concept:

```yaml
player:
  engine: parchment
  placement: focused
  boot: autoload
  theme: retro-terminal
  inline:
    height: 720
    allow_fullscreen: true
```

Direct inline presentation override:

```yaml
player:
  placement: inline_autostart
  boot: autoload
  theme: cit101
  inline:
    height: 700
    allow_fullscreen: true
```

Inline but manually started override:

```yaml
player:
  placement: inline
  boot: manual
  theme: amber-crt
  inline:
    height: 700
    allow_fullscreen: true
```

Avoid using older ambiguous names such as `launch_mode` and `autostart` in new roadmap examples except when documenting backward compatibility or migration.

## Theme Presets

Candidate player theme presets:

- `default`
- `retro-terminal`
- `cit101`
- `green-screen`
- `amber-crt`
- `light-paper`
- `parchment-classic`

Theme controls should eventually be available through Admin2 at the global plugin level, per package, or both. Package-level values should win over global defaults when both exist.

Terminal themes should be CSS-based presets scoped to the TerpVault/Parchment shell. They should not be hardcoded into Parchment itself.

Possible future organization:

```text
assets/css/player-themes/default.css
assets/css/player-themes/cit101.css
assets/css/player-themes/green-screen.css
assets/css/player-themes/amber-crt.css
```

## Admin2 Controls

Future Admin2 controls can expose:

- Player placement mode.
- Player boot behavior.
- Player theme.
- Inline player height.
- Fullscreen allowed.
- Optional show title/status chrome setting.

These controls are roadmap only. v0.4.x does not implement runtime placement/boot/theme controls beyond the current player-shell styling and existing Parchment configuration.

## Accessibility Guardrails

- Ensure sufficient contrast.
- Avoid unreadably tiny bitmap fonts on mobile.
- Allow fallback fonts.
- Make terminal themes optional.
- Do not force blinking, scanline, or CRT effects unless disabled by default or respectful of reduced-motion preferences.
- Keep fullscreen and iframe chrome readable across common Grav light/dark themes.

## Relationship To Other UX Work

- Oracle = hint/help UX.
- Player placement, boot behavior, and themes = gameplay presentation UX.
- Content tags/notes = catalog transparency and discovery UX.

All three belong under broader frontend experience polish, but they should be designed and implemented separately.
