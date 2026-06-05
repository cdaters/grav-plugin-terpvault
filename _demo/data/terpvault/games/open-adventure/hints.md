# Hints

These hints are written for the current Open Adventure Inform 6 port. They are
inspired by classic Colossal Cave hint topics, but adapted to this 430-point
Open Adventure lineage and the port's deterministic systems.

## General Advice

### Gentle

Map the cave. Some exits are one-way, and some rooms do not behave like a
normal grid.

### Stronger

Carry only what you need for the current puzzle. Deposit treasures in the
building when you can.

### Answer

Use `score` or `points` to check progress. Treasure credit is split between
finding an item and leaving it safely in the building.

## Finding And Entering The Cave

### Gentle

The cave entrance is not inside the building.

### Stronger

Explore from the road through the valley and streambed.

### Answer

Take the keys and lamp from the building, go to the grate, unlock it, open it,
and go down.

## Bird And Snake

### Gentle

The bird is useful, but nervous.

### Stronger

The cage lets you carry the bird. The rod scares it if the bird is still caged.

### Answer

Take the cage, capture the bird, and drop the bird in the Hall of the Mountain
King to chase away the snake.

## Rod, Fissure, And Jade

### Gentle

The rod reacts to more than one place.

### Stronger

Try it near the fissure, and try it near the steps with the bird in the right
state.

### Answer

`wave rod` at the fissure creates the bridge. At the represented steps, drop the
uncaged bird and wave the rod to create the jade necklace.

## Dragon And Reservoir Word

### Gentle

The bird eventually has something important to say.

### Stronger

You need to understand the bird first, and that depends on the dragon route.

### Answer

Resolve the dragon, drink the dragon blood, return the bird to a represented
forest room, and `listen`. The bird discloses the current reservoir word.

## Reservoir, Rabbit Foot, And Ebony

### Gentle

The reservoir is not crossed by swimming.

### Stronger

Use the word learned from the bird. Carry a lucky object before the cliff route.

### Answer

Use `F'UNJ` at the reservoir in this deterministic port build. Carry the rabbit
foot through the north-reservoir cliff route to reach the ebony statuette.

## PLOVER And Emerald

### Gentle

Some magic words work only in specific places.

### Stronger

The Plover region has strict carry constraints.

### Answer

Use `PLOVER` between Y2 and the Plover Room. The emerald is beyond the Plover
Room in the Dark Room.

## Plant, Oil, Door, Trident, And Pearl

### Gentle

The plant is thirsty more than once.

### Stronger

Water changes the plant. Oil changes the rusty door.

### Answer

Water the plant enough to climb it. Fill the bottle with oil in the east pit,
oil the rusty door, take the trident, and use the trident to open the clam. The
pearl rolls away and must be recovered from its destination.

## Eggs, Troll, Bear, And Chain

### Gentle

Some treasures are useful before they are deposited.

### Stronger

The troll wants payment. The bear wants food and then freedom.

### Answer

Throw a treasure, often the eggs, to the troll. Later use FEE/FIE/FOE/FOO to
recover the eggs. Feed the bear, unlock the chain, take the chain, and lead the
bear through the bridge outcome.

## Batteries And Vending Machine

### Gentle

Coins have a second use.

### Stronger

Spending the coins solves a lamp problem but sacrifices their deposit value.

### Answer

Drop the coins at the vending machine to create fresh batteries. This removes
the coins from play for building-deposit scoring.

## Pirate And Chest

### Gentle

If treasure vanishes, it is not necessarily gone forever.

### Stronger

The pirate's stash is in the all-alike maze region.

### Answer

In this port, carrying an eligible treasure into the represented west Hall of
Mists approach triggers deterministic pirate theft. Recover the stolen treasure
and chest from the pirate dead end.

## Dwarf, Axe, Ogre, And Ruby

### Gentle

The first dwarf encounter gives you something useful.

### Stronger

The axe matters for dwarf combat and the ogre route.

### Answer

Take the axe after the represented first dwarf encounter. Use `throw axe at
dwarf` for the dwarf slice. The ogre/ruby route is a deterministic bounded
implementation of the native-shaped dwarf/ogre dependency.

## Cave Closing And Endgame

### Gentle

When the cave starts closing, ordinary exits are no longer reliable.

### Stronger

The repository is a special endgame space. The rusty-mark rod matters.

### Answer

For deterministic smoke tests, the port has scaffold-only `testclose` helpers.
In the repository victory route, move the rusty-mark rod away from the southwest
side, return southwest, and `blast`.
