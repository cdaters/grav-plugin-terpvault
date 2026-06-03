# Open Adventure / Colossal Cave Candidate Basis

Status: **Research candidate / source/oracle only**

Open Adventure is tracked as the next candidate arc. It is not packaged in `_demo` yet.

## Upstream/source basis

- Repository: https://gitlab.com/esr/open-adventure
- Branch: `master`
- Captured commit: `993291a21da44234ae9cf303d0ffc0df19ec3c31`
- Local preparation evidence path: `~/Code/if-lab/open-adventure`

## Build and test evidence

- Native build commands executed:
  - `make advent cheat`
- Artifact outcome:
  - native `advent` binary
  - native `cheat` binary
  - `adventure.yaml` source data (plus generated C source files)
- Test command:
  - `cd tests && make`
- Test result observed during this pass:
  - `115 tests, 2 failures`
  - failures are `saveresume.1` and `saveresume.3` from savefile prompt/interaction timing and diff drift under this environment

This remains suitable as a golden-master/oracle, but not as a clean “zero-fail” packaged baseline without addressing the savegame prompt conditions in this environment.

## Continuation/tooling check

Current local verification state:

- The documented lab checkout exists at `~/Code/if-lab/open-adventure`.
- The lab checkout is on branch `master` at commit `993291a21da44234ae9cf303d0ffc0df19ec3c31`.
- The lab checkout currently has an untracked `.venv/`; do not treat that checkout as pristine without reviewing or ignoring local tooling state.
- Basic build prerequisites observed on `PATH`: `make`, `gcc`, `python3`, `pkg-config`, `cppcheck`, and `asciidoctor`.
- `pkg-config` resolves `libedit` for the native build (`-ledit`) and reports the local editline include path.
- Full `make check` support is incomplete on the current `PATH`: `pylint`, `spellcheck`, and `tapview` were not found.

Safe repeatable verification steps before any package work:

1. Confirm the lab checkout branch and commit:
   - `git -C ~/Code/if-lab/open-adventure rev-parse --abbrev-ref HEAD`
   - `git -C ~/Code/if-lab/open-adventure rev-parse HEAD`
   - `git -C ~/Code/if-lab/open-adventure status --short`
2. Confirm prerequisite tools without building:
   - `command -v make gcc python3 pkg-config cppcheck pylint spellcheck tapview asciidoctor`
   - `pkg-config --libs libedit`
   - `pkg-config --cflags libedit`
3. If a fresh build/test rerun is needed, do it only in the lab checkout or another scratch path outside the TerpVault repo.
4. Do not copy `advent`, `cheat`, generated `dungeon.c`/`dungeon.h`, save files, logs, transcripts, story artifacts, images, or package skeletons into this repository during candidate verification.

## License/provenance notes

Open Adventure includes:

- `README.adoc` SPDX metadata indicating CC-BY-4.0 for project text metadata context.
- `COPYING` file with a BSD 2-Clause License for source code distribution.
- explicit authorship/history context from Eric S. Raymond and notes that the project is a forward-port of Crowther/Woods 2.5.

Implications for TerpVault:

- A practical redistribution review is still required before a playable TerpVault package is created.
- Code, text, and any potential artwork/maps/docs should each be checked against actual license terms for scope and reuse.

## Playable-format status

Current Open Adventure capture is **native C/terminal** based.

Observed local artifacts and outputs:

- `advent`/`cheat` binaries
- `adventure.yaml` (and generated `dungeon.c` / `dungeon.h`)
- No Z-machine/Glulx `.z8`/`.ulx`/`.gblorb` artifact in this repo snapshot

Current TerpVault/Parchment compatibility:

- TerpVault/Parchment cannot play this native build directly.
- A playable TerpVault path requires conversion or porting to a supported story format.

## Recommended next path

Primary options to evaluate:

1. **Source-to-Inform / Z-machine route (primary)**
   - Generate a compatible `.z8`/`.z5`-style playable artifact from the source lineage with clean rights and provenance.
2. **Glulx route**
   - Use a native-to-Glulx strategy if source constraints make Inform/Z-machine conversion impractical.
3. **Native/web runtime adapter (future only)**
   - Implement a dedicated web/native adapter for this exact binary stack.
4. **Source/provenance demo first**
   - Keep as a researched basis without playable packaging until a format is confirmed.

## Current repo docs status

- `docs/DEMO-CANDIDATES.md` entry should be linked to this file.
- `docs/DEMO-LIBRARY.md`, `docs/STARTER-LIBRARY.md`, and `docs/RELEASE-READINESS.md` still treat Open Adventure as candidate-only.
- `docs/NEXT-BUILD.md` should retain Open Adventure as a next-target verification item.

## Current decision

No TerpVault package for Open Adventure is being created in this pass.

Next actions before any package work:

- confirm final license/provenance posture for redistributable playable artifacts,
- select exact playable format,
- validate route/playback in TerpVault,
- then assemble helper docs/assets and package conventions.
