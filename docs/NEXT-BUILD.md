# TerpVault Next Build Checklist

## Critical validation after first install

- Confirm virtual pages render under `/if`.
- Confirm virtual pages render under subdirectory installs such as `/grav2-fullsite-skeleton/if`.
- Confirm package assets render through `/if/_asset/{slug}/{path}`.
- Confirm story files stream through `/if/_story/{slug}/{filename}`.
- Confirm `[terpvault game="sample-cave"]` replacement works after page content processing.
- Confirm Admin2 sidebar registration does not appear while `admin.enable_admin2_page` is false.
- Confirm Admin2 sidebar registration appears when API/Admin2 is installed and `admin.enable_admin2_page` is true.
- Rebuild Admin2 API endpoints with a controller-style integration before adding mutating package workflows.
- Confirm Admin2 dashboard/API requests do not trigger TerpVault frontend virtual-page registration.

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

The import/export target should follow the package convention in `docs/PACKAGE-CONVENTIONS.md`: a future `.terpvault.zip` archive should contain `game.yaml`, one playable story file referenced by `resources.story_file`, package-local relative paths, and no platform-generated cruft.

## Parchment integration target

- Choose whether to bundle a minimal Parchment build or require the site owner to install it.
- Document licenses for included interpreter pieces.
- Add runtime check for `assets/vendor/parchment/index.html`.
- Add Admin warning if Parchment is missing.


## v0.2.x target

Build editable Admin2 Library Manager workflows on top of the v0.2.0 read-only package inventory:

- edit `game.yaml` metadata
- upload/replace story files and cover/small-cover art
- edit package Markdown helpers
- import/export `.terpvault.zip` package files
