# Known Differences

This package seed describes a faithful-as-practical port, not a byte-for-byte
native engine clone.

- Dwarves and pirate behavior are deterministic bounded slices rather than full
  native random scheduling.
- Save/restore deductions are not implemented.
- Full native hints are not implemented.
- Some cave-closing timing and repository relocation behavior is bounded to
  represented rooms and objects.
- Full maze fidelity and exact random event parity remain deferred.
- Some interpreter text, prompt, status-line, and line-wrapping behavior may
  differ from native Open Adventure.
- The included walkthrough is a deterministic port route, not a perfect-score
  native transcript.

See the repository `docs/KNOWN-DIFFERENCES.md` for the full developer version.
