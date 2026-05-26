# Zork I Walkthrough

**Full spoiler warning:** this document discusses major routes, puzzle solutions, treasure handling, and late-game goals. If you want a lighter push, read `hints.md` first.

## About this walkthrough

This is an original TerpVault walkthrough for the selected source-built Zork I story file, Release 119 / Serial 880429. It was developed through source review and play-through checks against the packaged story file.

The prose below is rewritten for this package. It is not copied from Infocom manuals, Invisiclues, commercial hint books, or online walkthrough text.

Several command chunks were checked directly in Frotz against this package's `zork1.z3`, including the early house route, troll route, temple/coffin setup, and dam control sequence. A final full-route transcript attempt was also run with `dfrotz`; it reached 85 of 350 points before going off-route during the reservoir/boat and later coal-mine sequence. The full 350-point route has not been replayed end to end, mostly because Zork I has random combat, thief behavior, and route-sensitive inventory/navigation constraints. Treat the later sections as source-assisted route guidance until the package receives a clean full transcript pass.

## Quick survival notes

Save often. The troll fight is random, the thief can steal treasures, and some puzzles can become awkward if you carry too much or leave crucial objects in unsafe places.

Keep the brass lantern for dark areas, but turn it off whenever you are safely outside or carrying another light source. The lamp battery is finite.

The living room trophy case is the scoring hub. Most treasures should eventually be returned there. The thief generally does not raid the living room, so it is also a good staging area.

Inventory limits matter. If a command fails with a load warning, return to the living room, store treasures in the case, or drop a no-longer-needed tool in a safe place.

Do not count on killing the thief early. Build score and collect tools first. The thief is dangerous, and he may already be carrying treasures you need later.

## Before you begin

This walkthrough assumes a normal fresh game. Command wording is intentionally plain: short compass directions, simple object names, and direct verbs such as `get`, `open`, `put`, `drop`, `turn on`, and `tie`.

Where the route says to attack a foe repeatedly, repeat the command until the game clearly reports success. If you die or lose an important object to randomness, restore and try again.

## Opening: The White House and Mailbox

You begin west of the white house. The mailbox and leaflet are optional for completion, but they set the tone and are worth reading on a first play.

A fast route into the house is:

```text
s
e
open window
enter house
```

Inside, go west to the living room. Take the lamp, move the rug, and open the trap door. The sword is also here, but it is easiest to collect it after you have made the first painting run.

```text
w
get lamp
move rug
open trap door
turn on lamp
```

## Getting inside and making the first score

Go down into the cellar, then south and east to the gallery. Take the painting and climb back out through the studio chimney to the kitchen.

```text
d
s
e
get painting
n
u
u
```

From the attic, take the rope. The knife is optional; it is not needed for this route, but picking it up and dropping it in the living room is harmless. Return to the living room, open the trophy case, and put the painting inside.

```text
get rope
d
w
open case
put painting in case
```

Now take the sword, reopen the trap door, and go back down.

```text
get sword
open trap door
d
```

## The troll and the deeper cave

North of the cellar is the troll. You need the sword. Combat is random; repeat the attack until the troll dies. After the troll is gone, drop the sword to reduce your carried load. The route below was tested in Frotz with a fixed interpreter seed and succeeded after several swings.

```text
n
kill troll with sword
kill troll with sword
kill troll with sword
kill troll with sword
kill troll with sword
drop sword
```

From the troll room, head through the round room toward the dome. Tie the rope to the railing and climb down to the torch room.

```text
e
e
se
e
tie rope to railing
climb down rope
```

The torch is both useful and valuable. If you take it, you can conserve lamp power in several later areas, but watch your load.

## Temple, coffin, and sceptre

From the torch room, go south to the temple and east to the Egyptian room. The coffin is heavy, so make sure you are not carrying the sword or extra treasures.

```text
s
e
get coffin
```

Return west, go south to the altar, and `pray`. This moves you back outside near the forest. From there, navigate to the canyon route. The intended route uses the canyon descent to open the coffin and obtain the sceptre.

```text
w
s
pray
```

The coffin/sceptre pickup was checked in Frotz after adjusting inventory. The exact canyon positioning and rainbow treasure sequence still needs a final transcript pass. The intended puzzle chain is: carry the coffin out of the underground, open it, take the sceptre, and use the sceptre at the rainbow area to make the pot of gold available.

## Dam and reservoir

The dam controls whether parts of the reservoir are passable. The core tool sequence was checked in Frotz from a fresh route after the troll was cleared:

1. From the underground, reach the dam lobby.
2. Take the matches.
3. Take the wrench and screwdriver from the maintenance area.
4. Press the yellow button.
5. Turn the bolt with the wrench.

A compact command sketch from the underground side is:

```text
n
e
n
ne
e
n
get matches
n
get wrench
get screwdriver
push yellow button
s
s
turn bolt with wrench
```

After the water level changes, `down` from the dam reaches Dam Base and reveals the folded plastic boat. This dam-control chunk was verified in Frotz. Keep the screwdriver for the coal machine. The wrench can usually be dropped after the bolt is turned.

## Bell, book, candles, and the Land of the Dead

The altar area contains the bell, book, and candles used for the exorcism puzzle. The broad solution is:

1. Carry the bell, book, candles, and a way to make fire.
2. Enter the lower area from the altar.
3. Ring the bell.
4. Light a match.
5. Light the candles with the match.
6. Read the book.

Command sketch:

```text
get bell
get book
get candles
go hole
d
ring bell
light match
light candles with match
read book
```

After the exorcism, the skull can be taken. The source confirms `EXORCISE` vocabulary exists, but the traditional bell/candles/book ritual is the route to use for this package walkthrough.

## Coal mine and diamond

The coal mine and basket puzzle convert coal into the diamond. The important objects are the coal, basket, machine, screwdriver, and torch. The reference route uses the basket to move objects between levels, then uses the screwdriver on the machine switch.

High-level route:

1. Put the torch in the basket before entering the coal mine route.
2. Navigate through the mine to the coal.
3. Bring coal back to the basket area.
4. Lower the basket, retrieve the coal and tools below, and use the machine.
5. Put the coal into the machine, close the lid, and turn the switch with the screwdriver.
6. Open the lid and take the diamond.

Command sketch for the machine step:

```text
open lid
put coal in machine
close lid
turn switch with screwdriver
open lid
get diamond
```

This section still needs a full play-through transcript because the mine route is easy to mistype and should be tested from a saved position before final package approval.

## River, boat, buoy, emerald, and scarab

Once the dam is opened and the reservoir route is available, collect the air pump, trunk, and trident as inventory allows. The inflatable boat gives access to the river sequence.

Core river actions:

```text
inflate boat with pump
get in boat
launch
```

Wait until the buoy appears, take it, and land at the beach. The buoy contains the emerald. The scarab is found by digging at the sandy area; repeated digging can be dangerous, so save first.

```text
wait
get buoy
get out
open buoy
get emerald
dig with shovel
```

Repeat `dig with shovel` only until the scarab appears. If the sand buries you, restore.

## Maze, thief, cyclops, egg, and treasure room

The thief and maze are the least deterministic parts of the route. The thief can steal objects and move treasures, so use the living room case as often as possible.

The cyclops has a clean non-combat solution. In the cyclops room, say either:

```text
ulysses
```

or:

```text
odysseus
```

The source confirms both words are accepted. After the cyclops leaves, the route opens toward the thief's treasure room and a useful shortcut back to the living room.

The jeweled egg puzzle should be handled carefully. Do not break the egg yourself. The usual route is to let the thief open it, then recover the opened egg and its contents later.

## Treasure collection checklist

The source marks the following as treasure-bearing or score-relevant objects. The final route should place treasures in the trophy case when practical:

- painting
- gold coffin
- sceptre
- pot of gold
- torch
- skull
- diamond
- jade figurine
- sapphire bracelet
- trunk of jewels
- trident
- emerald
- scarab
- bag of coins
- chalice
- jeweled egg and its contents, if preserved correctly
- platinum bar

The maximum score in the verified source is 350. The package walkthrough should not claim a complete 350-point path until the final command transcript reaches that result.

## Partially verified command route

The following route was tested interactively in Frotz against the selected DDEV package story file through the troll, dome, temple approach, coffin pickup, and sceptre retrieval setup. The troll fight may require fewer or more attacks depending on randomness.

```text
s
e
open window
enter house
w
get lamp
move rug
open trap door
turn on lamp
d
s
e
get painting
n
u
u
get rope
d
w
open case
put painting in case
get sword
open trap door
d
n
kill troll with sword
kill troll with sword
kill troll with sword
kill troll with sword
kill troll with sword
drop sword
e
e
se
e
tie rope to railing
climb down rope
s
e
get coffin
w
s
pray
```

From this point, continue with the canyon/rainbow route and then return treasures to the living room trophy case. That continuation should be fully transcript-tested before this walkthrough is treated as final.

## Remaining verification notes

Verified in Frotz during this pass:

- package story file launches as Release 119 / Serial 880429
- white-house entry route
- lamp, rug, trap-door, cellar route
- painting collection and trophy-case deposit
- attic rope collection
- troll fight with sword using repeated attacks
- dropping the sword after the troll to manage inventory
- dome rope setup and descent
- temple/Egyptian-room path
- coffin pickup after inventory adjustment
- prayer exit from the altar area
- coffin opening and sceptre retrieval from an outdoor canyon position

Source/play-through assisted but not fully replayed end to end in this pass:

- full reservoir and river route after the dam opens
- coal mine and machine route
- river and scarab route
- thief, cyclops, egg, chalice, and final 350-point cleanup

Before copying a finished package into `_demo`, run a clean full-game transcript against this exact `zork1.z3`, update this walkthrough with the verified late-game command route, and confirm the final score path.
