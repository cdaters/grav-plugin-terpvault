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
- `invalid-known-differences`: `resources.known_differences` is set but does not reference a safe package-local `.md` file.
- `missing-known-differences`: `resources.known_differences` is set but the referenced file is not present.

## Severity

- `error`: prevents reliable play or indicates an unsafe package-local resource reference. Missing story-file data prevents play; unsafe optional resource paths such as an invalid `resources.known_differences` reference should also be treated as errors because package containment is a safety boundary.
- `warning`: advisory package completeness or provenance note.
- `info`: reserved for future low-priority hints.

Missing IFIDs, source links, license names, redistribution notes, cover art, and helper files should remain advisory. They are important for curation and rights review, but they should not block public listing or make a playable game look broken. Optional `resources.known_differences` is only checked when present; missing the field is not a warning.

## Public display

The detail page can show advisory checks in a calm Package Notes section. Catalog & Provenance rows are rendered only when a value exists, so empty metadata fields do not create blank rows.

## Admin2 use

Validation powers Admin2 package inventory/editing context and package import checks today. Admin2 should keep errors, warnings, and informational package policy notes visually distinct: missing story-file data blocks reliable play, while missing provenance, catalog, artwork, or helper-doc fields are curator review prompts.

Import inspection is validation-only. A clean inspection does not write files; commit revalidates the uploaded zip, installs as draft, clears featured state, and refuses to overwrite existing package folders. Future work can add richer release-readiness badges without turning advisory metadata gaps into fatal public errors.
