# TerpVault Routing and Base URLs

TerpVault must not assume it is installed at the domain root. All generated URLs must respect both Grav's base URL and TerpVault's configured library route.

Examples:

- Root install: `/if/adventure`
- Subdirectory install: `/quark2/if/adventure`
- Subdirectory install: `/grav2-fullsite-skeleton/if/adventure`

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
- Admin2/API routes: `/api/v1/terpvault/games`, `/api/v1/terpvault/games/{slug}`, `/api/v1/terpvault/status`.

Frontend routes are added to Grav's page collection and must not override `$grav['page']`. Admin2/API routes are registered only when `admin.enable_admin2_page` is enabled and the current request is actually an Admin2/API request.
