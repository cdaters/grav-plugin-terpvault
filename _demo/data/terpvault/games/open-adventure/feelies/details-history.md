# Open Adventure: History And Port Context

Before graphical adventures, before Zork, and before most of the vocabulary of
interactive fiction existed, there was Adventure.

William Crowther wrote the first version after years of cave exploration and
mapping, drawing on real caving terminology, fantasy role-playing, and the idea
that a computer could answer simple natural-language commands. Don Woods later
found the game at Stanford, contacted Crowther, and expanded it into the
classic Colossal Cave Adventure that spread across academic and hobbyist
computing.

Open Adventure is Eric S. Raymond's forward-port of the Crowther/Woods
Adventure 2.5 lineage. That lineage keeps the familiar cave, magic words,
treasures, dwarves, pirate, and repository endgame while using a 430-point
scoring model.

This package seed describes an Inform 6 / Z-machine port of ESR Open Adventure.
The goal is not to imitate every native engine detail byte-for-byte, but to make
the game playable in Z-machine interpreters while staying honest about source
behavior. Where native behavior depends on broad randomness or engine state,
the port uses documented deterministic slices so the result can be tested and
played reliably in a browser.

Native oracle baseline:

```text
993291a21da44234ae9cf303d0ffc0df19ec3c31
```
