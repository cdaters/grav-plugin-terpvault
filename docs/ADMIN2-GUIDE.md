# Future Admin2 Guide Tab

TerpVault should eventually include an in-product Admin2 documentation area so new administrators can understand package management without leaving Admin2.

This is roadmap/design documentation only. No runtime Admin2 Guide tab is implemented in this pass.

## UI Placement And Labels

The Guide should be a dedicated top-level tab in the TerpVault Admin2 page, alongside existing tabs such as Library, Formats, and Settings.

Preferred short tab labels:

- `Guide`
- `Help`
- `Help & Docs`

Avoid long tab labels such as `Instructions / Help / How-to`. The page heading inside the tab can be more descriptive:

- `TerpVault Admin Guide & How-To`
- `TerpVault Package Management Guide`
- `Admin Guide & Package Help`

Keep this separate from Settings and from small contextual help notes near individual fields.

## Purpose

The Guide tab should explain what TerpVault currently can and cannot do, while keeping the Library tab focused on package work instead of turning it into a wall of explanatory text.

It should cover package management, package creation, import inspection, export, metadata editing, iFiction XML preview/apply, helper Markdown editing, media management, screenshots, story-file replacement, format detection, validation warnings, and publication readiness.

It should also explain IF-specific jargon such as IFID, iFiction, Treaty of Babel, IFDB, IFWiki, IF Archive, Z-machine, Glulx, TADS, ADRIFT, Ink, feelies, helper Markdown, hints, walkthroughs, and story files.

## Proposed Sections

- Overview / What TerpVault Manages.
- Library Manager Basics.
- Package Lifecycle.
- Metadata Editing.
- Media Manager.
- Helper Markdown.
- The Oracle / Progressive Hints.
- Player Presentation.
- Content Transparency.
- Safety Boundaries.
- Troubleshooting.
- Glossary.

Package Lifecycle should cover create package, inspect import, draft-only import install, export package, and publication status.

Metadata Editing should cover core metadata, IFID list, iFiction XML preview/apply, IFDB / IFWiki / IF Archive fields, provenance, and licensing notes.

Media Manager should cover cover image, small cover, hero image, screenshots, feelies/extras, and safe upload/replace behavior.

Helper Markdown should cover `how-to-play.md`, `hints.md`, `walkthrough.md`, and safe Markdown/limited HTML behavior.

Safety Boundaries should reinforce:

- No destructive package delete yet.
- No arbitrary package file browser.
- No destructive overwrite workflow.
- Import remains draft-only and non-overwriting.
- Metadata Assistant remains local-first and preview/apply.
- Remote catalog lookup is not implemented.

Troubleshooting should cover missing story file, unsupported format, missing cover/hero/small-cover, iFiction XML validation issues, and package completeness warnings.

Glossary should cover IFID, iFiction, Treaty of Babel, feelies, parser IF, choice-based IF, Z-machine, Glulx, TADS, ADRIFT, Ink, and Parchment.

## Screenshots And Images

Do not invent screenshots. If current Admin2 screenshots already exist in the repository, document where they are and how they should be used. Future screenshots should live in a future-friendly location such as:

```text
docs/images/admin2/
```

Screenshots should be refreshed when Admin2 UI changes. README/docs images should illustrate core workflows only:

- Library Manager overview.
- Package creation.
- Metadata editing.
- Media manager.
- iFiction XML preview/apply.
- Helper Markdown editing.
- Future Guide/Help tab.

## Implementation Notes

- Render local Markdown documentation bundled with the plugin.
- Avoid remote documentation fetches.
- Keep the Guide tab read-only.
- Keep it separate from Settings.
- Consider internal anchors or a table of contents for longer help pages.
- Prefer concise cards or sections rather than one giant scroll.
- Make the Guide tab useful even when the site is offline.
- Sanitize rendered Markdown consistently with Admin2 expectations.

## Relationship To Other Docs

The Guide tab should cross-link or summarize:

- Admin2 contextual help notes/icons near individual fields.
- README and broader docs.
- The Oracle/hints roadmap.
- Player presentation roadmap.
- Content transparency/tagging roadmap.

It should not replace the full project documentation; it should make the most common administrator workflows discoverable inside Admin2.
