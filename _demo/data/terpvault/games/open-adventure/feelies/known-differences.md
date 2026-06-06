# Known Differences

This draft package describes a faithful-as-practical Inform 6 port. It is not a
byte-for-byte clone of ESR Open Adventure's native C engine.

- Dwarf and pirate behavior are deterministic bounded slices rather than full
  native random scheduling.
- Cave closing and the repository endgame are represented, but exact native
  timing, relocation, and mirror/dwarf edge cases remain bounded.
- Save/restore score deductions are not implemented.
- Full native hints, novice deductions, turn-threshold deductions, and some
  late scoring edge cases are not implemented.
- Full forest and maze fidelity remains incomplete.
- Some parser wording, prompt text, status-line display, inventory formatting,
  and line wrapping may differ by interpreter.
- The included walkthrough is a deterministic port route, not a perfect-score
  native transcript.

The repository version of this document has the full developer detail:
`docs/KNOWN-DIFFERENCES.md`.
