# v0.1.0
## 05/21/2026

1. [](#new)
    * Initial TerpVault plugin foundation.
    * Added package-folder model using `user/data/terpvault/games/{slug}/game.yaml`.
    * Added virtual library, detail, and play pages under `/if`.
    * Added controlled story-file and package-asset serving routes.
    * Added cover, splash, screenshot, hints, walkthrough, and how-to-play support.
    * Added simple native `[terpvault game="slug"]` embed pattern.
    * Added Admin2 sidebar/page scaffold with read-only package discovery.
    * Added Parchment adapter placeholder.
    * Added demo package structure.

2. [](#improved)
    * Designed player layer as an adapter rather than hard-coding one interpreter forever.

3. [](#todo)
    * Bundle or document a local Parchment install workflow.
    * Add Admin2 upload/edit/import UI.
    * Add save-slot UX.
    * Add iFiction/Treaty of Babel metadata support.
