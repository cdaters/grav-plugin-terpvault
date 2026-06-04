# Open Adventure Map Draft Notes

The map in this folder is a draft/mockup for the implemented Inform 6 port, not
a final poster and not a full native Adventure map.

Files:

- `open-adventure-map-draft.png`: TerpVault-import-compatible rendered draft.

The editable DOT source and SVG render remain in the Open Adventure port repo
under `docs/feelies/`, but they are not included in this package candidate
because the current TerpVault importer allowlist does not accept `.dot` or
`.svg` feelie files.

Design choices:

- Major regions are grouped into clusters.
- Ordinary exits are solid lines.
- Special transitions are dashed or colored and labeled.
- Some long or maze-like paths are compressed into named region nodes.
- The map emphasizes implemented puzzle chains and route coverage over exact
  geometric fidelity.

Special transitions shown:

- rod / fissure bridge
- PLOVER
- FEE/FIE/FOE/FOO egg return
- troll/chasm payment
- rug flight
- reservoir word / parting
- cave closing / repository transition

Known limitations:

- Full native forest graph, full maze fidelity, and exact repository relocation
  parity are not represented.
- The map should be manually redesigned before use as a player-facing package
  feelie.
