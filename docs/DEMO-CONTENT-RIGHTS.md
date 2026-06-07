# TerpVault Demo Content Rights and Provenance

This document defines the review posture for TerpVault demo packages. It is a curator-facing policy, not legal advice or a legal guarantee.

## Purpose

TerpVault demo packages may include selected supplemental materials for historical preservation, documentation, research, commentary, and educational context. Inclusion in a demo package is not a claim that the material is newly licensed, public domain, official, endorsed, or copyright-free unless that status is separately documented.

The goal is to keep every bundled package auditable: each story file, source release, package-local asset, helper document, screenshot, metadata file, and supplemental material should have a clear provenance note or an explicit pending-review status.

## Demo content categories

Package records should distinguish these categories:

- Story/source license and provenance.
- Package-local original materials.
- Historical reference/preservation materials.
- Third-party materials requiring caution.
- Uncertain provenance or pending review materials.

These categories can coexist in one package. A source/story-file license does not automatically apply to maps, manuals, scans, clue sheets, artwork, packaging, catalog prose, trademarks, or other supplemental materials.

## Story/source license and provenance

Story files and source-built artifacts need package-level provenance that records the selected source, source revision or release, license file, retrieval date, build toolchain when applicable, build command when applicable, output filename, and checksum.

If a package uses a source-built story file from a permissively licensed source release, the package should preserve the upstream license text when required or useful. The package should not imply that separate historical commercial assets are covered by the same license unless that is documented for those assets.

## Package-local original materials

Package-local art, screenshots, helper docs, walkthroughs, maps, and feelies created for TerpVault should be identified as TerpVault/Craig-created or otherwise original package material.

Original package material should avoid copying restricted packaging, manuals, logos, trade dress, advertising layouts, clue-book text, or distinctive commercial source material. Screenshots should be produced from the bundled playable version and documented as such.

## Historical reference/preservation materials

Some packages may include selected historically circulating reference or preservation materials, such as maps, hint/reference sheets, scans, PDFs, or interactive-fiction context material.

These materials are included, when used, under a preservation/documentation posture for historical preservation, documentation, research, commentary, and educational context. That posture is subject to item-level review. It is not a blanket fair-use claim and does not mean the material is automatically safe, licensed, public domain, official, endorsed, or copyright-free.

Historical reference/preservation materials should be identified separately from story/source-license material and package-local original material. Package provenance should record the item name, package path, source or basis when known, review status, and any restriction or removal decision.

## Materials requiring caution

Use special caution with third-party or historically commercial materials, including:

- Commercial packaging, box art, manuals, maps, advertisements, logos, and trade dress.
- Scans or reproductions of commercial materials.
- InvisiClues, hint books, clue sheets, and commercial walkthrough/helper material.
- Online walkthrough prose, catalog prose, or fan-guide prose.
- Trademarks, publisher branding, and historically recognizable layouts.
- Files with unknown source, uncertain license, or unclear redistribution status.

When provenance is uncertain, mark the item as pending review and do not describe it as licensed, public domain, official, approved, safe, or copyright-free.

## Rights-Holder Removal Requests / DMCA

If you are a rights holder and believe specific material should not be included, please contact [dmca@retrorealm.org](mailto:dmca@retrorealm.org) with the item name, the location of the material, and the basis for the request. Disputed material will be reviewed promptly and removed or restricted where appropriate.

A rights-holder removal process is not a substitute for provenance review. Demo packages should still record why each item is present and what rights/provenance basis is known.

## Package-level provenance requirements

Each bundled demo package should keep package-local provenance notes, usually in `provenance.md`, that record:

- Story/source license and provenance.
- Story artifact checksum and build or selection notes.
- Canonical upstream, port/source repository, catalog, archive, and reference-only URLs when they are part of the review trail.
- Upstream license text location when included.
- Package-local original art/assets and helper docs.
- Historical reference/preservation materials, if any.
- Third-party materials requiring caution, if any.
- Uncertain provenance / pending review materials, if any.
- Exclusions and known non-inclusions.
- Rights-Holder Removal Requests / DMCA contact language.

Package manifests should avoid broad claims that all package material is covered by the story/source license. If different items have different provenance, record that difference.

Pasted URLs in `game.yaml` are review pointers, not rights conclusions. A source repository, IFDB page, IFWiki page, IF Archive path, license URL, art source, map reference, or walkthrough reference should not be treated as permission to redistribute story files or supplemental materials unless the item-level rights basis is separately documented.

Terpwright Phase 3 helpers should preserve this distinction. The current IF Archive preview normalizes paths and URLs, and the IFDB preview can show catalog metadata candidates through IFDB's official API. Future lookup results may help curators find titles, authors, IFIDs, archive paths, source links, license hints, and external catalog references. Preview or lookup results should not be treated as rights clearance, copied wholesale into package docs, or used to auto-download story files, artwork, or historical materials.

## What not to claim

Do not claim that demo package materials are licensed, public domain, copyright-free, official, endorsed, approved by a rights holder, or automatically fair use unless that status is specifically documented for the item.

Do not use a rights-holder removal policy as a reason to skip provenance review.

Do not imply that a source-code license automatically covers trademarks, packaging, manuals, maps, scans, art, clue sheets, commercial helper material, or catalog prose.

## Checklist for adding future demo content

- Identify the content category before adding the file.
- Record the item path, source or creator, retrieval or creation date, and review status.
- Preserve source/story license text and attribution when required.
- Separate story/source provenance from package-local original materials.
- Separate historical reference/preservation materials from original package materials.
- Mark uncertain items as pending review instead of overclaiming.
- Confirm helper docs and walkthroughs are original writing or have documented reuse rights.
- Confirm screenshots are from the bundled playable version.
- Add or update the package-level Rights-Holder Removal Requests / DMCA section.
- Re-run package inventory, route, checksum, and export/import checks when package contents change.
