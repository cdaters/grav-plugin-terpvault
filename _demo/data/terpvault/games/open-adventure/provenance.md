# Provenance

This package seed is based on an Inform 6 / Z-machine port of ESR Open
Adventure / Colossal Cave.

ESR Open Adventure is a forward-port of the Crowther/Woods Adventure 2.5
lineage. Native source files identify BSD-2-Clause code/data licensing; final
packaging must re-check all upstream files before release.

Native oracle baseline:

```text
993291a21da44234ae9cf303d0ffc0df19ec3c31
```

Intended port source repository:

```text
https://github.com/cdaters/open-adventure-inform
```

IFID:

```text
74146740-24EA-5383-A8BF-8B239CE36DBE
```

This IFID belongs to the Open Adventure Inform 6 / Z-machine port artifact. It
is not a historical identifier for Crowther/Woods Adventure, ESR's native C
source, or another existing build. It is preserved as the port moves toward the
standalone `open-adventure-inform` repository identity.

Built story file:

```text
open-adventure.z8
```

Validated SHA-256 at seed time:

```text
a30277240f66a6fa107d9cbf84674133ee19714eebf24d3ef0d0dddb628f27be
```

Package-local iFiction metadata:

```text
metadata.iFiction.xml
```

The iFiction file repeats the port-owned IFID and describes this Inform 6 /
Z-machine port artifact and package candidate. It does not claim to identify
the original Crowther/Woods Adventure, ESR's native C source, the 350-point
version, the 550-point version, or another historical build.

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
