# Inform Release Compatibility Notes

TerpVault borrows vocabulary from Inform's releasing model where it makes sense for a Grav-hosted library.

## Cover art

Inform's documentation treats cover art as the display image used by interpreters, IFDB, browsing tools, and generated websites. It recommends JPEG or PNG, square album-like art, ideally 960×960, and no smaller than 120 pixels in either dimension.

TerpVault package fields:

```yaml
cover: cover.jpg
small_cover: small-cover.jpg
```

Supported fallback filenames:

```text
cover.jpg
cover.png
Cover.jpg
Cover.png
small-cover.jpg
small-cover.png
Small Cover.jpg
Small Cover.png
```

The old TerpVault `thumbnail` field still works, but `small_cover` is preferred going forward.

## Website/template analogy

Inform's release templates use placeholders such as title, author, year, blurb, cover, download link, story file, and IFID. TerpVault maps the same idea to `game.yaml` plus Twig templates:

```yaml
title: Adventure
author: Will Crowther and Don Woods
year: 1977
description: |
  Markdown-friendly blurb.
story_file: advent.z5
cover: cover.jpg
small_cover: small-cover.jpg
```

## Walkthroughs and help files

Inform can release a solution/walkthrough. TerpVault treats walkthroughs, hints, and how-to-play pages as package-side Markdown files:

```yaml
how_to_play: how-to-play.md
hints: hints.md
walkthrough: walkthrough.md
```

The public detail template renders them as collapsed/expandable help sections.
