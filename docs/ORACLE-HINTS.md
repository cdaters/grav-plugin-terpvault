# The Oracle and Progressive Hints

The Oracle is TerpVault's future spoiler-safe hint/help experience. It should evolve the current frontend Help & Reference hints area without replacing the game detail page structure or breaking simple packages.

Current packages can keep using:

```yaml
resources:
  hints: hints.md
```

That path remains the legacy/simple hint source. Existing `hints.md` files should continue to render as package-local Markdown, including the current limited safe HTML support for `<details>` and `<summary>` disclosure blocks.

## Public UX Direction

- Public-facing label: `The Oracle`.
- Possible subtitle: `Are you lost and need a hand?`
- The Oracle should live inside or near the existing Help & Reference section.
- First implementation should be additive and backwards compatible.
- A plain `hints.md` package should still work without an `oracle` manifest block.
- UI should avoid the name `Invisiclues`; use `The Oracle`, `Progressive Hints`, or plain `Hints` where needed.

## Normalized Hint Model

Static and guided hint sources should normalize into one internal model:

```text
Section -> Question -> Hint steps
```

The frontend can then render progressive reveal cards, grouped by section and question, without caring whether the source was simple Markdown, structured YAML/JSON, a legacy `.inv` file, or a future guided flow.

## Future Manifest Shape

Roadmap-only example:

```yaml
oracle:
  title: "The Oracle"
  subtitle: "Are you lost and need a hand?"
  mode: progressive
  sources:
    - path: hints.md
      format: markdown
    - path: hints.inv
      format: inv
    - path: hints.rot13.txt
      format: markdown
      encoding: rot13
    - path: hints.yaml
      format: yaml
    - path: hints.json
      format: json
    - path: hints.ink.json
      format: ink-guided
```

The `oracle` block should not replace `resources.hints`. It is a richer future configuration layer. If both exist, `resources.hints` should remain a valid simple source and can be treated as the default Markdown source unless a future migration explicitly says otherwise.

## Adapter Roadmap

Candidate source adapters:

- `MarkdownHintAdapter`: package-local Markdown, including existing `hints.md`.
- `StructuredYamlHintAdapter`: structured progressive hints in YAML.
- `StructuredJsonHintAdapter`: structured progressive hints in JSON.
- `Rot13HintAdapter`: ROT13-encoded Markdown or text hints.
- `InvHintAdapter`: legacy/classic IF `.inv` hint compatibility.
- `InkGuidedHintAdapter`: future only, for interactive guided help flows.

`.inv` support should be a package-local compatibility adapter inspired by old Invisiclues-style files. TerpVault should parse or import `.inv` content into the same normalized hint model; it should not depend on Zed Lopez's Ruby converter or any other external converter at runtime.

## Ink Relationship

Ink is complementary, not a replacement for static hints or parser IF support.

- Progressive static hints are best for puzzle nudges and spoiler ladders.
- Ink-guided hints are future interactive "where are you stuck?" flows, onboarding, or guided help.
- Ink should not replace Z-code, Glulx, TADS, Parchment, Quixe, parser IF support, or simple package-local `hints.md`.
- Do not add `inkjs`, an Ink runtime, or Ink package support until that work is explicitly scoped.

## Admin2 Roadmap

Admin2 currently supports helper Markdown editing for `how-to-play.md`, `hints.md`, and `walkthrough.md`. Future Admin2 work can add Oracle controls after the normalized model is designed:

- Preserve simple `resources.hints: hints.md` editing.
- Preview parsed progressive hint groups before saving or publishing.
- Let curators choose or add package-local Oracle sources.
- Keep all Oracle sources package-local unless a later provider model is explicitly designed.
- Keep spoiler boundaries visible to curators.
- Avoid destructive migration of existing Markdown hints.

## Implementation Guardrails

- Docs first; no runtime implementation is implied by this note.
- Keep import/export aware of conventional helper files including `hints.md`.
- Keep public rendering spoiler-safe and keyboard-accessible.
- Sanitize any rendered Markdown or limited HTML consistently with existing TerpVault behavior.
- Treat future richer formats as additive package conventions, not as a required package format change.
