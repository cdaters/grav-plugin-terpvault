# TerpVault Routing and Base URLs

TerpVault must not assume it is installed at the domain root. All generated URLs must respect both Grav's base URL and TerpVault's configured library route.

Examples:

- Root install: `/if/adventure`
- Subdirectory install: `/quark2/if/adventure`
- Subdirectory install: `/grav2-fullsite-skeleton/if/adventure`

All of these map to the configured TerpVault route `/if/adventure` internally.

## Rule

Do not hardcode `/if` in templates, JavaScript, or PHP output. Use the package URL helpers or the public route value exposed to Twig.

## Quick check

Run this from the plugin root before packaging:

```bash
grep -R 'href="/if\|src="/if\|/if/_\|url("/if' -n templates assets admin-next terpvault.php classes
```

Ideally this returns no hardcoded frontend URLs.

## Admin2/API boundary

Public TerpVault routes and Admin2 integration routes are different systems:

- Frontend virtual routes: `/if`, `/if/{slug}`, `/if/{slug}/play`, `/if/_story/{slug}/{filename}`, `/if/_asset/{slug}/{path}`.
- Admin2/API routes: disabled for now; future endpoints must use a controller-style integration, not Closure handlers.

Frontend routes are added to Grav's page collection during `onPagesInitialized` and must not override `$grav['page']`. Admin2/API requests are guarded out of frontend virtual routing.
