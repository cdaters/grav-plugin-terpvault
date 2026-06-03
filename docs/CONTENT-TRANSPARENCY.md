# Content Transparency and Discovery

TerpVault should help players discover works they want and avoid works they do not want without hiding, blocking, endorsing, or morally ranking works by default.

This is content transparency, not censorship, endorsement, moral judgment, or gatekeeping. If a work contains meaningful sensitive, mature, ideological, religious, romantic, sexual, political, identity-related, or otherwise notable material, TerpVault should provide a neutral place to disclose it. Avoid gaslighting by omission: players should not have to launch a work to discover material that a reasonable catalog could have described beforehand.

## Field Model

Separate ordinary discovery tags from content notes and theme notes:

- `tags`: format, genre, tone, play style, or discoverability labels.
- `content_notes`: potentially sensitive or mature material.
- `theme_notes`: major themes, not warnings by default.
- `audience`: optional descriptive audience guidance.

Example:

```yaml
tags:
  - parser
  - fantasy
  - puzzle-focused
  - beginner-friendly

content_notes:
  - mild violence
  - death

theme_notes:
  - exploration
  - underground
  - treasure hunting

audience:
  rating: teen
  note: "Contains fantasy peril and old-school parser death."
```

Mature or identity-themed example:

```yaml
tags:
  - choice-based
  - coming-of-age
  - narrative-focused

content_notes:
  - sexual references
  - family conflict

theme_notes:
  - LGBTQ themes
  - identity themes
  - grief

audience:
  rating: mature
  note: "Contains mature coming-of-age themes and identity-related material."
```

Existing package manifests with simple tags or no tags remain valid. `terpvault.tags` may continue as a compatibility location, but new package conventions should prefer top-level `tags` for catalog discovery and the richer fields above for transparency.

## Taxonomy Buckets

Format and play style:

- `parser`
- `choice-based`
- `hypertext`
- `Twine`
- `Ink`
- `TADS`
- `Z-machine`
- `Glulx`
- `puzzle-focused`
- `narrative-focused`
- `beginner-friendly`
- `difficult puzzles`
- `timed sequences`
- `combat`
- `multiple endings`

Genre and tone:

- `fantasy`
- `sci-fi`
- `horror`
- `comedy`
- `mystery`
- `romance`
- `historical`
- `surreal`
- `slice-of-life`

Content notes:

- `sexual content`
- `sexual references`
- `implied sexual violence`
- `violence`
- `death`
- `suicide/self-harm`
- `addiction`
- `abuse`
- `disturbing imagery`
- `adult humor`
- `strong language`

Theme notes:

- `coming-of-age`
- `family conflict`
- `grief`
- `religion`
- `political/social themes`
- `war`
- `identity themes`
- `LGBTQ themes`

Audience ratings:

- `all-ages`
- `teen`
- `mature`
- `explicit`

These lists are starting vocabularies, not hard moral categories. Curators should use neutral, descriptive language and avoid loaded labels such as "problematic", "approved", "unsafe", or "forbidden".

## Grav Compatibility

TerpVault should eventually map appropriate package metadata into Grav-compatible taxonomy/search structures where practical. Grav already supports taxonomy-style grouping through configured taxonomy types and page metadata, so TerpVault should align with that model instead of inventing an opaque private-only tagging system.

TerpVault package metadata may still keep richer fields such as `content_notes`, `theme_notes`, and `audience`. The frontend/search layer should be designed so these can be indexed, searched, and filtered consistently.

## Admin2 And Frontend Roadmap

Future Admin2 controls should expose friendly editors for:

- Discovery tags.
- Content notes.
- Theme notes.
- Audience rating and note.

Future frontend library views should support searching and filtering by these fields. TerpVault should not hide works by default based on content notes. Any filtering should be player/admin choice and clearly described.

Package-level metadata should remain plain YAML and easy to export/import.

## Relationship To Other UX Work

- Oracle = hint/help UX.
- Player placement, boot behavior, and themes = gameplay presentation UX.
- Content tags/notes = catalog transparency and discovery UX.
- Ink remains future/complementary and should be tagged as a format/play-style when package support eventually exists.
