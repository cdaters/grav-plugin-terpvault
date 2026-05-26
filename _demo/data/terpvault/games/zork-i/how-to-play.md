# How to Play

Zork I is a parser game. Type short commands and press Enter. Most commands use a verb, sometimes followed by a noun.

Useful basics:

- `look` describes your current location again.
- Compass directions move around: `north`, `south`, `east`, `west`, `up`, and `down`. Short forms like `n`, `s`, `e`, `w`, `u`, and `d` usually work.
- `inventory` shows what you are carrying.
- `examine lamp` or `look at lamp` inspects an object.
- `take lamp` picks something up.
- `drop lamp` puts something down.
- `open mailbox` opens a container or door when possible.
- `read leaflet` reads an object when the game supports it.

Parser games reward careful observation. If a command fails, try a simpler verb or inspect the room and objects again.

Saving and restoring depend on the interpreter. In Parchment, use the story's own `save` and `restore` commands when you want to preserve progress.
