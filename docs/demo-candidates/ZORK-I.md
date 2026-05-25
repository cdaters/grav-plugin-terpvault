# Zork I Demo Candidate Verification

## Status

- Candidate only.
- Upstream repo verified on 2026-05-24.
- License/provenance reviewed from observed repository files only.
- Requires build/package verification.
- Requires original package assets and helper docs.
- Next state: build verification needed.

Zork I must not be treated as ready to bundle until the source, license, build output, TerpVault package contents, assets, helper docs, and provenance notes are verified and complete.

## Upstream source to verify

- Exact GitHub repository URL: `https://github.com/historicalsource/zork1.git`.
- Branch verified: `master`.
- Exact commit verified: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.
- Tags/releases observed: no local tags, no remote tags from `git ls-remote --tags origin`, and no GitHub releases returned by `gh release list --repo historicalsource/zork1 --limit 20`.
- License file path and license text summary: `LICENSE`; appears to be MIT License text.
- Attribution/copyright line observed in license: `Copyright (c) 2025 Microsoft`.
- Whether source includes build notes: `README.md` includes source/build context, states the files are ZIL, notes historical ZILCH/TOPS20 usage, and notes user-maintained ZILF can compile the `.ZIL` files with minor issues. It does not provide an exact build command in the repository.
- Whether the source repo includes or does not include historical commercial assets: no commercial packaging, manuals, maps, ads, logos, trade dress, or scans were observed in the repository file listing. Observed files are ZIL/source-related files, repository docs/license, and prebuilt Z-machine artifacts.

Do not treat this as final packaging approval. Record the repository, source revision, license file, build toolchain, build command, artifact checksum, and package-specific provenance before creating package contents.

## Verification notes

Verification date: 2026-05-24.

- Scratch checkout location: `/tmp/terpvault-zork1-verification`.
- Repository URL: `https://github.com/historicalsource/zork1.git`.
- Branch: `master`.
- Commit: `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.
- Latest commit observed: `2025-11-21 01:27:37 +0900`, `Update README.md`.
- Tags/releases: none observed via local `git tag --list`, remote `git ls-remote --tags origin`, or `gh release list --repo historicalsource/zork1 --limit 20`.
- Official announcement context checked separately: Microsoft Open Source Blog announced on 2025-11-20 that Microsoft OSPO, Team Xbox, and Activision made Zork I, II, and III available under MIT License, focused on code, and did not include commercial packaging/marketing materials or trademark/brand rights.

License/provenance findings:

- License path: `LICENSE`.
- License status: observed file appears to be MIT License text.
- Attribution/copyright line: `Copyright (c) 2025 Microsoft`.
- Repository README says this is a source code directory for Infocom's Zork I, including files used and discarded in production, and says the contributed source represents a snapshot of the Infocom development system at shutdown.
- No separate commercial packaging, manuals, maps, ads, logos, trade dress, scans, or marketing assets were observed in the checkout.
- No legal conclusion is made here beyond observed repository contents.

Source/build notes summary:

- Source language/format: ZIL (Zork Implementation Language), with `.zil` source files and related source/build-side files including `parser.cmp`, `zork1.chart`, `zork1.errors`, `zork1.record`, `zork1.serial`, and `zork1freq.xzap`.
- README build context: Infocom historically used TOPS20 and ZILCH; the README says there is currently no known way to compile with an official Infocom compiler, and says user-maintained ZILF has been shown to compile these `.ZIL` files with minor issues.
- Repository build path: no exact command, script, Makefile, or documented ZILF/ZAPF invocation was observed.
- Local tooling check: `zilf`, `Zilf`, `ZILF`, `zapf`, `Zapf`, `ZAPF`, `zilch`, `frotz`, and `dotnet` were not found in `PATH`.
- Build attempt: not performed because required tooling was unavailable locally and no tooling was installed.

Available files/artifacts summary:

- Source files observed: `zork1.zil`, `1actions.zil`, `1dungeon.zil`, `gclock.zil`, `gglobals.zil`, `gmacros.zil`, `gmain.zil`, `gparser.zil`, `gsyntax.zil`, and `gverbs.zil`.
- Prebuilt story artifacts observed: `COMPILED/zork1.z3` and `zork1.zip`.
- `file` identifies both artifacts as `Infocom (Z-machine 3, Release 119, Serial 880429)`.
- `COMPILED/zork1.z3` and `zork1.zip` have identical SHA-256: `37084966477dff679282de42974b2077156b1bd68fad92a65d4ea94d8eb64d79`.
- Treat the prebuilt artifacts cautiously. The README states `.ZIP` files in some Infocom source repositories were present at final spin-down and the means to create them is currently lost; this pass did not establish that either prebuilt artifact is package-ready for TerpVault.

## Build tooling verification

Verification date: 2026-05-24.

This pass checked local tooling and the likely ZILF/ZAPF upstream path only. No tool installation was performed, no source/tool repository was cloned into TerpVault, and no Zork I build artifacts were created or copied into this repository.

Exact local tooling command used:

```sh
for c in dotnet zilf zapf Zilf Zapf ZILF ZAPF mono frotz dfrotz zoom gargoyle parchment; do
  if command -v "$c" >/dev/null 2>&1; then
    printf '%s: %s\n' "$c" "$(command -v "$c")"
  else
    printf '%s: not found\n' "$c"
  fi
done
```

## Tooling discovered

Local tools in `PATH`:

- `dotnet`: not found.
- `zilf`: not found.
- `zapf`: not found.
- `Zilf`: not found.
- `Zapf`: not found.
- `ZILF`: not found.
- `ZAPF`: not found.
- `mono`: not found.
- `frotz`: not found.
- `dfrotz`: not found.
- `zoom`: not found.
- `gargoyle`: not found.
- `parchment`: not found.

Likely ZILF/ZAPF upstream:

- Main project/repository: `https://foss.heptapod.net/zilf/zilf`.
- GitHub mirror observed: `https://github.com/taradinoc/zilf`.
- Project summary: ZILF is a ZIL compiler/tool suite; ZAPF is the included Z-machine assembler used after ZILF compilation.
- License observed from the GitHub mirror: GPL-3.0 for the project, with README notes also referring to separate ZILF library/runtime license terms for relevant surrounding code.
- Current release observed from the GitHub mirror/IFWiki search results: ZILF 1.8, dated 2026-04-08.
- Build requirement observed from the upstream README: .NET 10 SDK.
- Upstream build command observed: `dotnet build Zilf.sln`.
- Upstream test command observed: `dotnet test Zilf.sln`.
- Typical installed usage observed: `zilf mygame.zil`, which should produce a story file such as `mygame.z3`; ZAPF is part of the installed/compiler toolchain path.

## Build attempt

Build from source was not attempted in this pass.

Reason:

- `dotnet` is not installed or not available in `PATH`.
- ZILF/ZAPF executables are not installed or not available in `PATH`.
- No system packages were installed because this pass was documentation/tooling verification only and package installation requires explicit approval.

Scratch paths reserved for a later practical build pass:

- ZILF/ZAPF tooling checkout/build: `/tmp/terpvault-zilf-verification`.
- Zork I source/build checkout: `/tmp/terpvault-zork1-build`.

Planned build verification commands for a later pass, after prerequisites are installed in a scratch or user-local tooling path:

```sh
git clone https://github.com/historicalsource/zork1.git /tmp/terpvault-zork1-build
cd /tmp/terpvault-zork1-build
git checkout 97b7b3d68c075dd9af7da499c3e9690ada3471fd
zilf zork1.zil
```

The exact ZILF/ZAPF invocation may need adjustment after inspecting installed ZILF 1.8 behavior and any Zork I-specific warnings/errors.

## Artifact result

- Generated artifact filename: none.
- Generated artifact SHA-256: none.
- Comparison with upstream `COMPILED/zork1.z3`: not performed.
- Interpreter smoke test: not performed.
- TerpVault/Parchment playback testing: pending.

## Remaining blockers

- Install or otherwise provide a verified .NET 10 SDK outside the TerpVault repo.
- Install or build ZILF/ZAPF outside the TerpVault repo, preferably in a scratch or user-local tooling path.
- Re-run the Zork I source build at commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd`.
- Record the exact build command, output filename, generated artifact SHA-256, and whether it matches or differs from upstream `COMPILED/zork1.z3`.
- Install or provide a Z-machine interpreter such as Frotz, or verify browser playback through TerpVault/Parchment, before claiming runtime smoke-test coverage.
- Keep Zork I candidate-only until build output, redistribution basis, TerpVault playback, package metadata, provenance notes, and package export/import behavior are verified.

## Recommended next action

Install/verify the .NET 10 SDK and ZILF/ZAPF outside the TerpVault repo, using a scratch or user-local tooling path. Then re-run a build verification pass from a fresh scratch checkout of `https://github.com/historicalsource/zork1.git` at commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd`, record the artifact checksum and comparison against `COMPILED/zork1.z3`, and only then decide whether a TerpVault demo package path is appropriate.

Packaging recommendation:

- Keep Zork I as candidate-only.
- Do not create `_demo` package contents yet.
- Do not bundle `zork1.zip` or `COMPILED/zork1.z3` until the redistribution basis for generated/prebuilt story artifacts is documented, the build path is verified or an explicit packaging decision is made, and TerpVault playback/import/export smoke tests are complete.
- If packaging proceeds later, include upstream MIT license text and package-local provenance notes, and use only Craig-created art/helper docs unless other assets have separately verified redistribution rights.

Remaining blockers:

- Install or otherwise provide verified ZILF/ZAPF-compatible tooling outside the repo.
- Build from source in a scratch location and record exact command, output artifact name, and checksum.
- Decide whether the generated artifact, prebuilt artifact, source provenance, or some combination is appropriate for the package.
- Verify IFID/format and TerpVault/Parchment playback behavior.
- Create original package assets and helper docs only after packaging basis is resolved.
- Run package export/import smoke tests once a package exists.

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
