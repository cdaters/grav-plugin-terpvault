# Hints

These hints are written for the current Open Adventure Inform 6 port. They are
inspired by classic Colossal Cave hint topics, but adapted to this 430-point
Open Adventure lineage and the port's deterministic systems.

Open only as much as you need. Each topic moves from a gentle nudge to a
stronger hint, then a direct answer.

## Before Looking Anything Up

- Map the cave. Some exits are one-way, and some rooms do not behave like a normal grid.
- Carry only what you need for the current puzzle.
- Deposit treasures in the building when you can.
- Use `score` or `points` to check progress.

## Progressive Hints

<details>
<summary>Finding and entering the cave</summary>

**Gentle:** The cave entrance is not inside the building.

**Stronger:** Explore from the road through the valley and streambed.

**Answer:** Take the keys and lamp from the building, go to the grate, unlock it, open it, and go down.

</details>

<details>
<summary>Bird and snake</summary>

**Gentle:** The bird is useful, but nervous.

**Stronger:** The cage lets you carry the bird. The rod scares it if the bird is still caged.

**Answer:** Take the cage, capture the bird, and drop the bird in the Hall of the Mountain King to chase away the snake.

</details>

<details>
<summary>Rod, fissure, and jade</summary>

**Gentle:** The rod reacts to more than one place.

**Stronger:** Try it near the fissure, and try it near the steps with the bird in the right state.

**Answer:** `wave rod` at the fissure creates the bridge. At the represented steps, drop the uncaged bird and wave the rod to create the jade necklace.

</details>

<details>
<summary>Dragon and reservoir word</summary>

**Gentle:** The bird eventually has something important to say.

**Stronger:** You need to understand the bird first, and that depends on the dragon route.

**Answer:** Resolve the dragon, drink the dragon blood, return the bird to a represented forest room, and `listen`. The bird discloses the current reservoir word.

</details>

<details>
<summary>Reservoir, rabbit foot, and ebony</summary>

**Gentle:** The reservoir is not crossed by swimming.

**Stronger:** Use the word learned from the bird. Carry a lucky object before the cliff route.

**Answer:** Use `F'UNJ` at the reservoir in this deterministic port build. Carry the rabbit foot through the north-reservoir cliff route to reach the ebony statuette.

</details>

<details>
<summary>PLOVER and emerald</summary>

**Gentle:** Some magic words work only in specific places.

**Stronger:** The Plover region has strict carry constraints.

**Answer:** Use `PLOVER` between Y2 and the Plover Room. The emerald is beyond the Plover Room in the Dark Room.

</details>

<details>
<summary>Plant, oil, door, trident, and pearl</summary>

**Gentle:** The plant is thirsty more than once.

**Stronger:** Water changes the plant. Oil changes the rusty door.

**Answer:** Water the plant enough to climb it. Fill the bottle with oil in the east pit, oil the rusty door, take the trident, and use the trident to open the clam. The pearl rolls away and must be recovered from its destination.

</details>

<details>
<summary>Eggs, troll, bear, and chain</summary>

**Gentle:** Some treasures are useful before they are deposited.

**Stronger:** The troll wants payment. The bear wants food and then freedom.

**Answer:** Throw a treasure, often the eggs, to the troll. Later use FEE/FIE/FOE/FOO to recover the eggs. Feed the bear, unlock the chain, take the chain, and lead the bear through the bridge outcome.

</details>

<details>
<summary>Batteries and vending machine</summary>

**Gentle:** Coins have a second use.

**Stronger:** Spending the coins solves a lamp problem but sacrifices their deposit value.

**Answer:** Drop the coins at the vending machine to create fresh batteries. This removes the coins from play for building-deposit scoring.

</details>

<details>
<summary>Pirate and chest</summary>

**Gentle:** If treasure vanishes, it is not necessarily gone forever.

**Stronger:** The pirate's stash is in the all-alike maze region.

**Answer:** In this port, carrying an eligible treasure into the represented west Hall of Mists approach triggers deterministic pirate theft. Recover the stolen treasure and chest from the pirate dead end.

</details>

<details>
<summary>Dwarf, axe, ogre, and ruby</summary>

**Gentle:** The first dwarf encounter gives you something useful.

**Stronger:** The axe matters for dwarf combat and the ogre route.

**Answer:** Take the axe after the represented first dwarf encounter. Use `throw axe at dwarf` for the dwarf slice. The ogre/ruby route is a deterministic bounded implementation of the native-shaped dwarf/ogre dependency.

</details>

<details>
<summary>Cave closing and endgame</summary>

**Gentle:** When the cave starts closing, ordinary exits are no longer reliable.

**Stronger:** The repository is a special endgame space. The rusty-mark rod matters.

**Answer:** For deterministic smoke tests, the port has scaffold-only `testclose` helpers. In the repository victory route, move the rusty-mark rod away from the southwest side, return southwest, and `blast`.

</details>

## Need the full route?

Use `walkthrough.md` for the complete command route.
