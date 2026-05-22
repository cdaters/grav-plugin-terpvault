# Walkthrough

> **Spoiler warning:** This page gives structural guidance for the classic 350-point *Adventure* / *Colossal Cave Adventure* route. It is not intended as a perfect command transcript. Random events, parser differences, inventory limits, and the exact `Advent.z5` build can change the cleanest path.

If you want the real first-time experience, start with **How to Play** and **Hints** first. Use this page when the cave has started chewing on your boots.

## Goal

Your broad goal is to explore the cave, solve its puzzles, collect treasures, and return those treasures to the proper safe location. A full-score run is as much about planning and inventory management as it is about solving individual puzzles.

## Phase 1: Prepare outside the cave

1. Explore the starting area.
2. Enter the building.
3. Collect the essential supplies.
4. Find the grate.
5. Unlock and open it.
6. Enter the cave with the lamp.

Useful command patterns:

```text
ENTER BUILDING
TAKE LAMP
TAKE KEYS
TAKE BOTTLE
TAKE FOOD
UNLOCK GRATE
OPEN GRATE
DOWN
LIGHT LAMP
```

If your version supports `TAKE ALL`, it may speed up the opening. If not, collect items individually.

## Phase 2: Establish your cave route

Once underground, begin mapping immediately. Early rooms teach you the game's logic: passages may loop, descriptions matter, and useful items are often placed near the puzzle they affect.

Early priorities:

- Learn the route between the building and the deeper cave.
- Locate the cage.
- Notice the black rod.
- Find the bird.
- Identify the snake obstacle.
- Discover your first treasure areas.

Important reminder: the bird may not cooperate if you are carrying the rod. Drop the rod before trying to capture the bird.

## Phase 3: Solve the first creature puzzle

The snake blocks progress in an important area. You do not usually solve this by attacking it directly.

General solution path:

1. Get the cage.
2. Capture the bird.
3. Bring the bird to the snake.
4. Release or drop the bird where the snake is blocking the way.

This opens more of the cave and makes additional treasures reachable.

## Phase 4: Use objects where the cave hints at them

Some classic objects have very particular uses:

- The **black rod** affects certain cave obstacles when waved.
- The **bottle** can carry liquids.
- The **food** is not merely a snack.
- The **axe** becomes important after the dwarf encounter.
- The **pillow** matters for at least one fragile treasure.

Do not assume treasure can simply be grabbed and hauled out. Some treasures require a setup step before they can be safely moved.

## Phase 5: Use magic words as shortcuts

The game contains magic words that function as travel shortcuts or puzzle mechanisms. When you discover an odd word, write it down exactly and test it in the place that seems connected to it.

Important magic words include:

```text
XYZZY
PLUGH
PLOVER
```

These are not random Easter eggs. They are part of the cave's transportation logic.

## Phase 6: Collect and deposit treasures

A treasure run usually works best in trips rather than one heroic loot-goblin sprint.

Recommended rhythm:

1. Explore a region.
2. Solve the local puzzle.
3. Collect one or more treasures.
4. Return them to the building/well-house area.
5. Drop them there.
6. Save.
7. Re-enter the cave for the next region.

Expect to juggle inventory. The lamp is usually non-negotiable underground, so plan around it.

## Phase 7: Handle hazards

### Dwarves

After the dwarf event introduces the axe, retrieve it and keep it available. Later dwarf encounters may require quick violence, because apparently cave labor relations in the 1970s were complicated.

Typical pattern:

```text
THROW AXE AT DWARF
TAKE AXE
```

Parser wording varies, so simplify if needed:

```text
THROW AXE
GET AXE
```

### Pirate

The pirate may steal treasure and hide it. This is annoying, but also part of a complete game. If treasure disappears, keep exploring and map the maze carefully. His stash can be found.

### Darkness

Do not wander without the lamp. Do not waste lamp time if you are lost. Restore from a save if needed.

## Phase 8: Solve the maze

The famous maze is intentionally hostile to casual mapping.

The classic technique:

1. Carry several low-value objects.
2. Drop a different object in each maze room.
3. Move one direction at a time.
4. Record where you arrive based on which object is present.
5. Build a room-by-room map from your markers.

This turns the maze from nonsense soup into a graph. A very rude graph, but still a graph.

## Phase 9: Late-game treasures and special regions

As you reach deeper areas, puzzles become more object-specific and less forgiving. Watch for:

- Fragile treasure that needs protection.
- A plant that responds to liquid.
- A troll bridge puzzle.
- A bear-related solution.
- A dragon that invites a very direct question.
- A clam/oyster sequence involving another object.
- A tight passage that restricts what you can carry.

If a command seems absurd but the game asks a follow-up question, pay attention. *Adventure* sometimes hides progress behind a joke-shaped door.

## Phase 10: Cave closing and endgame

After enough progress, the cave eventually enters its closing sequence. At that point, the game changes from open exploration to a final puzzle area.

Before this happens, you ideally want to have:

- Found and deposited the treasures you can.
- Mapped the major regions.
- Preserved your lamp time.
- Saved your game.

The final repository puzzle requires close reading and one decisive action. If you have the right setup, the command `BLAST` becomes important.

## Full-score note

A perfect 350-point solution is highly route-sensitive. Exact command transcripts exist, but they can fail if random dwarf or pirate events occur at different times, or if your specific `Advent.z5` build phrases commands differently.

For this site, the friendlier approach is to give players this guided route first, then point determined treasure-goblins toward an external full-score transcript only after a spoiler warning.

## External full-spoiler resources

For players who truly want the cave unmasked, look for a dedicated 350-point walkthrough for the Crowther/Woods version of *Adventure*. Rick Adams' Colossal Cave pages and StrategyWiki both preserve walkthrough material for the classic game.
