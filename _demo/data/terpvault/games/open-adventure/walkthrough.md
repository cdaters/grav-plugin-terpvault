# Walkthrough

This walkthrough is a package-facing overview of the current port route. It is
not a perfect-score native transcript. For exact tested commands, use the repo
transcripts under `inform6/transcripts/commands/`.

## Opening

Take the keys, lamp, food, bottle, and water from the building. Explore the
represented forest path for the rabbit foot. Go to the grate, unlock it, open
it, enter the cave, and turn on the lamp.

## Early Cave

Take the cage, capture the bird, and take the rod. Use the bird and rod at the
represented steps to create the jade necklace. Then carry the bird to the Hall
of the Mountain King and drop it to drive away the snake.

Use the rod at the fissure to create the bridge. Explore the side chambers for
early treasures, and deposit treasures in the building when practical.

## Midgame Treasure Routes

Use PLOVER to reach the emerald route. Water the plant, gather oil, open the
rusty door, take the trident, open the clam, and recover the pearl. Resolve the
dragon to free the rug and gain access to dragon blood.

The Giant Room, troll, bear, chain, vending machine, pirate chest, and
dwarf/axe/ogre routes are represented as deterministic puzzle chains in this
port. Use the repo walkthrough for detailed route notes.

## Reservoir And Cliff Route

After resolving the dragon, drink the blood. Return the bird to a represented
forest room and listen for the reservoir word. In this deterministic build the
word is `F'UNJ`.

Use the word at the reservoir, cross to the north side, and carry the rabbit
foot through the cliff route to reach the ebony statuette.

## Endgame

Deposit treasures in the building and monitor score. The cave-closing system is
implemented as a native-shaped deterministic slice. Repository/endgame smoke
routes may use `testclose` helpers; those helpers are not normal player
vocabulary.

In the repository victory route, move the rusty-mark rod away from the southwest
end, return southwest, and `blast`.

## Related References

- Full repo walkthrough: `WALKTHROUGH.md`
- Polished command route:
  `inform6/transcripts/commands/polished-walkthrough.txt`
- Known differences: `docs/KNOWN-DIFFERENCES.md`
