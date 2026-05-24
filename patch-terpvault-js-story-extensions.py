#!/usr/bin/env python3
from pathlib import Path

path = Path("admin-next/pages/terpvault.js")

if not path.exists():
    raise SystemExit(f"Could not find {path}. Run this from the grav-plugin-terpvault repo root.")

text = path.read_text(encoding="utf-8")

replacements = {
    # File input accept lists: package creation + story replacement
    'accept=".z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.t3"':
    'accept=".z3,.z4,.z5,.z6,.z7,.z8,.zblorb,.zlb,.ulx,.gblorb,.glb,.gam,.t3,.taf"',

    # Visible helper text: package creation
    'Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, t3.':
    'Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, gam, t3, taf.',

    # Visible helper text: story replacement
    'Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, t3. Archives, scripts, HTML, SVG, and arbitrary files are not accepted.':
    'Allowed: z3, z4, z5, z6, z7, z8, zblorb, zlb, ulx, gblorb, glb, gam, t3, taf. Archives, scripts, HTML, SVG, and arbitrary files are not accepted.',

    # Create Package format dropdown: add ADRIFT
    "[['', 'Infer later'], ['zcode', 'Z-code'], ['glulx', 'Glulx'], ['tads3', 'TADS 3'], ['tads2', 'TADS 2']]":
    "[['', 'Infer later'], ['zcode', 'Z-code'], ['glulx', 'Glulx'], ['tads3', 'TADS 3'], ['tads2', 'TADS 2'], ['adrift', 'ADRIFT']]",
}

changed = False
for old, new in replacements.items():
    count = text.count(old)
    if count:
        text = text.replace(old, new)
        changed = True
        print(f"Patched {count} occurrence(s): {old[:80]}...")
    else:
        print(f"Already patched or not found: {old[:80]}...")

if not changed:
    print("No changes made. File may already be patched.")

path.write_text(text, encoding="utf-8")
print(f"Done: {path}")
