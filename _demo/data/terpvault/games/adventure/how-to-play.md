# How to Play

**Adventure** is parser-based interactive fiction. The game describes your surroundings in text, and you respond by typing short commands. You are not choosing from a menu. You are having a tiny, stubborn conversation with a very old computer cave.

## The basic idea

Read each room description carefully. Important objects, exits, hazards, and clues are usually hidden in plain sight. Your job is to explore the cave, solve puzzles, collect treasures, and bring valuable items back to safety.

Most commands are simple verb-noun phrases:

- `LOOK`
- `INVENTORY`
- `TAKE LAMP`
- `LIGHT LAMP`
- `EXAMINE GRATE`
- `UNLOCK GRATE`
- `GO NORTH`
- `N`
- `DROP KEYS`
- `SAVE`
- `RESTORE`

You can usually abbreviate directions:

- `N`, `S`, `E`, `W`
- `NE`, `NW`, `SE`, `SW`
- `U` for up
- `D` for down

## First things to try

At the beginning, explore the area around the small building. Go inside, gather anything useful, and investigate the outdoor locations until you find a way into the cave.

A good opening habit:

```text
LOOK
INVENTORY
ENTER BUILDING
TAKE ALL
LOOK
```

Not every version understands every convenience command, so if `TAKE ALL` feels too modern for the cave goblin, take items one at a time.

## Mapping matters

Make a map. Seriously. The cave is the true final boss wearing limestone armor.

Draw each room as a box and label the exits. Do not assume that going north and then south will always return you to the same place. Some passages are twisty. Some are intentionally confusing. Some are rude little geometry gremlins.

## Inventory limits

You can only carry so much. This is part of the puzzle design, not a bug. Think of the game as a logistics challenge with bats in the attic.

When you find a safe central location, consider using it as a staging area. Drop objects you do not need immediately, then come back for them later.

## Light and darkness

The lamp is one of the most important objects in the game. Underground exploration depends on it, and it will not last forever. Avoid wandering aimlessly with the lamp on. Save your game before long expeditions.

Useful commands include:

```text
LIGHT LAMP
EXTINGUISH LAMP
```

## Save early, save often

This is an older game with older manners. It may allow you to make poor decisions, waste turns, lose treasures, strand yourself, or get clobbered by cave wildlife with union representation.

Use:

```text
SAVE
RESTORE
```

Save before trying strange commands, entering suspicious areas, or using important objects.

## Parser expectations

The parser is clever for its era, but it is not a modern chatbot. Try short, direct commands. When a command fails, rephrase it simply.

Try:

```text
GET BOTTLE
FILL BOTTLE
POUR WATER
THROW AXE
WAVE ROD
SAY XYZZY
```

The game may understand some magic words directly without `SAY`.

## Scoring and treasures

The classic 350-point version rewards exploration, puzzle-solving, and treasure collection. In general, if something sounds precious, weirdly ornate, or too specific to be scenery, it is probably worth investigating.

Treasures usually need to be brought back to the proper safe place to score fully. The game is not only asking, “Can you find it?” It is also asking, “Can you get it home without turning the expedition into a mineral-flavored yard sale?”

## New player advice

Do not rush to a walkthrough. *Adventure* is at its best when you are building your own mental cave system, testing verbs, and muttering at the screen like a wizard arguing with a filing cabinet.

Start with the spoiler-light hints. Use the walkthrough only when you are truly stuck or ready to see the machinery behind the stalactites.

## Historical note

*Adventure* began as Will Crowther's cave-exploration game, inspired by real caving in Kentucky and fantasy role-playing. Don Woods later expanded it into the version that became famous across early networked computing culture. This `Advent.z5` build represents the classic 350-point tradition in a portable story-file format.
