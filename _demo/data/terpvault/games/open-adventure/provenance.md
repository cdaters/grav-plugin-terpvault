# Provenance

## TerpVault demo/library candidate promotion - 2026-06-04

Craig approved promoting this validated package candidate into the TerpVault
repository `_demo` tree as a draft, non-featured demo/library candidate:

```text
_demo/data/terpvault/games/open-adventure
```

This is not a final release package. The current map/poster feelie is a
draft/mockup and may be replaced later. Keep the package at
`terpvault.status: draft` and `terpvault.featured: false` until a later explicit
release-readiness review.

This package seed is based on an Inform 6 / Z-machine port of ESR Open
Adventure / Colossal Cave.

ESR Open Adventure is a forward-port of the Crowther/Woods Adventure 2.5
lineage. Native source files identify BSD-2-Clause code/data licensing; final
packaging must re-check all upstream files before release.

Native oracle baseline:

```text
993291a21da44234ae9cf303d0ffc0df19ec3c31
```

IFID:

```text
74146740-24EA-5383-A8BF-8B239CE36DBE
```

This IFID belongs to the Open Adventure Inform 6 / Z-machine TerpVault port. It
is not a historical identifier for Crowther/Woods Adventure, ESR's native C
source, or another existing build. The policy for this candidate is a stable
UUIDv5-style identifier generated from the port-specific name:

```text
urn:open-adventure-port:inform6-zmachine:terpvault:993291a21da44234ae9cf303d0ffc0df19ec3c31
```

Built story file:

```text
open-adventure.z8
```

Validated SHA-256 at seed time:

```text
284f3d08ab9cc692457d1a982acf7dddffcaf8bf0b4aa71cb5d1f33d82865d43
```

Package-local iFiction metadata:

```text
metadata.iFiction.xml
```

The iFiction file repeats the port-owned IFID and describes this Inform 6 /
Z-machine TerpVault package candidate. It does not claim to identify the
original Crowther/Woods Adventure, ESR's native C source, the 350-point version,
the 550-point version, or another historical build.

Package-candidate archive hashes are recorded in the source repo packaging
notes and build log after each rebuild. The zip hash is not embedded in this
package provenance file because including an archive hash inside the archive
would make the value self-referential and unstable.

Package artwork and screenshots were copied from the local RetroRealm
demo-candidate folder into this package candidate. Final artwork rights, crops,
and screenshot selection still need manual review before release.

The package candidate uses TerpVault's structured `game.yaml` import shape:
`identification.ifids`, `bibliographic.*`, and `resources.*`. Extra package
notes, known differences, and the draft map are included as `resources.feelies`
so the current TerpVault importer can validate them without changing importer
rules.

Final packaging must re-check upstream license/provenance text, story-file
hash, artwork rights, image crops, and TerpVault import behavior before release.
