# TerpVault Next Build Checklist

## Critical validation after first install

- Confirm virtual pages render under `/if`.
- Confirm package assets render through `/if/_asset/{slug}/{path}`.
- Confirm story files stream through `/if/_file/{slug}`.
- Confirm `[terpvault game="sample-cave"]` replacement works after page content processing.
- Confirm Admin2 sidebar registration appears when API/Admin2 is installed.
- Confirm Admin2 page script loads and calls `/api/v1/terpvault/games`.

## Likely first fixes

- Adjust virtual page creation if Grav 2 behaves differently from Grav 1.7.
- Replace API route closure with a formal controller if Admin2/Slim response handling requires it.
- Decide whether `show_unpublished` should depend on admin authentication for preview.

## Next development target

Implement Admin2 package editor:

1. Game list with package status badges.
2. Create package action.
3. Edit `game.yaml` form.
4. Upload story file.
5. Upload/manage cover/splash/screenshots.
6. Validate package action.
7. Import `.zip` package action.
8. Export package action.

## Parchment integration target

- Choose whether to bundle a minimal Parchment build or require the site owner to install it.
- Document licenses for included interpreter pieces.
- Add runtime check for `assets/vendor/parchment/index.html`.
- Add Admin warning if Parchment is missing.


## v0.2.0 target

Build the first editable Admin2 Library Manager on top of the v0.1.10 package validation helpers:

- list game packages
- show warnings and release-readiness badges
- edit `game.yaml` metadata
- upload/replace story files and cover/small-cover art
- edit package Markdown helpers
- import/export package zip files
