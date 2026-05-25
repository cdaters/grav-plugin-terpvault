# Zork I Demo Candidate Verification

## Status

- Candidate only.
- Requires exact upstream repo verification.
- Requires license/provenance review.
- Requires build/package verification.
- Requires original package assets and helper docs.

Zork I must not be treated as ready to bundle until the source, license, build output, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Upstream source to verify

- Exact GitHub repository URL: TBD.
- Exact tag/commit/release to use: TBD.
- License file path and license text summary: TBD.
- Attribution requirements: TBD.
- Whether source includes build notes: TBD.
- Whether the source repo includes or does not include historical commercial assets: TBD.

Use placeholders above until local verification confirms the authoritative source and packaging basis. Record the repository, source revision, license file, and any build instructions before creating package contents.

## Legal/provenance checklist

- Preserve MIT license text if applicable.
- Record retrieval date.
- Record commit hash/tag.
- Avoid historical commercial packaging, manuals, maps, ads, logos, trade dress, and scans unless separately licensed.
- Use Craig-created art and helper docs.
- Treat trademarks separately from source-code license.
- Do not bundle until redistribution requirements are documented.
- Record whether the generated playable artifact is covered by the same license path as the verified source.
- Keep source, license, attribution, and package provenance notes available inside or alongside the package.

## Build/package verification checklist

- Identify required build toolchain.
- Build from source locally.
- Record build command.
- Record output story artifact.
- Record output checksum.
- Confirm artifact plays in TerpVault/Parchment.
- Confirm IFID and format.
- Decide whether to include generated story artifact, source provenance, or both.
- Confirm package export/import smoke test.
- Record any interpreter-specific behavior, warnings, or metadata gaps discovered during testing.

## TerpVault package plan

Proposed package structure:

```text
zork-i/
  game.yaml
  metadata.iFiction.xml
  story-file-name-tbd.z3
  cover.jpg
  small-cover.jpg
  hero.jpg
  screenshots/
    01.png
  how-to-play.md
  hints.md
  walkthrough.md
  feelies/
  LICENSE-upstream.txt
  provenance.md
```

Notes:

- Story file exact filename: TBD.
- `LICENSE-upstream.txt` or equivalent should be included if required by the verified license.
- Provenance notes should record source URL, retrieved date, commit/tag, build toolchain, build command, output checksum, and any package-local asset authorship notes.

## Art plan

- Craig-created cover image.
- Craig-created small-cover image.
- Craig-created hero image.
- Screenshots from the bundled playable version.
- Optional original map/feelie notes.
- Avoid copying historical Infocom packaging or trade dress.
- Avoid using commercial logos, scans, manual art, advertising layouts, or map designs unless separately licensed for redistribution.

## Helper docs plan

- Original `how-to-play.md` focused on basic parser commands and Zork expectations.
- Original spoiler-light `hints.md`.
- Original clearly spoilery `walkthrough.md`.
- Avoid copying commercial Invisiclues/manual/hint book text.
- Keep helper docs aligned with the exact bundled playable version so commands, room names, and puzzle order are accurate.

## Open questions

- Which exact repo/commit is authoritative for TerpVault packaging?
- What build toolchain is required?
- What output story format/filename should be used?
- Is the generated artifact clearly redistributable under the same license path?
- What IFID should be recorded?
- Should Zork I install as draft or published in the future demo installer?
- Should the package include upstream source license text in feelies, root package, or provenance metadata?
- Should source provenance be represented only in `game.yaml`/`provenance.md`, or should source snapshots/build logs be kept outside bundled package contents?

## Next actions

- Verify repo/license.
- Build story artifact.
- Test in TerpVault.
- Draft `game.yaml`.
- Create original art.
- Create helper docs.
- Add provenance/license notes.
- Export/import smoke test.
