# Zork III Walkthrough

**Full spoiler warning:** this guide gives away puzzle solutions, route structure, and the path to the ending. If you want gentler nudges, start with `hints.md`.

## About this walkthrough

This walkthrough is for the TerpVault Zork III candidate package using `zork3.z3`, Release 25 / Serial 860811.

The command route below was verified against the exact packaged story file on 2026-05-31 with Frotz 2.55's dumb interface:

- Story SHA-256: `2264d4f97d4d5812220c5278ee043f69aea583f9c4e4dca2b9d785ba16b9e260`
- Interpreter command: `/opt/homebrew/bin/dfrotz -p -m -s 41 /Users/cdaters/Sites/grav2.0-ddev/user/data/terpvault/games/zork-iii/zork3.z3`
- Verified result: ending reached
- Final score: 7 of 7
- Final move count: 330

The route was built from local solution transcripts, checked against the source-built package artifact, and rewritten as original TerpVault guidance. Zork III is quieter and more final-test oriented than Zork I; observation, patience, and judgment matter as much as inventory handling.

## Quick survival notes

- Save often, especially before the Scenic Vista table, the lake, the Land of Shadow, the cliff, the museum, the Royal Puzzle, and the Dungeon Master endgame.
- Map carefully. A few routes are one-way or time-sensitive.
- Watch timed scenes. `wait` is sometimes a real puzzle command.
- Do not assume every obstacle is solved by force.
- In the verified route, one early `up` command after retrieving the can is kept as a timing-preserving command. It is harmless in the transcript and helps keep later timed/random scenes aligned for the fixed-seed verification.
- When a character behaves like a test, think before acting.

## Before you begin

The command route uses direct parser commands, one per line. It is intended to be typed or pasted into the packaged Release 25 / Serial 860811 story. If you are playing interactively rather than replaying the exact route, save before the timed or randomized sections and be ready to adapt.

This is a completion route and a full-potential route for the verified transcript. It is not optimized for fewest moves. The fixed-seed run uses `dfrotz -s 41`; without a fixed seed, the ship, shadow, and old-man timing may require small adjustments.

## Opening: Lamp, Lake, and Scenic Vista

The opening teaches two important habits: keep track of light, and do not waste turns in the cold lake.

Take the lamp, turn it on, and head south to the lake. Leave the lamp behind before entering the water. Dive once, take the shiny object, then surface and swim west to the Scenic Vista.

At the Scenic Vista, the table cycles through destinations. The verified route uses it first to fetch the grue repellent, then again to place the torch in the Damp Passage for later recovery.

## The Dark Route to the Key

Return to the lake and re-enter the water. The can slips from your grasp once; take it again, surface, and cross to the southern shore. Spray yourself with repellent before continuing through the dark route to the Key Room.

Take the key, open the manhole, and follow the aqueduct route until you recover the torch in the Damp Passage.

## Ship, Cliff, and Museum

At the Flathead Ocean, the verified route waits for the Viking ship, greets the sailor twice, and takes the vial. Keep the vial for the guardians much later.

At the cliff, take the waybread before descending. Wait for help, tie the rope to the chest, then grab the rope once it returns.

The Great Door area opens after a timed underground disturbance. The verified route waits there until the museum entrance is available.

In the museum, push the gold machine into the Jewel Room before using it. The useful past year is `776`; the return year is `948`. Hide the ring under the seat before returning to the present, then retrieve it from beneath the seat.

## Royal Puzzle and Shadow

Save before entering the Royal Puzzle if you are playing by hand. The wall route is exact, and a wrong move can leave the puzzle state awkward enough that restoring is easier than repairing.

After the Royal Puzzle, the route goes through the Land of Shadow. Fight the hooded figure only until the hood can be taken. Then take the cloak and leave.

## Old Man, Beam, and Box

The old man appears when you enter the Engravings area. If he is absent, leave and re-enter; the verified route does this several times. Wake him and give him the waybread, then open the secret door.

Break the beam with the sword, press the button, and enter the box. The box sequence below raises the short pole, rotates the compass by pushing the red panel six times, lowers the pole, moves the box with the mahogany panel, and exits through the pine panel.

Drink the potion from the vial before approaching the guardians.

## Dungeon Master Endgame

Before knocking, the route has the hood, cloak, ancient book, wooden staff, torch, key, amulet, and ring. Knock at the Dungeon Entrance.

In the endgame, the Dungeon Master follows instructions. Use him to operate the dial and button while you are inside the cell. Once the illusion is broken, unlock and open the bronze door with the strange key, then go south.

## Verified command route

```text
take lamp
turn on lamp
south
south
south
south
drop lamp
enter lake
down
get object
up
west
south
take torch
wait
wait
wait
touch table
take can
wait
wait
wait
touch table
drop torch
wait
wait
north
enter lake
down
get can
get can
up
south
south
spray can on me
south
east
take key
open manhole
down
north
north
down
take torch
west
west
northwest
southwest
south
wait
wait
wait
wait
hello sailor
hello sailor
take vial
north
northeast
southeast
west
take bread
down
wait
wait
tie rope to chest
wait
wait
wait
grab rope
east
east
south
east
east
south
south
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
wait
east
open wooden door
north
push gold machine south
open stone door
push gold machine east
enter gold machine
set dial to 776
push button
take ring
wait
wait
wait
wait
open door
open door
west
open wooden door
north
put ring under seat
enter gold machine
set dial to 948
push button
get out of gold machine
look under seat
open wooden door
south
open stone door
east
take all
read plaque
west
south
down
push east wall
south
southwest
push south wall
east
east
push south wall
north
north
east
push south wall
take book
push south wall
east
northeast
push west wall
push west wall
push west wall
push west wall
northeast
northeast
north
push east wall
southwest
south
southeast
northeast
north
push west wall
northwest
push south wall
push south wall
west
northwest
northwest
push south wall
southeast
southeast
southeast
northeast
push west wall
push west wall
southwest
push north wall
push north wall
push north wall
northwest
up
north
west
north
north
west
west
south
west
wait
wait
attack figure with sword
take hood
attack figure with sword
take hood
attack figure with sword
take hood
attack figure with sword
take hood
attack figure with sword
take hood
attack figure with sword
take hood
take cloak
east
north
east
northeast
southwest
northeast
southwest
northeast
southwest
northeast
southwest
northeast
wake man
give bread to man
open door
down
north
break beam with sword
south
push button
north
north
north
lift short pole
push red panel
push red panel
push red panel
push red panel
push red panel
push red panel
lower short pole
push mahogany panel
push mahogany panel
push mahogany panel
push pine panel
out
north
open vial
drink potion
north
north
north
inventory
knock on door
north
east
north
north
set dial to 4
push button
south
open cell door
south
master, close door
master, go north
master, turn dial to 6
master, push button
unlock bronze door with key
open bronze door
south
score
```

## Completion notes

The verified transcript reaches the Treasury of Zork, triggers the ending, and reports `Your potential is 7 of a possible 7, in 330 moves.`

The transcript is stored outside the plugin repo at `/private/tmp/zork3-transcript-working-20260531.txt`; the route file is `/private/tmp/zork3-route-working-20260531.txt`; debug notes are `/private/tmp/zork3-route-debug-notes-20260531.md`.
