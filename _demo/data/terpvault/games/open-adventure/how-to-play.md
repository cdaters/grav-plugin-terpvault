# How To Play

Open Adventure is a parser game: you type commands, and the cave answers back.
Short commands usually work best.

```text
look
inventory
take lamp
lamp on
north
open grate
score
help
info
news
version
```

Compass directions such as `north`, `south`, `east`, `west`, `up`, and `down`
move you through the cave. Many interpreters also accept `n`, `s`, `e`, `w`,
`u`, and `d`.

## First Steps

Explore the road, forest, valley, and building. The building holds several
important supplies. The keys open the grate, and the lamp is essential
underground.

Use `inventory` to see what you are carrying. Use `score` or `points` to check
progress. Treasures earn their full value when left safely in the building.

At the opening question, type `yes` or `no` to choose whether you want the
introductory instructions.

## Command Style

Try direct verb/object commands:

```text
take keys
drop bird
wave rod
throw axe at dwarf
pour water on plant
listen
```

If a command fails, try simpler wording. Adventure is an old-school puzzle
game: map carefully, notice odd room connections, and experiment with objects.

## About This Port

This draft package describes an Inform 6 / Z-machine port of ESR Open
Adventure, from the Adventure 2.5 / 430-point lineage. All 20 native treasures
are represented, and the main cave, treasure, and endgame routes are playable.

Some native random behavior is deterministic here so the port can be tested
reliably in Z-machine and browser interpreters. See `known-differences.md` for
details.
