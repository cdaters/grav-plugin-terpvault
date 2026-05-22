# TerpVault Package Validation

TerpVault package validation is curator-facing. The goal is to show whether a game package has enough metadata, artwork, provenance, and helper content to be published confidently without treating missing catalog data as a fatal public error.

## Current checks

- `missing-title`: no useful bibliographic title found.
- `missing-story-field`: `resources.story_file` is not set.
- `missing-story-file`: the configured story file is missing.
- `missing-ifid`: `identification.ifids` is empty.
- `missing-cover`: no `resources.cover` or conventional `cover.jpg` / `cover.png` exists.
- `missing-small-cover`: no `resources.small_cover` or conventional `small-cover.jpg` / `small-cover.png` exists.
- `missing-source`: no source/provenance URL is available.
- `missing-license`: no license name is available.
- `missing-redistribution-notes`: no redistribution or rights-context notes are available.
- `license-review`: license text indicates the package still needs review.
- `missing-how-to-play`, `missing-hints`, `missing-walkthrough`: optional player-help files are missing.

## Severity

- `error`: prevents reliable play. At present, only missing story-file data should be treated this way.
- `warning`: advisory package completeness or provenance note.
- `info`: reserved for future low-priority hints.

Missing IFIDs, source links, license names, redistribution notes, cover art, and helper files should remain advisory. They are important for curation and rights review, but they should not block public listing or make a playable game look broken.

## Public display

The detail page can show advisory checks in a calm Package Notes section. Catalog & Provenance rows are rendered only when a value exists, so empty metadata fields do not create blank rows.

## Future work

Validation should eventually power Admin2 editing workflows, package import checks, and release-readiness badges.
