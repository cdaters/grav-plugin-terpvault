# Walkthrough

Spoilers follow. This is a concise route overview for the current Inform 6
port, not a perfect-score native transcript.

For exact tested commands, see the source repo transcripts under
`inform6/transcripts/commands/`.

## Opening

Take the keys, lamp, food, bottle, and water from the building. Explore the
represented forest path for the rabbit foot. Go to the grate, unlock it, open
it, enter the cave, and turn on the lamp.

## Early Cave

Take the cage, capture the bird, and take the rod. Use the bird and rod at the
represented steps to create the jade necklace. Carry the bird to the Hall of
the Mountain King and drop it to drive away the snake.

Use the rod at the fissure to create the bridge. Explore side chambers and
deposit treasures in the building when practical.

## Midgame Treasure Routes

Use PLOVER to reach the emerald route. Water the plant, gather oil, open the
rusty door, take the trident, open the clam, and recover the pearl. Resolve the
dragon to free the rug and gain access to dragon blood.

The Giant Room, troll, bear, chain, vending machine, pirate chest, and
dwarf/axe/ogre routes are represented as deterministic puzzle chains in this
port.

## Reservoir And Cliff Route

After resolving the dragon, drink the blood. Return the bird to a represented
forest room and listen for the reservoir word. In this deterministic build the
word is:

```text
F'UNJ
```

Use the word at the reservoir, cross to the north side, and carry the rabbit
foot through the cliff route to reach the ebony statuette.

## Endgame

Deposit treasures in the building and monitor score. The cave-closing system is
implemented as a deterministic slice of native behavior. Some repository and
endgame smoke routes use `testclose` helpers; those helpers are not normal
player commands.

In the repository victory route, move the rusty-mark rod away from the
southwest end, return southwest, and `blast`.

## More Detail

- Full repo walkthrough: `WALKTHROUGH.md`
- Polished command route:
  `inform6/transcripts/commands/polished-walkthrough.txt`
- Known differences: `docs/KNOWN-DIFFERENCES.md`
