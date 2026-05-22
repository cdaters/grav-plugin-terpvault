# TerpVault Routing and Base URLs

TerpVault must not assume it is installed at the domain root. All generated URLs must respect both Grav's base URL and TerpVault's configured library route.

Examples:

- Root install: `/if/adventure`
- Subdirectory install: `/quark2/if/adventure`

## Rule

Do not hardcode `/if` in templates, JavaScript, or PHP output. Use the package URL helpers or the public route value exposed to Twig.

## Quick check

Run this from the plugin root before packaging:

```bash
grep -R 'href="/if\|src="/if\|/if/_\|url("/if' -n templates assets admin-next terpvault.php classes
```

Ideally this returns no hardcoded frontend URLs.
