# TerpVault Package Validation

TerpVault package validation is advisory. The goal is to help a curator see whether a game package has enough metadata, artwork, provenance, and helper content to be published confidently.

## Current checks

- `missing-title`: no useful bibliographic title found.
- `missing-story-field`: `resources.story_file` is not set.
- `missing-story-file`: the configured story file is missing.
- `missing-ifid`: `identification.ifids` is empty.
- `missing-cover`: no `resources.cover` or conventional `cover.jpg` / `cover.png` exists.
- `missing-small-cover`: no `resources.small_cover` or conventional `small-cover.jpg` / `small-cover.png` exists.
- `missing-source`: no source/provenance URL is available.
- `missing-license`: no license/redistribution information is available.
- `license-review`: license text indicates the package still needs review.
- `missing-how-to-play`, `missing-hints`, `missing-walkthrough`: optional player-help files are missing.

## Severity

- `error`: prevents reliable play, such as a missing story file.
- `warning`: should be addressed before public release.
- `info`: helpful but not required.

## Future work

Validation should eventually power Admin2 editing workflows, package import checks, and release-readiness badges.
