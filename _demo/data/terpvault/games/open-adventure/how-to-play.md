# How To Play

Open Adventure is a parser game: you type commands and the cave answers back.
Most useful commands are short.

```text
look
inventory
take lamp
lamp on
north
open grate
score
```

Compass directions (`north`, `south`, `east`, `west`, `up`, `down`) move you
through the cave. Many interpreters also accept abbreviations such as `n`, `s`,
`e`, `w`, `u`, and `d`.

## First Steps

Start by exploring the road, forest, valley, and building. The building holds
several important supplies. The keys open the grate, and the lamp is essential
underground.

Use `inventory` to see what you are carrying. Use `score` or `points` to check
progress. Treasures earn their full value only when left safely in the building.

## Command Style

Try direct verb/object commands:

```text
take keys
drop bird
wave rod
throw axe at dwarf
listen
```

If a command fails, try simpler wording. The game is intentionally old-school:
many puzzles are about object use, route mapping, and noticing odd room
connections.

## About This Port

This package seed describes an Inform 6 / Z-machine port of ESR Open Adventure.
All 20 native treasures are represented, and major late-game systems are
playable.

Some native random behavior is implemented deterministically so the browser
version can be tested reliably. See `known-differences.md` for details.
